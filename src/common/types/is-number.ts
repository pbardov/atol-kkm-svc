import {errorDescription, type ValidationErrors} from './type-guard.js';
import {inspectOptions} from './inspect-options.js';
import {inspect} from 'node:util';

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

	errors[errorDescription] = `value is not number, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
	return false;
}
