import {errorDescription, ValidationErrors} from './type-guard.js';

/**
 * Checks if the provided value is a number.
 *
 * @param v The value to check.
 * @param errors
 * @returns `true` if the value is a number, otherwise `false`.
 */
export default function isNumber(v: unknown, errors: ValidationErrors = {}): v is number {
	if (typeof v === 'number') {
		return true;
	}

	errors[errorDescription] = `${v} is not number, typeof v = ${typeof v}`;
	return false;
}
