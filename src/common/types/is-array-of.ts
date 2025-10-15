import {
	type ArrayTypeGuardDetail, type TypeGuard, type TypeGuardDetail, type ValidationErrors,
} from './type-guard.js';
import describeValidationErrors from './describe-validation-errors.js';
import isArray from './is-array.js';

export default function isArrayOf<T>(values: unknown, isT: TypeGuard<T> | TypeGuardDetail<T>, errors: ValidationErrors = {}): values is T[] {
	if (!isArray(values, errors)) {
		return false;
	}

	let errorCount = 0;
	const typeGuard = isT as TypeGuardDetail<T>;
	for (let idx = 0; idx < values.length; idx += 1) {
		const v: unknown = values[idx];
		const propError: ValidationErrors = {};
		if (!typeGuard(v, propError)) {
			errorCount += 1;
			errors[idx] = describeValidationErrors('', typeGuard, propError);
		}
	}

	return !errorCount;
}

export function arrayTypeGuard<T>(isT: TypeGuard<T> | TypeGuardDetail<T>): ArrayTypeGuardDetail<T> {
	return (values: unknown, errors?: ValidationErrors): values is T[] => isArrayOf<T>(values, isT, errors);
}
