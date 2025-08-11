import {BadRequestException, Injectable, Logger, type PipeTransform} from '@nestjs/common';
import {inspect} from 'node:util';

@Injectable()
export default class JsonPipe implements PipeTransform<unknown, any> {
    private readonly logger = new Logger(JsonPipe.name);

    transform(value: unknown): any {
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
            throw new BadRequestException('Входные данные не могут быть null или undefined');
        } else if (typeof value === 'object') {
            try {
                // Если это уже объект, попробуем сериализовать его напрямую
                jsonString = JSON.stringify(value);
            } catch (error) {
                this.logger.error(`Невозможно сериализовать объект: ${inspect(error)}`);
                throw new BadRequestException('Невозможно обработать входные данные');
            }
        } else {
            this.logger.error(`Неподдерживаемый тип входных данных: ${typeof value}`);
            throw new BadRequestException(`Неподдерживаемый тип входных данных: ${typeof value}`);
        }

        // Преобразование JSON-строки в объект
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            this.logger.error(`Ошибка парсинга JSON: ${inspect(error)}`);
            throw new BadRequestException('Невалидный JSON формат');
        }
    }
}
