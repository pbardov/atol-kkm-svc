import {type ValueTransformer} from 'typeorm';

export class HexTransformer implements ValueTransformer {
	// Чтение из базы данных
	from(value: Buffer | null): string | null {
		if (value === null) {
			return null;
		}
		return value.toString('hex');
	}

	// Запись в базу данных
	to(value: string | null): Buffer | null {
		if (value === null) {
			return null;
		}
		return Buffer.from(value, 'hex');
	}
}
