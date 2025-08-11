import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';
import isBuffer from '../types/is-buffer.js';

export default function IsBuffer(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isBuffer',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return isBuffer(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a Buffer`;
                }
            }
        });
    };
}
