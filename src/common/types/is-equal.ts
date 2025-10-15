import {errorDescription, type TypeGuardDetail, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export default function isEqual<T, R = T>(ref: T): TypeGuardDetail<R> {
	return (v: unknown, errors: ValidationErrors = {}): v is R => {
		if (v === ref) {
			return true;
		}

		errors[errorDescription] = `value is not equal to ${JSON.stringify(ref)}, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
		return false;
	}
}
