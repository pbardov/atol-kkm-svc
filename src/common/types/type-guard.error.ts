import {type ValidationErrors} from './type-guard.js';
import * as util from 'node:util';

export type TypeGuardErrorOptions = {
	cause?: ValidationErrors;
};

export class TypeGuardError extends TypeError {
	readonly cause: ValidationErrors | undefined;

	constructor(message: string, {cause}: TypeGuardErrorOptions = {}) {
		super(message, {cause});
		this.cause = cause;

		Object.setPrototypeOf(this, TypeGuardError.prototype);
	}

	toString() {
		return util.inspect(this, {showHidden: true});
	}
}
