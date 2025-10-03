import {Repository} from 'typeorm';
import Receipt from '../database/entity/receipt.js';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';

@Injectable()
export default class ReceiptRepository extends Repository<Receipt> {
	constructor(@InjectRepository(Receipt) repo: Repository<Receipt>) {
		super(repo.target, repo.manager, repo.queryRunner);
	}
}
