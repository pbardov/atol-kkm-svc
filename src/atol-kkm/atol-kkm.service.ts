import {Inject, Injectable, Logger} from '@nestjs/common';
import {readFileSync, existsSync} from 'node:fs';
import {join, extname} from 'node:path';
import * as yaml from 'js-yaml';
import atolKkmConfig, {AtolKkmConfig} from './atol-kkm.config.js';
import AtolRpc, {isSettings, Settings} from '@pbardov/node-atol-rpc';

@Injectable()
export default class AtolKkmService {
	private readonly logger = new Logger(AtolKkmService.name);
	private readonly kkm = new AtolRpc();

	constructor(@Inject(atolKkmConfig.KEY) config: AtolKkmConfig) {
		const {kkmConfig} = config;

		// Определяем абсолютный путь к файлу
		const configPath = join(process.cwd(), kkmConfig);

		if (!existsSync(configPath)) {
			throw new Error(`Файл конфигурации не найден по пути: ${configPath}`);
		}

		// Читаем содержимое файла
		const configContent = readFileSync(configPath, 'utf8');

		// Определяем формат файла по расширению
		const ext = extname(kkmConfig).toLowerCase();

		let kkmSettings;
		if (ext === '.json') {
			// Парсим JSON
			kkmSettings = JSON.parse(configContent);
		} else if (ext === '.yml' || ext === '.yaml') {
			// Парсим YAML
			kkmSettings = yaml.load(configContent);
		} else {
			throw new Error(`Неподдерживаемый формат файла конфигурации: ${ext}`);
		}

		if (!isSettings(kkmSettings)) {
			throw new Error(`Структура файла конфигурации ${configPath} не верна`);
		}

		this.kkm.setSettings(kkmSettings);
		this.logger.log('Загружена конфигурация:', kkmSettings);
	}

	getSettings() {
		return this.kkm.getSettings();
	}

	setSettings(settings: Settings) {
		this.kkm.setSettings(settings);
	}

	async withKkm<R>(callback: (kkm: AtolRpc) => R | Promise<R>): Promise<R> {
		try {
			this.kkm.open();
			return await callback(this.kkm);
		} finally {
			this.kkm.close();
		}
	}
}
