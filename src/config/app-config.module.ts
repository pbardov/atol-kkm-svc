import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import httpConfig from '../www/http.config.js';
import atolKkmConfig from '../atol-kkm/atol-kkm.config.js';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [
				httpConfig,
				atolKkmConfig
			],
			cache: true,
		}),
	],
	exports: [ConfigModule],
})
export default class AppConfigModule {
	//
}
