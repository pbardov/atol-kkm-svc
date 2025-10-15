import {type TypeGuard, type TypeGuardDetail, type ValidationErrors} from './type-guard.js';

export default function isNullable<T>(v: unknown, isT: TypeGuard<T> | TypeGuardDetail<T>, errors: ValidationErrors = {}): v is T | null {
	return v === undefined || v === null || isT(v, errors);
}

export const isNullableFactory =
	<T>(isT: TypeGuard<T> | TypeGuardDetail<T>) =>
		(v: unknown, errors: ValidationErrors = {}): v is T | null => isNullable(v, isT, errors);
