import {errorDescription, TypeGuardDetail} from './type-guard.js';
import {UnionFromArray} from './utility.js';

export default function isOneOf<const T extends unknown[], U = UnionFromArray<T>>(...values: T): TypeGuardDetail<U> {
	return (v: unknown, errors = {}): v is U => {
		if (values.includes(v as T)) {
			return true;
		}

		errors[errorDescription] = `${v} not in ${JSON.stringify(values)}`;
		return false;
	}
}
