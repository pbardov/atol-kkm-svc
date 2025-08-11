import isArrayOf from './is-array-of.js';
import isString from './is-string.js';

export default function isStringArray(v: unknown): v is string[] {
	return isArrayOf(v, isString);
}
