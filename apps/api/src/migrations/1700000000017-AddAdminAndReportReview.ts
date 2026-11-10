import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminAndReportReview1700000000017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "role" varchar(20) NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD COLUMN "reviewed_by" uuid REFERENCES "users"("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD COLUMN "reviewed_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD COLUMN "action_taken" varchar(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD COLUMN "admin_notes" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN "admin_notes"`);
    await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN "action_taken"`);
    await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN "reviewed_at"`);
    await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN "reviewed_by"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }
}
