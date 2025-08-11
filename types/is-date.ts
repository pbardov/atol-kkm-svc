import isArrayOf from './is-array-of.js';

export default function isDate(v: unknown): v is Date {
	return v instanceof Date && !isNaN((v as unknown) as number);
}

export function isDateArray(v: unknown): v is Date[] {
	return isArrayOf(v, isDate);
}
