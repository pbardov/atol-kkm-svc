import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {createHash} from 'crypto';
import {
	GetMarkingCodeValidationStatusTaskResult,
	MarkOperatorItemStatus,
	MarkOperatorResponseResult
} from '@pbardov/node-atol-rpc/dist/types/get-marking-code-validation-status.task-result.js';
import MarkingCode from '../database/entity/marking-code.js';
import {Base64String} from '../common/types/base64-string.js';
import {Injectable} from '@nestjs/common';

@Injectable()
export default class MarkingCodeRepository extends Repository<MarkingCode> {
	constructor(@InjectRepository(MarkingCode) repo: Repository<MarkingCode>) {
		super(repo.target, repo.manager, repo.queryRunner);
	}

	calcId(imc: Base64String) {
		const hash = createHash('sha256');
		hash.update(imc);
		return hash.digest();
	}

	isImcValid(result: GetMarkingCodeValidationStatusTaskResult): boolean {
		if (!result.ready) {
			return false;
		}

		const {onlineValidation} = result;
		if (!onlineValidation) {
			return false;
		}

		const {itemInfoCheckResult} = onlineValidation;
		if (!itemInfoCheckResult.imcCheckFlag ||
			!itemInfoCheckResult.imcCheckResult ||
			!itemInfoCheckResult.imcStatusInfo ||
			!itemInfoCheckResult.imcEstimatedStatusCorrect) {
			return false;
		}

		if (onlineValidation.markOperatorItemStatus !== MarkOperatorItemStatus.itemEstimatedStatusCorrect) {
			return false;
		}

		const {markOperatorResponse} = onlineValidation;
		if (!markOperatorResponse.responseStatus || !markOperatorResponse.itemStatusCheck) {
			return false;
		}

		return onlineValidation.markOperatorResponseResult === MarkOperatorResponseResult.correct;
	}
}
