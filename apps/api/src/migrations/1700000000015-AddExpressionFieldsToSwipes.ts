import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpressionFieldsToSwipes1700000000015
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swipes" ADD COLUMN "message" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipes" ADD COLUMN "source" varchar(20) DEFAULT 'discovery'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "swipes" DROP COLUMN "source"`);
    await queryRunner.query(`ALTER TABLE "swipes" DROP COLUMN "message"`);
  }
}
