import {Body, Controller, Get, Inject, Post, Param, Put, UseInterceptors} from '@nestjs/common';
import FlattenFormatInterceptor from '../common/interceptors/flatten-format.interceptor.js';
import httpConfig, {HttpConfig} from './http.config.js';
import AtolKkmService from '../atol-kkm/atol-kkm.service.js';
import {FiscalTask} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import {DocumentItem} from '@pbardov/node-atol-rpc/dist/types/document-item.js';

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
}
