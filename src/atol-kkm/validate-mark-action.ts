import {JsonTaskType} from '@pbardov/node-atol-rpc/dist/types/json-task-type.js';
import isOneOf from '../common/types/is-one-of.js';
import {UnionFromArray} from '../common/types/utility.js';
import structureValidator from '../common/types/structure-validator.js';

export const validateMarkFailTypes = [JsonTaskType.cancelMarkingCodeValidation, JsonTaskType.declineMarkingCode] as const;
export type ValidateMarkFail = UnionFromArray<typeof validateMarkFailTypes>;
export const isValidateMarkFail = isOneOf(validateMarkFailTypes);
export const validateMarkSuccessTypes = [JsonTaskType.acceptMarkingCode, ...validateMarkFailTypes] as const;
export type ValidateMarkSuccess = UnionFromArray<typeof validateMarkSuccessTypes>;
export const isValidateMarkSuccess = isOneOf(validateMarkSuccessTypes);

export type ValidateMarkAction = {
	success: ValidateMarkSuccess;
	fail: ValidateMarkFail;
};

export const isValidateMarkAction = structureValidator<ValidateMarkAction>({
	success: isValidateMarkSuccess,
	fail: isValidateMarkFail,
});
