import {
	type ArgumentMetadata, BadRequestException, Injectable, Logger, type PipeTransform,
} from '@nestjs/common';
import {inspect} from 'node:util';
import {TypeGuard, TypeGuardDetail, ValidationErrors} from '../types/type-guard.js';
import describeValidationErrors from '../types/describe-validation-errors.js';

@Injectable()
export default class TypeGuardPipe<T> implements PipeTransform<unknown, T> {
	private readonly logger = new Logger(TypeGuardPipe.name);

	constructor(public readonly isType: TypeGuard<T> | TypeGuardDetail<T>, public logError = false) {
		//
	}

	transform(value: unknown, metadata: ArgumentMetadata) {
		const errors: ValidationErrors = {};
		if (this.isType(value, errors)) {
			return value;
		}

		if (this.logError) {
			this.logger.error(inspect(describeValidationErrors('Type validation failed', this.isType, errors)));
		}

		throw new BadRequestException('Validation failed');
	}
}
