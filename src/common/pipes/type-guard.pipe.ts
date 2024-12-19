import {
	type ArgumentMetadata, BadRequestException, Injectable, Logger, type PipeTransform,
} from '@nestjs/common';

@Injectable()
export default class TypeGuardPipe<T> implements PipeTransform<unknown, T> {
	private readonly logger = new Logger(TypeGuardPipe.name);

	constructor(public readonly isType: (t: unknown) => t is T, public logError = false) {
		//
	}

	transform(value: unknown, metadata: ArgumentMetadata) {
		if (this.isType(value)) {
			return value;
		}

		if (this.logError) {
			this.logger.error(`Validation failed, data: ${JSON.stringify(value, null, '  ')}`);
		}

		throw new BadRequestException('Validation failed');
	}
}
