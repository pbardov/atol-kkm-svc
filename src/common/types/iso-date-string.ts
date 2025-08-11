import isArrayOf from './is-array-of.js';

export type IsoDateString = string;

const isoDateStringRe = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)/;

export function isIsoDateString(v: unknown): v is IsoDateString {
	return typeof v === 'string'
		&& isoDateStringRe.test(v);
}

export function isIsoDateStringArray(v: unknown): v is IsoDateString[] {
	return isArrayOf(v, isIsoDateString);
}
