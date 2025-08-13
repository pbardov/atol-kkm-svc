import {Expose, Type} from 'class-transformer';
import {IsBoolean, IsOptional, IsString, IsUrl} from 'class-validator';
import registerClassAs from '../common/config/register-class-as.js';

export class DatabaseConfig {
	@IsUrl({require_tld: false})
	@Type(() => String)
	@Expose({name: 'PG_URL'})
	url = 'postgres://localhost:5432/atol';

	@IsBoolean()
	@Type(() => Boolean)
	@Expose({name: 'PG_SSL'})
	ssl = false;

	@IsBoolean()
	@Type(() => Boolean)
	@Expose({name: 'PG_SSL_INSECURE'})
	sslInsecure = false;

	@IsOptional()
	@IsString()
	@Type(() => String)
	@Expose({name: 'PG_CA'})
	caFile?: string;
}

export default registerClassAs('database-config', DatabaseConfig);
