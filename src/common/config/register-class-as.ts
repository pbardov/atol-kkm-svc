import 'reflect-metadata';
import {Logger, type Type} from '@nestjs/common';
import {type ConfigObject, registerAs} from '@nestjs/config';
import {plainToInstance} from 'class-transformer';
import {validateSync} from 'class-validator';

const logger = new Logger('Config');
const cache = new WeakMap<Type<ConfigObject>, ConfigObject>();

export const configFactory = <T extends ConfigObject>(token: string, cls: Type<T>) => () => {
	if (cache.has(cls)) {
		return cache.get(cls) as T;
	}

	const config = plainToInstance(cls, process.env, {
		enableImplicitConversion: true,
		excludeExtraneousValues: true,
		exposeDefaultValues: true,
	});
	logger.log(`${token}: ${JSON.stringify(config, null, '  ')}`);

	const errors = validateSync(config, {skipMissingProperties: false});
	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	cache.set(cls, config);
	return config;
};

export default function registerClassAs<T extends ConfigObject>(token: string, cls: Type<T>) {
	return registerAs(token, configFactory(token, cls));
}
