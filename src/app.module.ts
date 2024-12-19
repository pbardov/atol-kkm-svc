import {Module} from '@nestjs/common';
import {EventEmitterModule} from '@nestjs/event-emitter';
import AppConfigModule from './config/app-config.module.js';
import WwwModule from './www/www.module.js';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		AppConfigModule,
		WwwModule,
	],
})
export default class AppModule {
	//
}
