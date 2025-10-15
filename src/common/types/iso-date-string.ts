import {arrayTypeGuard} from './is-array-of.js';
import {errorDescription, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export type IsoDateString = string;

const isoDateStringRe = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)/;

export function isIsoDateString(v: unknown, errors: ValidationErrors = {}): v is IsoDateString {
	if (typeof v === 'string'
		&& isoDateStringRe.test(v)) {
		return true;
	}

	errors[errorDescription] = `value is not iso date string, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
	return false;
}

export const isIsoDateStringArray = arrayTypeGuard(isIsoDateString);
