import {
    type ArgumentMetadata,
    HttpStatus,
    Injectable,
    Logger,
    type PipeTransform
} from '@nestjs/common';
import {inspect} from 'node:util';
import {type ErrorHttpStatusCode, HttpErrorByCode} from '@nestjs/common/utils/http-error-by-code.util.js';

export type ParseJsonPipeOptions = {
    errorHttpStatusCode?: ErrorHttpStatusCode,
    exceptionFactory?: (error: string) => any,
    optional?: boolean
};

@Injectable()
export default class ParseJsonPipe implements PipeTransform<unknown, any> {
    protected readonly logger = new Logger(ParseJsonPipe.name);
    protected exceptionFactory: (error: string) => any;

    constructor(protected readonly options: ParseJsonPipeOptions = {}) {
        const {exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST} = options;
        this.exceptionFactory =
            exceptionFactory ||
            (error => new HttpErrorByCode[errorHttpStatusCode](error));
    }

    async transform(value: unknown, metadata: ArgumentMetadata): Promise<any> {
        const {optional: isOptional = false} = this.options;
        // Преобразование разных типов данных в строку JSON
        let jsonString: string;

        if (Buffer.isBuffer(value)) {
            jsonString = value.toString('utf-8');
        } else if (value instanceof Uint8Array || value instanceof ArrayBuffer ||
            (value && typeof value === 'object' && 'buffer' in value)) {
            // Обработка Uint8Array, ArrayBuffer и других бинарных типов
            const buffer = Buffer.from(value as ArrayBufferLike);
            jsonString = buffer.toString('utf-8');
        } else if (typeof value === 'string') {
            jsonString = value;
        } else if (value instanceof DataView) {
            // Обработка DataView
            const buffer = Buffer.from(value.buffer);
            jsonString = buffer.toString('utf-8');
        } else if (value instanceof SharedArrayBuffer) {
            // Обработка SharedArrayBuffer
            const buffer = Buffer.from(new Uint8Array(value));
            jsonString = buffer.toString('utf-8');
        } else if (value === null || value === undefined) {
            if (!isOptional) {
                throw this.exceptionFactory('Входные данные не могут быть null или undefined');
            }

            return undefined;
        } else if (typeof value === 'object') {
            try {
                // Если это уже объект, попробуем сериализовать его напрямую
                jsonString = JSON.stringify(value);
            } catch (error) {
                this.logger.error(`Невозможно сериализовать объект: ${inspect(error)}`);
                throw this.exceptionFactory('Невозможно обработать входные данные');
            }
        } else {
            this.logger.error(`Неподдерживаемый тип входных данных: ${typeof value}`);
            throw this.exceptionFactory(`Неподдерживаемый тип входных данных: ${typeof value}`);
        }

        // Преобразование JSON-строки в объект
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            this.logger.error(`Ошибка парсинга JSON: ${inspect(error)}`);
            throw this.exceptionFactory('Невалидный JSON формат');
        }
    }
}
