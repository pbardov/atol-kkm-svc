import request from 'supertest';
import {HttpStatus} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import {testConfigFactory} from './test.config.js';
import {FiscalTaskTypes} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import {DocumentItem} from '@pbardov/node-atol-rpc/dist/types/document-item.js';
import {ValidateMarkParams} from '../src/www/validate-mark-params.js';
import {ImcParamsValidation} from '@pbardov/node-atol-rpc/dist/types/imc-params.js';
import {inspect} from 'node:util';

// Load environment variables
require('dotenv').config({path: 'test/.env'});

// Load data from a JSON or YAML file
function loadData(filePath: string): any {
	const ext = path.extname(filePath).toLowerCase();
	const rawContent = fs.readFileSync(filePath, 'utf8');
	return ext === '.yaml' || ext === '.yml'
		? require('yaml').parse(rawContent)
		: JSON.parse(rawContent);
}

const config = testConfigFactory();

type Receipt = Partial<FiscalTaskTypes> & {
	items: Array<Partial<DocumentItem>>;
};
type ReceiptData = Array<Receipt>;

type ValidateMarkData = Array<ImcParamsValidation>;

// Load data
// const receiptData = loadData(config.receiptDataPath) as ReceiptData;
const validateMarkData = loadData(config.validateMarkDataPath) as ValidateMarkData;

jest.setTimeout(60000);

// Define E2E test suite
describe('ApiController (e2e)', () => {
	it('POST / should process task with JsonTaskType.getShiftStatus', async () => {
		const task = {type: 'getShiftStatus'};
		const response = await request(config.serviceUrl)
			.post('/api')
			.send(task)
			.expect(HttpStatus.OK);

		expect(response.body).toBeDefined();
	});

	it('POST /validate-mark should validate mark synchronously', async () => {
		for (const params of validateMarkData) {
			const body: ValidateMarkParams = {
				params,
				action: {
					success: config.validateMarkAction,
					fail: config.validateMarkAction,
				}
			};

			const response = await request(config.serviceUrl)
				.post('/api/validate-mark')
				.query({asyncValidate: false})
				.send(body)
				.expect(HttpStatus.OK);

			expect(response.body).toBeDefined();

            const mc = response.body;
            console.log(`MC: ${inspect(mc, {depth: Infinity})}`);
		}
	});

	it('POST /validate-mark should validate mark asynchronously', async () => {
		for (const params of validateMarkData) {
			const body: ValidateMarkParams = {
				params,
				action: {
					success: config.validateMarkAction,
					fail: config.validateMarkAction,
				}
			};

			const response = await request(config.serviceUrl)
				.post('/api/validate-mark')
				.query({asyncValidate: true})
				.send(body)
				.expect(HttpStatus.OK);

			expect(response.body).toBeDefined();

            const mc = response.body;
            console.log(`MC: ${inspect(mc, {depth: Infinity})}`);
		}
	});
});
