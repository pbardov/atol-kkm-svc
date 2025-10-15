import {arrayTypeGuard} from './is-array-of.js';
import isString from './is-string.js';

export const isStringArray = arrayTypeGuard(isString);
