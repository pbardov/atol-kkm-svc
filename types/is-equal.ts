import {type TypeGuard} from './type-guard.js';

export default function isEqual<T, R = T>(ref: T): TypeGuard<R> {
	return (v: unknown): v is R => v === ref;
}
