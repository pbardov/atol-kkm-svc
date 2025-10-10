import {IsString, IsUrl} from 'class-validator';
import {Expose, Type} from 'class-transformer';
import registerClassAs, {configFactory} from '../src/common/config/register-class-as.js';

export class TestConfig {
	@IsUrl({require_tld: false})
	@Type(() => String)
	@Expose({name:'SERVICE_URL'})
	serviceUrl = 'http://localhost'

	@IsString()
	@Type(() => String)
	@Expose({name: 'RECEIPT_DATA_PATH'})
	receiptDataPath: string;

	@IsString()
	@Type(() => String)
	@Expose({name: 'VALIDATE_MARK_DATA_PATH'})
	validateMarkDataPath: string;
}

export const testConfigFactory = configFactory('test-config', TestConfig);
