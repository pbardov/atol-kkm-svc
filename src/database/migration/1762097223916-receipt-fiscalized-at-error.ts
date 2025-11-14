import { MigrationInterface, QueryRunner } from "typeorm";

export class ReceiptFiscalizedAtError1762097223916 implements MigrationInterface {
    name = 'ReceiptFiscalizedAtError1762097223916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" ADD "fiscalized_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD "error" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "error"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "fiscalized_at"`);
    }

}
