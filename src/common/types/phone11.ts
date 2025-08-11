import isString from './is-string.js';

export type Phone11 = `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`;

export const phone11Re = /\d{11}/;

export function isPhone11(v: unknown): v is Phone11 {
	return phone11Re.test((isString(v) && v) || '');
}
