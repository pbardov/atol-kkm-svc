import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {FiscalTask, fiscalTaskTypes, FiscalTaskTypes} from '@pbardov/node-atol-rpc/dist/types/fiscal.task.js';
import {FiscalTaskResult} from '@pbardov/node-atol-rpc/dist/types/fiscal.task-result.js';

@Entity('receipt')
export default class Receipt {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: fiscalTaskTypes
	})
	type: FiscalTaskTypes;

	@Column('timestamp', {name: 'created_at', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@Column('timestamp', {name: 'fiscalized_at', nullable: true})
	fiscalizedAt: Date | null = null;

	@Column('jsonb', {name: 'result', nullable: true})
	result: FiscalTaskResult | null = null;

	@Column('jsonb', {name: 'error', nullable: true})
	error: any = null;

	@Column('jsonb', {name: 'payload'})
	payload: FiscalTask;
}
