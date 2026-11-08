import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastSeenAtToUsers1700000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "last_seen_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "last_seen_at"`,
    );
  }
}
