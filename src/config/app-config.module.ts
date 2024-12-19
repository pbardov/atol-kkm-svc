import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import httpConfig from '../www/http.config.js';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [
				httpConfig,
			],
			cache: true,
		}),
	],
	exports: [ConfigModule],
})
export default class AppConfigModule {
	//
}
