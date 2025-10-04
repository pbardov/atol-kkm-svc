import {Module} from '@nestjs/common';
import AppConfigModule from '../config/app-config.module.js';
import ApiController from './api.controller.js';
import AtolKkmModule from '../atol-kkm/atol-kkm.module.js';

@Module({
	imports: [
		AppConfigModule,
		AtolKkmModule,
	],
	providers: [],
	controllers: [ApiController],
})
export default class WwwModule {
	//
}
