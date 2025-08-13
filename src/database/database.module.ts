import {Module} from '@nestjs/common';
import {TypeOrmModule, type TypeOrmModuleOptions} from '@nestjs/typeorm';
import AppConfigModule from '../config/app-config.module.js';
import databaseConfig, {type DatabaseConfig} from './database.config.js';
import getDataSourceOptions from './data-source.options.js';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [databaseConfig.KEY],
			useFactory(dbConfig: DatabaseConfig): TypeOrmModuleOptions {
				return {
					...getDataSourceOptions(dbConfig),
					autoLoadEntities: true,
				};
			},
		}),
	],
})
export default class DatabaseModule {
	//
}
