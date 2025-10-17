import {
	Body,
	Controller,
	Get,
	HttpException,
	Inject, Logger,
	Param,
	ParseBoolPipe,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseInterceptors
} from '@nestjs/common';
import FlattenFormatInterceptor from '../common/interceptors/flatten-format.interceptor.js';
import httpConfig, {HttpConfig} from './http.config.js';
import AtolKkmService from '../atol-kkm/atol-kkm.service.js';
import {FiscalTask} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import {DocumentItem} from '@pbardov/node-atol-rpc/dist/types/document-item.js';
import TypeGuardPipe from '../common/pipes/type-guard.pipe.js';
import {isValidateMarkParams, ValidateMarkParams} from './validate-mark-params.js';
import {JsonTaskType} from '@pbardov/node-atol-rpc/dist/types/json-task-type.js';
import {JsonTaskMap} from '@pbardov/node-atol-rpc/dist/types/json-task.map.js';
import MarkingCode from '../database/entity/marking-code.js';
import {JsonTaskParam} from '@pbardov/node-atol-rpc/dist/types/json-task.js';
import {CloseShiftTask, OpenShiftTask} from '@pbardov/node-atol-rpc/dist/types/shift.task.js';

@Controller('/api')
@UseInterceptors(FlattenFormatInterceptor)
export default class ApiController {
	protected readonly logger = new Logger(ApiController.name);

	constructor(
		public readonly kkmSvc: AtolKkmService,
		@Inject(httpConfig.KEY) private readonly config: HttpConfig
	) {
		//
	}

	@Get('/')
	async info() {
		return this.kkmSvc.withKkm(async (kkm) => {
			const deviceInfo = await kkm.getDeviceInfo();
			const deviceStatus = await kkm.getDeviceStatus();
			const shiftStatus = await kkm.getShiftStatus();
			return {deviceInfo, deviceStatus, shiftStatus};
		});
	}

	@Post('/')
	async kkm<T extends JsonTaskType, P extends JsonTaskMap[T] = JsonTaskMap[T]>(
		@Body() params: JsonTaskParam<P> | P,
		@Query('type') taskType?: T
	) {
		const task = (taskType ? {...params, type: taskType} : params) as P;
		return this.kkmSvc.withKkm(kkm => kkm.processJsonTask(task));
	}

	@Post('/open-shift')
	async openShift(
		@Body() params: JsonTaskParam<OpenShiftTask> = {},
		@Query('electronically', new ParseBoolPipe({optional: true}))
		electronically?: boolean
	) {
		return this.kkmSvc.withKkm(kkm => kkm.openShift({...params, electronically: electronically ?? params.electronically ?? false}));
	}

	@Post('/close-shift')
	async closeShift(
		@Body() params: JsonTaskParam<CloseShiftTask> = {},
		@Query('electronically', new ParseBoolPipe({optional: true}))
		electronically?: boolean
	) {
		return this.kkmSvc.withKkm(kkm => kkm.closeShift({...params, electronically: electronically ?? params.electronically ?? false}));
	}

	@Post('/receipt')
	async openReceipt(@Body() data: Partial<FiscalTask>) {
		return this.kkmSvc.openReceipt(data);
	}

	@Get('/receipt/:id')
	async getReceipt(@Param('id') id: string) {
		return this.kkmSvc.getReceipt(id);
	}

	@Put('/receipt/:id')
	async fiscalizeReceipt(@Param('id') id: string) {
		return this.kkmSvc.fiscalizeReceipt(id);
	}

	@Post('/receipt/:id/item')
	async addReceiptItem(@Param('id') id: string, @Body() data: Partial<DocumentItem>) {
		return this.kkmSvc.addReceiptItem(id, data);
	}

	@Post('/validate-mark')
	async validateMark(
		@Body(new TypeGuardPipe(isValidateMarkParams))
		p: ValidateMarkParams,
		@Query('async', new ParseBoolPipe({optional: true}))
		asyncValidate = false,
		@Query('timeout', new ParseIntPipe({optional: true}))
		timeout?: number
	) {
		const mc: MarkingCode = await this.kkmSvc.validateMarkBegin(p.params);
		const validation: Promise<MarkingCode> = this.kkmSvc.validateMark(mc, p.action, timeout);
		if (asyncValidate) {
			// handle validation exceptions
			validation.catch(e => {
				this.logger.error(`Marking code validation ${mc.id} fail`, e);
			});

			return mc;
		}

		return validation;
	}

	@Get('/validate-mark/:id')
	async validateMarkStatus(@Param('id') id: string) {
		const mc = await this.kkmSvc.validateMarkStatus(id);
		if (!mc) {
			throw new HttpException(`Marking code validation ${id} not found`, 404);
		}

		return mc;
	}
}
