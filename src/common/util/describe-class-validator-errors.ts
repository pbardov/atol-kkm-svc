import { ValidationError } from 'class-validator';
import { inspect } from 'node:util';

export default function describeClassValidatorErrors(errors: ValidationError[]) {
    const messages: string[] = [];

    for (const error of errors) {
        const pathMessages = extractPathAndValues(error);
        messages.push(...pathMessages);
    }

    return 'An instance of PvzGoodsContent has failed the validation:\n' + messages.join('\n');
}

function extractPathAndValues(error: ValidationError, parentPath: string = ''): string[] {
    const messages: string[] = [];
    const currentPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    // Обрабатываем текущую ошибку, если есть constraints
    if (error.constraints) {
        const constraintsList = Object.keys(error.constraints).join(', ');
        let valueInfo = '';

        try {
            const value = error.value;
            const typeOfValue = Array.isArray(value) ? 'array' : typeof value;
            valueInfo = ` | значение: ${inspect(value, { depth: 0, maxArrayLength: 3 })}, тип: ${typeOfValue}`;
        } catch (e) {
            // В случае ошибки при извлечении значения
            valueInfo = ' | не удалось извлечь значение';
        }

        messages.push(` - property ${currentPath} has failed the following constraints: ${constraintsList}${valueInfo}`);
    }

    // Если есть дочерние ошибки
    if (error.children && error.children.length > 0) {
        for (const child of error.children) {
            // Особая обработка для элементов массива
            if (/^\d+$/.test(child.property)) {
                // Это индекс массива
                const arrayPath = `${currentPath}[${child.property}]`;
                const childMessages = extractPathAndValues(child, '');

                // Модифицируем сообщения для вложенных элементов массива
                const modifiedChildMessages = childMessages.map(msg => {
                    const propertyMatch = msg.match(/property (\S+) has failed/);
                    if (propertyMatch) {
                        return msg.replace(
                            `property ${propertyMatch[1]}`,
                            `property ${arrayPath}.${propertyMatch[1]}`
                        );
                    }
                    return msg;
                });

                messages.push(...modifiedChildMessages);
            } else {
                // Обычное вложенное свойство
                const childMessages = extractPathAndValues(child, currentPath);
                messages.push(...childMessages);
            }
        }
    }

    return messages;
}
