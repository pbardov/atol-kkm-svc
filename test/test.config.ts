import {IsIn, IsString, IsUrl} from 'class-validator';
import {Expose, Type} from 'class-transformer';
import registerClassAs, {configFactory} from '../src/common/config/register-class-as.js';
import {ValidateMarkFail, validateMarkFailTypes} from '../src/atol-kkm/validate-mark-action.js';
import {JsonTaskType} from '@pbardov/node-atol-rpc/dist/types/json-task-type.js';

export class TestConfig {
	@IsUrl({require_tld: false})
	@Type(() => String)
	@Expose({name:'SERVICE_URL'})
	serviceUrl = 'http://localhost:8080'

	@IsString()
	@Type(() => String)
	@Expose({name: 'RECEIPT_DATA_PATH'})
	receiptDataPath: string = 'test.receipts.yml';

	@IsString()
	@Type(() => String)
	@Expose({name: 'VALIDATE_MARK_DATA_PATH'})
	validateMarkDataPath: string = 'test.marks.yml';

	@IsIn(validateMarkFailTypes)
	@Type(() => String)
	@Expose({name: 'VALIDATE_MARK_ACTION'})
	validateMarkAction: ValidateMarkFail = JsonTaskType.cancelMarkingCodeValidation;
}

export const testConfigFactory = configFactory('test-config', TestConfig);
