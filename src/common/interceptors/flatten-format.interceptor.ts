import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {map, Observable} from 'rxjs';
import {flatten, unflatten} from 'flat';

@Injectable()
export default class FlattenFormatInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest();
		const contentFormat = request.headers['content-format'];
		const acceptFormat = request.headers['accept-format'];

		// Обработка входящего запроса (unflatten)
		if (contentFormat && contentFormat === 'flatten' && request.body) {
			request.body = unflatten(request.body);
		}

		// Обработка исходящего ответа (flatten)
		if (acceptFormat && acceptFormat === 'flatten') {
			return next.handle().pipe(
				map(data => {
					if (data) {
						return flatten(data);
					}
					return data;
				})
			);
		}

		return next.handle();
	}
}
