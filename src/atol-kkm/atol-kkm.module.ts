import {Module} from '@nestjs/common';
import AppConfigModule from '../config/app-config.module.js';
import AtolKkmService from './atol-kkm.service.js';
import {TypeOrmModule} from '@nestjs/typeorm';
import Receipt from '../database/entity/Receipt.js';
import ReceiptRepository from './receipt.repository.js';

@Module({
	imports: [
		AppConfigModule,
		TypeOrmModule.forFeature([Receipt]),
	],
	providers: [
		AtolKkmService,
		ReceiptRepository,
	],
	exports: [
		AtolKkmService,
		ReceiptRepository,
	],
})
export default class AtolKkmModule {}
