import {Controller, Get, Inject} from '@nestjs/common';
import httpConfig, {HttpConfig} from './http.config.js';

@Controller()
export default class WwwController {
	constructor(@Inject(httpConfig.KEY) private readonly config: HttpConfig) {
		//
	}

	@Get('/')
	async main() {
		return {message: 'Hello world!'};
	}
}
