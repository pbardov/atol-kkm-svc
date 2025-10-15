import {errorDescription, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export default function isBoolean(v: unknown, errors: ValidationErrors = {}): v is boolean {
	if (typeof v === 'boolean') {
		return true;
	}

	errors[errorDescription] = `value is not boolean, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
	return false;
}
