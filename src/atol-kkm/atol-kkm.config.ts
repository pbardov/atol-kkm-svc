import registerClassAs from '../common/config/register-class-as.js';
import {Expose, Type} from 'class-transformer';
import {IsOptional, IsString} from 'class-validator';

export class AtolKkmConfig {
	@IsString()
	@Type(() => String)
	@Expose({name: 'KKM_CONFIG'})
	kkmConfig = 'settings.json';

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
