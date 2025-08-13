import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import httpConfig from '../www/http.config.js';
import atolKkmConfig from '../atol-kkm/atol-kkm.config.js';
import databaseConfig from '../database/database.config.js';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [
				httpConfig,
				atolKkmConfig,
				databaseConfig,
			],
			cache: true,
		}),
	],
	exports: [ConfigModule],
})
export default class AppConfigModule {
	//
}
