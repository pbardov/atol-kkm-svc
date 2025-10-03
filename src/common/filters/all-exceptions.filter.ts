import {env} from 'process';
import {
    type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {RpcException} from '@nestjs/microservices';
import {inspect} from 'node:util';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter<any> {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost,
                private readonly logExceptions = env.LOG_EXCEPTIONS ? !!JSON.parse(env.LOG_EXCEPTIONS!) : false) {
        //
    }

    catch(exception: any, host: ArgumentsHost) {
        this.logger.error(`Catch ${this.logExceptions ? inspect(exception) : ''}`);

        // Определяем тип контекста
        const contextType = host.getType();

        // Извлекаем базовую информацию об ошибке
        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = 'unknown';
        let message = 'unknown';
        let stack = '';

        // Обработка разных типов исключений
        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
        } else if (exception instanceof RpcException) {
            // Обработка ошибок микросервисов
            const error = exception.getError();
            if (typeof error === 'object' && error !== null) {
                message = (error as Record<string, any>).message || message;
                errorCode = (error as Record<string, any>).code || errorCode;
            } else {
                message = `${error}`;
            }
        } else if (exception instanceof Error || (typeof exception === 'object' && typeof exception?.message === 'string')) {
            const err = exception as NodeJS.ErrnoException;
            errorCode = err.code ?? errorCode;
            message = err.message ?? message;
            stack = err.stack ?? stack;
        }

        // Формирование базового ответа
        const responseBody: Record<string, any> = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            errorType: exception.constructor.name,
            errorCode,
            message,
            stack,
            inspect: inspect(exception)
        };

        if (this.logExceptions) {
            this.logger.error(inspect(responseBody));
        }

        // Обработка в зависимости от типа контекста
        if (contextType === 'http') {
            const {httpAdapter} = this.httpAdapterHost;
            const ctx = host.switchToHttp();

            // Добавляем к ответу информацию о пути запроса
            responseBody['path'] = httpAdapter.getRequestUrl(ctx.getRequest()) as string;

            // Получаем объект ответа
            const response = ctx.getResponse();

            // Устанавливаем заголовок Content-Type
            httpAdapter.setHeader(response, 'Content-Type', 'application/json');

            // Отправка ответа через HTTP адаптер
            httpAdapter.reply(response, responseBody, httpStatus);
        } else if (contextType === 'rpc') {
            // Обработка ошибок в микросервисах
            const ctx = host.switchToRpc();

            // Добавляем "заголовок" в виде поля в объекте ответа
            responseBody['__isRpcError'] = true;

            // Если используется nats или другой транспорт с поддержкой метаданных
            // можно попробовать получить доступ к контексту сообщения
            try {
                const rpcData = ctx.getData();
                // Проверяем, есть ли в данных доступ к метаданным сообщения
                if (rpcData && typeof rpcData === 'object' && 'setMetadata' in rpcData) {
                    // @ts-ignore - игнорируем ошибку типа, так как это специфичный интерфейс
                    rpcData.setMetadata({
                        contentType: 'application/json+error',
                        isError: true
                    });
                }
            } catch (e) {
                // Игнорируем ошибки при попытке установить метаданные
                this.logger.warn(`Failed to set RPC metadata: ${inspect(e)}`);
            }

            // Возвращаем ошибку в контексте микросервиса
            return responseBody;
        }
    }
}
