import {
	errorDescription, type TypeGuard, type TypeGuardDetail, type ValidationErrors,
} from './type-guard.js';
import getTypeGuardDetails from './get-type-guard-details.js';

export default function isOpt<T>(v: unknown, isT: (t: unknown) => t is T): v is T | undefined {
	return typeof v === 'undefined' || isT(v);
}

export function makeOpt<T>(isT: TypeGuard<T> | TypeGuardDetail<T>): TypeGuardDetail<T> {
	return (v: unknown, error: ValidationErrors = {}): v is T => {
		if (typeof v === 'undefined') {
			return true;
		}

		if (!isT(v, error)) {
			if (!Object.keys(error).length) {
				error[errorDescription] = getTypeGuardDetails(isT);
			}
		}

		return true;
	};
}
