import {
	errorDescription, type TypeGuard, type TypeGuardDetail, type ValidationErrors,
} from './type-guard.js';
import describeValidationErrors from './describe-validation-errors.js';

export default function isRecordOf<K extends keyof any, V>(isK: TypeGuard<K> | TypeGuardDetail<K>, isV: TypeGuard<V> | TypeGuardDetail<V>): TypeGuardDetail<Record<K, V>> {
	return (v: unknown, errors: ValidationErrors = {}): v is Record<K, V> => {
		const mb = v as Record<K, V> | undefined;
		if (!mb || typeof mb !== 'object') {
			errors[errorDescription] = 'Value must be of object type';
			return false;
		}

		let errorCount = 0;
		for (const prop of Object.keys(mb)) {
			if (!isK(prop)) {
				errors[prop] = describeValidationErrors('Wrong key type', isK);
				errorCount += 1;
			} else {
				const errorDetail: ValidationErrors = {};
				if (!isV(mb[prop] as unknown)) {
					errors[prop] = describeValidationErrors('Wrong value type', isV, errorDetail);
					errorCount += 1;
				}
			}
		}

		return !errorCount;
	};
}
