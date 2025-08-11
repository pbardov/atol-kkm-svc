import {type TypeGuardDetail, type ValidationErrors} from './type-guard.js';

export default function combineTypeGuards<T1, T2>(isT1: TypeGuardDetail<T1>, isT2: TypeGuardDetail<T2>): TypeGuardDetail<T1 & T2> {
	return (v: unknown, errors: ValidationErrors = {}): v is T1 & T2 => {
		const t1Valid = isT1(v, errors);
		const t2Valid = isT2(v, errors);
		return t1Valid && t2Valid;
	};
}
