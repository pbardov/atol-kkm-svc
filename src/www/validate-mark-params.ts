import {ImcParamsValidation, isImcParamsValidation} from '@pbardov/node-atol-rpc/dist/types/imc-params.js';
import {isValidateMarkAction, ValidateMarkAction} from '../atol-kkm/validate-mark-action.js';
import structureValidator from '../common/types/structure-validator.js';

export type ValidateMarkParams = {
	params: ImcParamsValidation,
	action: ValidateMarkAction
};

export const isValidateMarkParams = structureValidator<ValidateMarkParams>({
	params: isImcParamsValidation,
	action: isValidateMarkAction,
});
