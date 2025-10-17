/* eslint-disable */
import request, {type Response} from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import {setTimeout as delay} from 'node:timers/promises';
// @ts-ignore
import {testConfigFactory} from './test.config.js';
import {FiscalTaskTypes} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import {DocumentItem} from '@pbardov/node-atol-rpc/dist/types/document-item.js';
import {ValidateMarkParams} from '../src/www/validate-mark-params.js';
import {ImcParamsValidation} from '@pbardov/node-atol-rpc/dist/types/imc-params.js';
import {inspect} from 'node:util';
import MarkingCode from '../src/database/entity/marking-code.js';

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

function expect2xx(res: Response) {
	if (res.status < 200 || res.status >= 300) {
		console.error('HTTP error:', res.status, res.body ?? res.text);
	}
	expect(res.status).toBeGreaterThanOrEqual(200);
	expect(res.status).toBeLessThan(300);
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
	if (config.testApiMethods) {
		it('POST / process task getShiftStatus', async () => {
			const task = {type: 'getShiftStatus'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getDeviceInfo', async () => {
			const task = {type: 'getDeviceInfo'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getDeviceStatus', async () => {
			const task = {type: 'getDeviceStatus'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task reportOfdExchangeStatus', async () => {
			const task = {type: 'reportOfdExchangeStatus'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getRegistrationInfo', async () => {
			const task = {type: 'getRegistrationInfo'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getMcu', async () => {
			const task = {type: 'getMcu'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getCashDrawerStatus', async () => {
			const task = {type: 'getCashDrawerStatus'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getFnInfo', async () => {
			const task = {type: 'getFnInfo'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getFnStatus', async () => {
			const task = {type: 'getFnStatus'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task ofdExchangeStatus', async () => {
			const task = {type: 'ofdExchangeStatus'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getShiftTotals', async () => {
			const task = {type: 'getShiftTotals'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getOverallTotals', async () => {
			const task = {type: 'getOverallTotals'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getDepartmentSum', async () => {
			const task = {type: 'getDepartmentSum'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task getLicenses', async () => {
			const task = {type: 'getLicenses'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task ismExchangeStatus', async () => {
			const task = {type: 'ismExchangeStatus'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task checkImcWorkState', async () => {
			const task = {type: 'checkImcWorkState'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task checkImcTime', async () => {
			const task = {type: 'checkImcTime'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});

		it('POST / process task pingIsm', async () => {
			const task = {type: 'pingIsm'};
			const response = await request(config.serviceUrl)
				.post('/api')
				.send(task);

			expect2xx(response);
			expect(response.body).toBeDefined();
		});
	}

	it('POST /validate-mark should validate mark synchronously', async () => {
		for (const params of validateMarkData) {
			const body: ValidateMarkParams = {
				params,
				action: {
					success: config.validateMarkAction,
					fail: config.validateMarkAction,
				}
			};
			if (config.validateMarkVerbose) {
				console.log(`Validate-mark sync ${inspect(body)}`);
			}

			const response = await request(config.serviceUrl)
				.post('/api/validate-mark')
				.query({async: false})
				.send(body);

			expect2xx(response);
			expect(response.body).toBeDefined();

            const mc = response.body;
			if (config.validateMarkVerbose) {
				console.log(`MC: ${inspect(mc, {depth: Infinity})}`);
			}
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
			if (config.validateMarkVerbose) {
				console.log(`Validate-mark async ${inspect(body)}`);
			}

			let response = await request(config.serviceUrl)
				.post('/api/validate-mark')
				.query({async: true})
				.send(body);

			expect2xx(response);
			expect(response.body).toBeDefined();

            let mc = response.body as MarkingCode;
			if (config.validateMarkVerbose) {
				console.log(`MC: ${inspect(mc, {depth: Infinity})}`);
			}

			let isReady = false;
			const started = Date.now();
			do {
				response = await request(config.serviceUrl)
					.get(`/api/validate-mark/${mc.id}`);

				expect2xx(response);
				expect(response.body).toBeDefined();

				mc = response.body as MarkingCode;
				isReady = !!(mc.isReady || mc.validationCompleted);

				if (!isReady) {
					if (Date.now() - started > 10000) {
						throw new Error('Timeout');
					}

					await delay(200);
				}
			} while(!isReady);
		}
	});
});
