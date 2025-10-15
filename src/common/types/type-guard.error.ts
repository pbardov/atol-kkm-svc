import {type ValidationErrors} from './type-guard.js';
import * as util from 'node:util';

export type TypeGuardErrorOptions = {
	cause?: ValidationErrors;
	value?: any;
};

export class TypeGuardError extends TypeError {
	readonly cause: ValidationErrors | undefined;
	readonly value?: any;

	constructor(message: string, {cause, value}: TypeGuardErrorOptions = {}) {
		super(message, {cause});
		this.cause = cause;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.value = value;

		Object.setPrototypeOf(this, TypeGuardError.prototype);
	}

	toString() {
		return util.inspect(this, {showHidden: true, depth: Infinity});
	}
}
