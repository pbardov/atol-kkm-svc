import {errorDescription, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export default function isBuffer(v: unknown, errors: ValidationErrors = {}): v is Buffer {
	if (Buffer.isBuffer(v)) {
		return true;
	}

	errors[errorDescription] = `value is not buffer, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
	return false;
}
