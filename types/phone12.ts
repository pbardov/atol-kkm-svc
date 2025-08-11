import isString from './is-string.js';

export type Phone12 = `+${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`;

export const phone12Re = /\+\d{11}/;

export function isPhone12(v: unknown): v is Phone12 {
	return phone12Re.test((isString(v) && v) || '');
}
