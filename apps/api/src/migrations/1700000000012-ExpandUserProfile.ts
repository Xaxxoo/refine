import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandUserProfile1700000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "self_description" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "education" varchar(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "religion" varchar(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "relationship_intention" varchar(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "marital_history" varchar(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "children" varchar(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "height_cm" int`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "smoking" varchar(20)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "drinking" varchar(20)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "relocation_intention" varchar(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "occupation" varchar(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "employment_status" varchar(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "preferred_dating_genders" text[]`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "profile_embedding" vector(768)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_embedding"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "preferred_dating_genders"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "employment_status"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "occupation"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "relocation_intention"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "drinking"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "smoking"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height_cm"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "children"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "marital_history"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "relationship_intention"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "religion"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "self_description"`);
  }
}
