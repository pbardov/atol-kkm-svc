import {Inject, Injectable, Logger, Optional} from '@nestjs/common';
import {setTimeout as delay} from 'node:timers/promises';
import {EventEmitter2} from '@nestjs/event-emitter';
import atolKkmConfig, {AtolKkmConfig} from './atol-kkm.config.js';
import AtolRpc, {isSettings} from '@pbardov/node-atol-rpc';
import {FiscalTask, isFiscalTask} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import loadSettingsFile from '../common/util/load-settings-file.js';
import {DocumentItem, isDocumentItem} from '@pbardov/node-atol-rpc/dist/types/document-item.js';
import ReceiptRepository from './receipt.repository.js';
import {ImcParamsValidation} from '@pbardov/node-atol-rpc/dist/types/imc-params.js';
import Redis from 'ioredis';
import {Mutex} from 'redis-semaphore';
import {
	GetMarkingCodeValidationStatusTaskResult
} from '@pbardov/node-atol-rpc/dist/types/get-marking-code-validation-status.task-result.js';
import MarkingCodeRepository from './marking-code.repository.js';
import {ValidateMarkAction} from './validate-mark-action.js';
import MarkingCode from '../database/entity/marking-code.js';

@Injectable()
export default class AtolKkmService {
	private readonly logger = new Logger(AtolKkmService.name);
	private readonly kkm = new AtolRpc();
	private readonly receiptTpl: Partial<FiscalTask>;
	private readonly receiptItemTpl: Partial<DocumentItem>;
	private readonly redisClient: Redis;
	private readonly lockPrefix: string;
	private readonly markingCodeCheckInterval: number;
	private readonly markingCodeCheckTimeout: number;

	constructor(
		@Inject(atolKkmConfig.KEY) config: AtolKkmConfig,
		private readonly receiptRepository: ReceiptRepository,
		private readonly markingCodeRepository: MarkingCodeRepository,
		@Optional() private readonly emitter?: EventEmitter2
	) {
		const {kkmConfig, receiptTpl, receiptItemTpl, redisUrl, lockPrefix, markingCodeCheckInterval, markingCodeCheckTimeout} = config;

		const kkmSettings = loadSettingsFile(kkmConfig);
		if (!isSettings(kkmSettings)) {
			throw new Error(`Структура файла конфигурации ${kkmConfig} не верна`);
		}

		this.kkm.setSettings(kkmSettings);
		this.logger.log('Загружена конфигурация:', kkmSettings);

		if (receiptTpl) {
			this.receiptTpl = loadSettingsFile(receiptTpl)!;
		}

		if (receiptItemTpl) {
			this.receiptItemTpl = loadSettingsFile(receiptItemTpl)!;
		}

		this.redisClient = new Redis(redisUrl);
		Object.assign(this, {
			lockPrefix,
			markingCodeCheckInterval,
			markingCodeCheckTimeout,
		});
	}

	async openReceipt(data: Partial<FiscalTask>) {
		const payload = {...this.receiptTpl, ...data};
		if (!isFiscalTask(payload)) {
			throw new Error('Неверные данные чека', {cause: payload});
		}

		const receipt = this.receiptRepository.create({type: payload.type, payload});
		await this.receiptRepository.save(receipt);

		return receipt.id;
	}

	async getReceipt(receiptId: string) {
		const receipt = await this.receiptRepository.findOneBy({id: receiptId});
		if (!receipt) {
			throw new Error(`Чек ID ${receiptId} не найден`);
		}

		return receipt;
	}

	async fiscalizeReceipt(receiptId: string) {
		return await this.receiptRepository.manager.transaction(async transactionalEntityManager => {
			const receipt = await transactionalEntityManager.findOneBy(this.receiptRepository.target, {id: receiptId});
			if (!receipt) {
				throw new Error(`Чек ID ${receiptId} не найден`);
			}

			if (!receipt.result) {
				receipt.result = await this.withKkm(async (kkm) => {
					return kkm[receipt.type](receipt.payload);
				});
				await transactionalEntityManager.save(receipt);
			}

			return receipt;
		});
	}

	async addReceiptItem(receiptId: string, data: Partial<DocumentItem>) {
		const item = {...this.receiptItemTpl, ...data};
		if (!isDocumentItem(item)) {
			throw new Error('Неверный DocumentItem', {cause: item});
		}

		return await this.receiptRepository.manager.transaction(async transactionalEntityManager => {
			const receipt = await transactionalEntityManager.findOneBy(this.receiptRepository.target, {id: receiptId});

			if (!receipt) {
				throw new Error(`Чек ID ${receiptId} не найден`);
			}

			receipt.payload.items.push(item);
			await transactionalEntityManager.save(receipt);

			return item;
		});
	}

	async validateMarkBegin(imcParam: ImcParamsValidation) {
		const repo = this.markingCodeRepository;
		const mcId = repo.calcId(imcParam.imc);
		const mc = repo.create({
			id: mcId.toString('hex'),
			imc: imcParam.imc,
			imcType: imcParam.imcType,
			params: imcParam,
			validationStarted: new Date()
		});
		await repo.upsert(mc, ['id']);
		this.emitter?.emit('validateMark.begin', mc);

		return mc;
	}

	async validateMark(mc: MarkingCode, action: ValidateMarkAction, timeout = this.markingCodeCheckTimeout) {
		const mutex = new Mutex(this.redisClient, `${this.lockPrefix}validateMark`);
		await mutex.acquire();
		try {
			const repo = this.markingCodeRepository;

			const duration = (d = new Date()) => d.getTime() - mc.validationStarted.getTime();

			this.logger.log(`Begin marking code validation ${mc.id}`);
			return await this.withKkm(async kkm => {
				try {
					await kkm.beginMarkingCodeValidation({params: mc.params});

					let validationResult: GetMarkingCodeValidationStatusTaskResult;
					do {
						validationResult = await kkm.getMarkingCodeValidationStatus();
						mc.validationCompleted = new Date();
						mc.validationResult = validationResult;
						mc.isReady = validationResult.ready;
						mc.isValid = repo.isImcValid(validationResult);

						if (!validationResult.ready) {
							if (duration() > timeout) {
								throw new Error(`Marking code validation ${mc.id} timeout`);
							}

							await repo.upsert(mc, ['id']);
							this.emitter?.emit('validateMark.update', mc);

							await delay(this.markingCodeCheckInterval);
						}
					} while (!validationResult.ready);

					if (!mc.isReady || !mc.isValid) {
						throw new Error(`Marking code validation ${mc.id} fail`);
					}
				} finally {
					const actionTask = mc.isReady && mc.isValid ? action.success : action.fail;
					await kkm.processJsonTask({type: actionTask});

					mc.action = actionTask;
					mc.validationCompleted = mc.validationCompleted ?? new Date();
					await repo.upsert(mc, ['id']);
					this.emitter?.emit('validateMark.complete', mc);

					this.logger.log(`Marking code validation ${mc.id} complete ${
						JSON.stringify({isReady: mc.isValid, isValid: mc.isValid, actionTask, duration: duration(mc.validationCompleted)})
					}\n${JSON.stringify(mc.validationResult, null, '  ')}`);
				}

				return mc;
			});
		} finally {
			await mutex.release();
		}
	}

	async validateMarkStatus(id: string) {
		return this.markingCodeRepository.findOneBy({id});
	}

	async withKkm<R>(callback: (kkm: AtolRpc) => R | Promise<R>): Promise<R> {
		try {
			this.kkm.open();
			return await callback(this.kkm);
		} finally {
			this.kkm.close();
		}
	}
}
