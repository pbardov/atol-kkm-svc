import {errorDescription, type TypeGuardDetail} from './type-guard.js';
import {type UnionFromArray} from './utility.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export default function isOneOf<const T extends unknown[], U = UnionFromArray<T>>(...values: T): TypeGuardDetail<U> {
	return (v: unknown, errors = {}): v is U => {
		if (values.includes(v as T)) {
			return true;
		}

		errors[errorDescription] = `value is not in ${JSON.stringify(values)}, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
		return false;
	}
}
