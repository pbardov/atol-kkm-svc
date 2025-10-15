import {arrayTypeGuard} from './is-array-of.js';
import {errorDescription, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export default function isDate(v: unknown, errors: ValidationErrors = {}): v is Date {
	if (v instanceof Date && !isNaN((v as unknown) as number)) {
		return true;
	}

	errors[errorDescription] = `value is not date, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
	return false;
}

export const isDateArray = arrayTypeGuard(isDate);
