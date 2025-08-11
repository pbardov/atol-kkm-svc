import {
	errorDescription, type TypeGuard, type TypeGuardDetail, typeGuardSymbol, type ValidationErrors,
} from './type-guard.js';
import isString from './is-string.js';
import getTypeGuardDetails from './get-type-guard-details.js';

export default function describeValidationErrors<T>(description: string, typeGuard: TypeGuard<T> | TypeGuardDetail<T>, errors: ValidationErrors = {}): ValidationErrors {
	const {[errorDescription]: origDescription = '', [typeGuardSymbol]: origTypeGuardDetails = ''} = errors;
	const descriptions: string[] = isString(origDescription) && origDescription ? [origDescription] : [];
	descriptions.push(description);
	const typeGuardDetails: string[] = isString(origTypeGuardDetails) && origTypeGuardDetails ? [origTypeGuardDetails] : [];
	typeGuardDetails.push(getTypeGuardDetails(typeGuard));
	return {
		...errors,
		[errorDescription]: descriptions.join('\n'),
		[typeGuardSymbol]: typeGuardDetails.join('\n'),
	};
}
