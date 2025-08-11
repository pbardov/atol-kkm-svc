import {type TypeGuard} from './type-guard.js';

export default function isEnumOf<T extends string, EnumValue extends string | number>(e: Record<T, EnumValue>): TypeGuard<EnumValue> {
	return (v: unknown): v is EnumValue => Object.values(e).includes(v as EnumValue);
}
