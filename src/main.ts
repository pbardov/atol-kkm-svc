import AppModule from './app.module.js';
import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import AllExceptionsFilter from './common/filters/all-exceptions.filter.js';
import httpConfigFactory, {type HttpConfig} from './www/http.config.js';

async function bootstrap() {
	Error.stackTraceLimit = Number.MAX_SAFE_INTEGER;
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());
	const httpAdapter = app.get(HttpAdapterHost);
	app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
	await app.init();

	process.on('SIGTERM', async () => {
		await app.close();
		process.exit(0);
	});

	const httpConfig: HttpConfig = app.get<HttpConfig, HttpConfig>(httpConfigFactory.KEY);
	await app.listen(httpConfig.httpPort);

	console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
