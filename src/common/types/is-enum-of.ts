import {errorDescription, type TypeGuardDetail, type ValidationErrors} from './type-guard.js';
import {inspect} from 'node:util';
import {inspectOptions} from './inspect-options.js';

export default function isEnumOf<T extends string, EnumValue extends string | number>(e: Record<T, EnumValue>): TypeGuardDetail<EnumValue> {
	return (v: unknown, errors: ValidationErrors = {}): v is EnumValue => {
		if (Object.values(e).includes(v as EnumValue)) {
			return true;
		}

		errors[errorDescription] = `value is not enum of ${JSON.stringify(e)}, typeof v = ${typeof v}, v: ${inspect(v, inspectOptions)}`;
		return false;
	}
}
