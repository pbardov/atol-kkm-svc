import {Controller, Get, Inject} from '@nestjs/common';
import httpConfig, {HttpConfig} from './http.config.js';
import AtolKkmService from '../atol-kkm/atol-kkm.service.js';

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
}
