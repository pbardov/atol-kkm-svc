import {Body, Controller, Get, Inject, Post, Headers, Param, Put} from '@nestjs/common';
import httpConfig, {HttpConfig} from './http.config.js';
import AtolKkmService from '../atol-kkm/atol-kkm.service.js';
import {unflatten} from 'flat';

@Controller()
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
	async openReceipt(@Body() data: unknown, @Headers('content-format') format: string = 'json') {
		const procData = format === 'flatten' ? unflatten(data) : data;
		return this.kkmSvc.openReceipt(procData!);
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
	async addReceiptItem(@Body() data: unknown, @Param('id') id: string, @Headers('content-format') format: string = 'json') {
		const procData = format === 'flatten' ? unflatten(data) : data;
		return this.kkmSvc.addReceiptItem(id, procData!);
	}
}
