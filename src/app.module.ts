import {Module} from '@nestjs/common';
import {EventEmitterModule} from '@nestjs/event-emitter';
import AppConfigModule from './config/app-config.module.js';
import DatabaseModule from './database/database.module.js';
import WwwModule from './www/www.module.js';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		AppConfigModule,
		DatabaseModule,
		WwwModule,
	],
})
export default class AppModule {
	//
}
