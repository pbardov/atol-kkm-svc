import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
const logger = new Logger('Config');
const configFactory = (token, cls) => () => {
    const config = plainToInstance(cls, process.env, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
    });
    logger.log(`${token}: ${JSON.stringify(config, null, '  ')}`);
    const errors = validateSync(config, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return config;
};
export default function registerClassAs(token, cls) {
    return registerAs(token, configFactory(token, cls));
}
