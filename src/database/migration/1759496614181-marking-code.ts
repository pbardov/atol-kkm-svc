import { MigrationInterface, QueryRunner } from "typeorm";

export class MarkingCode1759496614181 implements MigrationInterface {
    name = 'MarkingCode1759496614181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."marking_code_imc_type_enum" AS ENUM('0', '1', '2', '3', '4', '5', '255')`);
        await queryRunner.query(`CREATE TABLE "marking_code" ("id" bytea NOT NULL, "imc" text NOT NULL, "imc_type" "public"."marking_code_imc_type_enum" NOT NULL DEFAULT '255', "params" jsonb NOT NULL, "validation_started" TIMESTAMP NOT NULL, "validation_completed" TIMESTAMP, "is_ready" boolean NOT NULL DEFAULT false, "is_valid" boolean NOT NULL DEFAULT false, "validation_result" jsonb, "action" text, CONSTRAINT "PK_f464ed2322cf080dbff2e59c96c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "marking_code"`);
        await queryRunner.query(`DROP TYPE "public"."marking_code_imc_type_enum"`);
    }

}
