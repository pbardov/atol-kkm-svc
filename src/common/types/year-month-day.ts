import {type TypeGuard} from './type-guard.js';
import escapeRegex from './escape-regex.js';
import isString from './is-string.js';

export type YearMonthDay<D extends string = '-' | '.'> = `${number}${number}${number}${number}${D}${number}${number}${D}${number}${number}`;

export const makeIsYearMonthDay = <D extends string>(d: D | D[]): TypeGuard<YearMonthDay<D>> => {
	const delim = Array.isArray(d) ? d.map(escapeRegex).join('') : d;
	const re = new RegExp(`^\\d{4}[${delim}]\\d{2}[${delim}]\\d{2}$`);
	return (v: unknown): v is YearMonthDay<D> => (isString(v) && re.test(v)) || false;
};

export const isYearMonthDay = makeIsYearMonthDay<'-' | '.'>(['-', '.']);
