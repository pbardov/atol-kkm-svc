import isString from './is-string.js';

export type RuPhone11 = `7${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`;

export const ruPhone11Re = /7\d{10}/;

export function isRuPhone11(v: unknown): v is RuPhone11 {
	return ruPhone11Re.test((isString(v) && v) || '');
}
