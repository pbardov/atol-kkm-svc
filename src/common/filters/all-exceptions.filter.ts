import {
	type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus,
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {
		//
	}

	catch(exception: any, host: ArgumentsHost): void {
		console.log('AllExceptionsFilter.catch');
		const {httpAdapter} = this.httpAdapterHost;
		const ctx = host.switchToHttp();

		const httpStatus
			= exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		let errorCode = 'unknown';
		let message = 'unknown';
		let stack = '';
		if (exception instanceof Error) {
			const err = exception as NodeJS.ErrnoException;
			errorCode = err.code ?? errorCode;
			message = err.message ?? message;
			stack = err.stack ?? stack;
		}

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
			errorCode,
			message,
			stack,
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
