import {Module} from '@nestjs/common';
import AppConfigModule from '../config/app-config.module.js';
import WwwController from './www.controller.js';

@Module({
	imports: [AppConfigModule],
	providers: [],
	controllers: [WwwController],
})
export default class WwwModule {
	//
}
