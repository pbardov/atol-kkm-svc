import fs from 'fs';
import type {TlsOptions} from 'tls';
import isString from '../common/types/is-string.js';
import databaseConfig, {DatabaseConfig} from './database.config.js';
import {configFactory} from '../common/config/register-class-as.js';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions.js';
import entities from './entity/index.js';
import migrations from './migration/index.js';
import subscribers from './subscriber/index.js';

const cache = new WeakMap<DatabaseConfig, PostgresConnectionOptions>();

export default function getDataSourceOptions(config: DatabaseConfig = configFactory(databaseConfig.KEY as string, DatabaseConfig)()): PostgresConnectionOptions {
	if (cache.has(config)) {
		return cache.get(config)!;
	}

	const {ssl, sslInsecure, caFile, url} = config;

	const dbUrl = new URL(url);
	if (dbUrl.protocol !== 'postgres:') {
		throw new Error(`Unsupported database URL protocol: ${dbUrl.protocol}`);
	}

	const tlsOptions = ssl && isString(caFile) ? {
		ca: fs.readFileSync(caFile),
		rejectUnauthorized: !sslInsecure,
	} satisfies TlsOptions : false;

	const options: PostgresConnectionOptions = {
		type: 'postgres',
		host: dbUrl.hostname,
		port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
		username: dbUrl.username ?? 'atol',
		password: dbUrl.password ?? 'atol',
		database: dbUrl.pathname.slice(1),
		ssl: tlsOptions,
		synchronize: false, // env.NODE_ENV === 'development',
		logging: true,
		entities,
		migrations,
		subscribers,
	};

	cache.set(config, options);
	return options;
}
