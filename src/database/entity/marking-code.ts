import {Column, Entity, PrimaryColumn} from 'typeorm';
import {ImcParamsValidation, ImcType} from '@pbardov/node-atol-rpc/dist/types/imc-params.js';
import {
	GetMarkingCodeValidationStatusTaskResult
} from '@pbardov/node-atol-rpc/dist/types/get-marking-code-validation-status.task-result.js';

@Entity('marking_code')
export default class MarkingCode {
	@PrimaryColumn({
		type: 'bytea',
	})
	id: Buffer; // sha256 hash of imc field

	@Column({type: 'text'})
	imc: string;

	@Column({
		name: 'imc_type',
		type: 'enum',
		enum: ImcType,
		default: ImcType.auto,
	})
	imcType: ImcType;

	@Column({
		type: 'jsonb'
	})
	params: ImcParamsValidation;

	@Column({
		type: 'timestamp',
		name: 'validation_started',
	})
	validationStarted: Date;

	@Column({
		type: 'timestamp',
		name: 'validation_completed',
		nullable: true,
		default: null,
	})
	validationCompleted: Date | null = null;

	@Column({name: 'is_ready', default: false})
	isReady: boolean = false;

	@Column({name: 'is_valid', default: false})
	isValid: boolean = false;

	@Column({
		type: 'jsonb',
		name: 'validation_result',
		nullable: true,
		default: null,
	})
	validationResult: GetMarkingCodeValidationStatusTaskResult | null = null;

	@Column({type: 'text', nullable: true, default: null})
	action: string | null = null;
}
