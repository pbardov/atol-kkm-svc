import { MigrationInterface, QueryRunner } from "typeorm";

export class Receipt1755103908747 implements MigrationInterface {
    name = 'Receipt1755103908747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."receipt_type_enum" AS ENUM('sell', 'buy', 'sellReturn', 'buyReturn')`);
        await queryRunner.query(`CREATE TABLE "receipt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."receipt_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "result" jsonb, "payload" jsonb NOT NULL, CONSTRAINT "PK_b4b9ec7d164235fbba023da9832" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "receipt"`);
        await queryRunner.query(`DROP TYPE "public"."receipt_type_enum"`);
    }

}
