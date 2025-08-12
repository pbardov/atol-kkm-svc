import {Module} from '@nestjs/common';
import AppConfigModule from '../config/app-config.module.js';
import WwwController from './www.controller.js';
import AtolKkmModule from '../atol-kkm/atol-kkm.module.js';

@Module({
	imports: [
		AppConfigModule,
		AtolKkmModule,
	],
	providers: [],
	controllers: [WwwController],
})
export default class WwwModule {
	//
}
