import {TypeGuard} from './type-guard.js';
import {UnionFromArray} from './utility.js';

export default function isOneOf<T extends readonly any[], U = UnionFromArray<T>>(...values: T[]): TypeGuard<U> {
	return (v: unknown): v is U => values.includes(v as T);
}
