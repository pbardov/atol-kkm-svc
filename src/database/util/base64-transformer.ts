import {type ValueTransformer} from 'typeorm';

export class Base64Transformer implements ValueTransformer {
	// Чтение из базы данных
	from(value: Buffer | null): string | null {
		if (value === null) {
			return null;
		}
		return value.toString('base64url');
	}

	// Запись в базу данных
	to(value: string | null): Buffer | null {
		if (value === null) {
			return null;
		}
		return Buffer.from(value, 'base64url');
	}
}
