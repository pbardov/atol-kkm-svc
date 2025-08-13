import {Inject, Injectable, Logger} from '@nestjs/common';
import atolKkmConfig, {AtolKkmConfig} from './atol-kkm.config.js';
import AtolRpc, {isSettings, Settings} from '@pbardov/node-atol-rpc';
import {FiscalTask, isFiscalTask} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import loadSettingsFile from '../common/util/load-settings-file.js';
import {DocumentItem, isDocumentItem} from '@pbardov/node-atol-rpc/dist/types/document-item.js';
import ReceiptRepository from './receipt.repository.js';

@Injectable()
export default class AtolKkmService {
	private readonly logger = new Logger(AtolKkmService.name);
	private readonly kkm = new AtolRpc();
	private readonly receiptTpl: Partial<FiscalTask>;
	private readonly receiptItemTpl: Partial<DocumentItem>;

	constructor(
		@Inject(atolKkmConfig.KEY) config: AtolKkmConfig,
		private readonly receiptRepository: ReceiptRepository
	) {
		const {kkmConfig, receiptTpl, receiptItemTpl} = config;

		const kkmSettings = loadSettingsFile(kkmConfig);
		if (!isSettings(kkmSettings)) {
			throw new Error(`Структура файла конфигурации ${kkmConfig} не верна`);
		}

		this.kkm.setSettings(kkmSettings);
		this.logger.log('Загружена конфигурация:', kkmSettings);

		if (receiptTpl) {
			this.receiptTpl = loadSettingsFile(receiptTpl);
		}

		if (receiptItemTpl) {
			this.receiptItemTpl = loadSettingsFile(receiptItemTpl);
		}
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
		const receipt = await this.receiptRepository.findOneBy({id: receiptId});
		if (!receipt) {
			throw new Error(`Чек ID ${receiptId} не найден`);
		}

		if (!receipt.result) {
			receipt.result = await this.withKkm(async (kkm) => {
				return kkm[receipt.type](receipt.payload);
			});
			await this.receiptRepository.save(receipt);
		}

		return receipt;
	}

	async addReceiptItem(receiptId: string, data: Partial<DocumentItem>) {
		const item = {...this.receiptItemTpl, ...data};
		if (!isDocumentItem(item)) {
			throw new Error('Неверный DocumentItem', {cause: item});
		}

		const receipt = await this.receiptRepository.findOneBy({id: receiptId});
		if (!receipt) {
			throw new Error(`Чек ID ${receiptId} не найден`);
		}

		receipt.payload.items.push(item);
		await this.receiptRepository.save(receipt);
		return item;
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
