import {env} from 'process';
import {
	type ArgumentMetadata, Injectable, Logger, type PipeTransform,
} from '@nestjs/common';
import {inspect} from 'node:util';
import {TypeGuard, TypeGuardDetail, ValidationErrors} from '../types/type-guard.js';
import describeValidationErrors from '../types/describe-validation-errors.js';
import {TypeGuardError} from '../types/type-guard.error.js';

export type TypeGuardPipeOptions = {
	logError?: boolean;
	optional?: boolean;
	exceptionFactory?: (errors: ValidationErrors) => any;
};

@Injectable()
export default class TypeGuardPipe<T> implements PipeTransform<unknown, T> {
	protected readonly logger = new Logger(TypeGuardPipe.name);
	protected readonly logError: boolean;
	protected readonly optional: boolean;
	protected readonly exceptionFactory: (errors: ValidationErrors) => any;

	constructor(public readonly isType: TypeGuard<T> | TypeGuardDetail<T>,
	            options?: TypeGuardPipeOptions) {
		this.logError = options?.logError ?? env.LOG_VALIDATION_ERRORS ? !!JSON.parse(env.LOG_VALIDATION_ERRORS!) : false
		this.optional = options?.optional ?? false;
		this.exceptionFactory = options?.exceptionFactory ?? ((cause: ValidationErrors) => new TypeGuardError('Validation failed', {cause}));
	}

	transform(value: unknown, metadata: ArgumentMetadata) {
		const errors: ValidationErrors = {};
		if (this.isType(value, errors)) {
			return value;
		}

		const describedErrors = describeValidationErrors('Type validation failed', this.isType, errors)
		if (this.logError) {
			this.logger.error(inspect(describedErrors));
		}

		throw this.exceptionFactory(describedErrors);
	}
}
