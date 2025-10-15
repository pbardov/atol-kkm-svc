import {type TypeGuard, type TypeGuardDetail} from './type-guard.js';

export default function getTypeGuardDetails(f: TypeGuard<any> | TypeGuardDetail<any>): string {
	return `${f.name} ${f.toString().substring(0, 32)}`;
}
