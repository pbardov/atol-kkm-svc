import {errorDescription, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

/**
 * Checks if the provided value is a string.
 *
 * @param v The value to check.
 * @param errors
 * @returns `true` if the value is a string, otherwise `false`.
 */
export default function isString(v: unknown, errors: ValidationErrors = {}): v is string {
	if (typeof v === 'string') {
		return true;
	}

	errors[errorDescription] = `value is not string, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
	return false;
}
