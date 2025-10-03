import {Module} from '@nestjs/common';
import AppConfigModule from '../config/app-config.module.js';
import AtolKkmService from './atol-kkm.service.js';
import {TypeOrmModule} from '@nestjs/typeorm';
import Receipt from '../database/entity/receipt.js';
import ReceiptRepository from './receipt.repository.js';
import MarkingCode from '../database/entity/marking-code.js';
import MarkingCodeRepository from './marking-code.repository.js';

@Module({
	imports: [
		AppConfigModule,
		TypeOrmModule.forFeature([Receipt, MarkingCode]),
	],
	providers: [
		AtolKkmService,
		ReceiptRepository,
		MarkingCodeRepository,
	],
	exports: [
		AtolKkmService,
		ReceiptRepository,
	],
})
export default class AtolKkmModule {}
