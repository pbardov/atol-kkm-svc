import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Param,
	Put,
	UseInterceptors,
	Query,
	ParseBoolPipe,
	HttpException, ParseIntPipe
} from '@nestjs/common';
import FlattenFormatInterceptor from '../common/interceptors/flatten-format.interceptor.js';
import httpConfig, {HttpConfig} from './http.config.js';
import AtolKkmService from '../atol-kkm/atol-kkm.service.js';
import {FiscalTask} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import {DocumentItem} from '@pbardov/node-atol-rpc/dist/types/document-item.js';
import {ImcParamsValidation, isImcParamsValidation} from '@pbardov/node-atol-rpc/dist/types/imc-params.js';
import TypeGuardPipe from '../common/pipes/type-guard.pipe.js';
import {isValidateMarkParams, ValidateMarkParams} from './validate-mark-params.js';

@Controller()
@UseInterceptors(FlattenFormatInterceptor)
export default class WwwController {
	constructor(
		public readonly kkmSvc: AtolKkmService,
		@Inject(httpConfig.KEY) private readonly config: HttpConfig
	) {
		//
	}

	@Get('/')
	async main() {
		const {deviceInfo, deviceStatus} = await this.kkmSvc.withKkm(async (kkm) => {
			const deviceInfo = await kkm.getDeviceInfo();
			const deviceStatus = await kkm.getDeviceStatus();
			return {deviceInfo, deviceStatus};
		});
		return {deviceInfo, deviceStatus};
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
		@Query(new ParseBoolPipe({optional: true}))
		asyncValidate = false,
		@Query(new ParseIntPipe({optional: true}))
		timeout?: number
	) {
		const mc = await this.kkmSvc.validateMarkBegin(p.params);
		const validation = this.kkmSvc.validateMark(mc, p.action, timeout);
		if (asyncValidate) {
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
