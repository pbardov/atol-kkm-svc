import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import ApiController from '../src/www/api.controller';
import AtolKkmService from '../src/atol-kkm/atol-kkm.service';
import httpConfig from '../src/www/http.config';
import { ConfigModule } from '@nestjs/config';
import {testConfigFactory} from './test.config.js';

// Load environment variables
require('dotenv').config();

// Load data from a JSON or YAML file
function loadData(filePath: string): any {
  const ext = path.extname(filePath).toLowerCase();
  const rawContent = fs.readFileSync(filePath, 'utf8');
  return ext === '.yaml' || ext === '.yml'
    ? require('yaml').parse(rawContent)
    : JSON.parse(rawContent);
}

const config = testConfigFactory();

// Load data
const receiptData = loadData(config.receiptDataPath);
const validateMarkData = loadData(config.validateMarkDataPath);

// Define E2E test suite
describe('ApiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(httpConfig)],
      controllers: [ApiController],
      providers: [AtolKkmService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST / should process task with JsonTaskType.getShiftStatus', async () => {
    const task = { type: 'getShiftStatus', ...receiptData.getShiftStatus };
    const response = await request(config.serviceUrl)
      .post('/api')
      .send(task)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
  });

  it('POST /validate-mark should validate mark synchronously', async () => {
    const params = validateMarkData.sync;
    const response = await request(config.serviceUrl)
      .post('/api/validate-mark')
      .query({ asyncValidate: false })
      .send(params)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
  });

  it('POST /validate-mark should validate mark asynchronously', async () => {
    const params = validateMarkData.async;
    const response = await request(config.serviceUrl)
      .post('/api/validate-mark')
      .query({ asyncValidate: true })
      .send(params)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
  });
});
