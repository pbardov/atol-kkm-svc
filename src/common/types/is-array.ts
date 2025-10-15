import {errorDescription, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export default function isArray(v: unknown, errors: ValidationErrors = {}): v is unknown[] {
	if (Array.isArray(v)) {
		return true;
	}

	errors[errorDescription] = `value is not array, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
	return false;
}
