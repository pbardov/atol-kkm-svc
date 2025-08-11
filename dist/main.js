import AppModule from './app.module.js';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import AllExceptionsFilter from './common/filters/all-exceptions.filter.js';
import httpConfigFactory from './www/http.config.js';
import AtolRpc from 'node-atol-rpc';
async function bootstrap() {
    Error.stackTraceLimit = Number.MAX_SAFE_INTEGER;
    const app = await NestFactory.create(AppModule);
    await app.init();
    app.useGlobalPipes(new ValidationPipe());
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    const httpConfig = app.get(httpConfigFactory.KEY);
    await app.listen(httpConfig.httpPort);
    console.log(`Application is running on: ${await app.getUrl()}`);
    const kkm = new AtolRpc();
    const settings = kkm.getSettings();
    console.log(`Default KKM settings: ${JSON.stringify(settings, null, '   ')}`);
}
void bootstrap();
