import registerClassAs from '../common/config/register-class-as.js';
import {Expose, Type} from 'class-transformer';
import {IsNumber, IsOptional, IsString, IsUrl} from 'class-validator';

export class AtolKkmConfig {
	@IsString()
	@Type(() => String)
	@Expose({name: 'KKM_CONFIG'})
	kkmConfig = 'settings.json';

	@IsUrl({protocols: ['redis'], require_tld: false})
	@Type(() => String)
	@Expose({name: 'REDIS_URL'})
	redisUrl = 'redis://localhost:6379';

	@IsString()
	@Type(() => String)
	@Expose({name: 'LOCK_KEY_PREFIX'})
	lockPrefix = 'AtolKkm';

	@IsNumber()
	@Type(() => Number)
	@Expose({name: 'MARKING_CODE_CHECK_INTERVAL'})
	markingCodeCheckInterval = 500;

	@IsNumber()
	@Type(() => Number)
	@Expose({name: 'MARKING_CODE_CHECK_TIMEOUT'})
	markingCodeCheckTimeout = 60000;

	@IsString()
	@Type(() => String)
	@Expose({name: 'KKM_RECEIPT_TPL'})
	@IsOptional()
	receiptTpl?: string;

	@IsString()
	@Type(() => String)
	@Expose({name: 'KKM_RECEIPT_ITEM_TPL'})
	@IsOptional()
	receiptItemTpl?: string;
}

export default registerClassAs('kkm-config', AtolKkmConfig);
