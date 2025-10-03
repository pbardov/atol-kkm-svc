import {JsonTaskType} from '@pbardov/node-atol-rpc/dist/types/json-task-type.js';

export type ValidateMarkFail = JsonTaskType.cancelMarkingCodeValidation | JsonTaskType.declineMarkingCode;
export type ValidateMarkSuccess = JsonTaskType.acceptMarkingCode | ValidateMarkFail;

export type ValidateMarkAction = {
	success: ValidateMarkSuccess;
	fail: ValidateMarkFail;
};
