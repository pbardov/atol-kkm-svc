import { MigrationInterface, QueryRunner } from "typeorm";

export class ImcType1760495711665 implements MigrationInterface {
    name = 'ImcType1760495711665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."marking_code_imc_type_enum" RENAME TO "marking_code_imc_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."marking_code_imc_type_enum" AS ENUM('0', '1', '2', '3', '4', '5', '256')`);
        await queryRunner.query(`ALTER TABLE "marking_code" ALTER COLUMN "imc_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "marking_code" ALTER COLUMN "imc_type" TYPE "public"."marking_code_imc_type_enum" USING "imc_type"::"text"::"public"."marking_code_imc_type_enum"`);
        await queryRunner.query(`ALTER TABLE "marking_code" ALTER COLUMN "imc_type" SET DEFAULT '256'`);
        await queryRunner.query(`DROP TYPE "public"."marking_code_imc_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."marking_code_imc_type_enum_old" AS ENUM('0', '1', '2', '3', '4', '5', '255')`);
        await queryRunner.query(`ALTER TABLE "marking_code" ALTER COLUMN "imc_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "marking_code" ALTER COLUMN "imc_type" TYPE "public"."marking_code_imc_type_enum_old" USING "imc_type"::"text"::"public"."marking_code_imc_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "marking_code" ALTER COLUMN "imc_type" SET DEFAULT '255'`);
        await queryRunner.query(`DROP TYPE "public"."marking_code_imc_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."marking_code_imc_type_enum_old" RENAME TO "marking_code_imc_type_enum"`);
    }

}
