import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlocksAndReportsTable1700000000005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "blocks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "blocker_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "blocked_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE ("blocker_id", "blocked_id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_blocks_blocker_id" ON "blocks" ("blocker_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_blocks_blocked_id" ON "blocks" ("blocked_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "reporter_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "reported_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "reason" varchar(100) NOT NULL,
        "description" text,
        "status" varchar NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_reports_reported_id" ON "reports" ("reported_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_reports_status" ON "reports" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TABLE "blocks"`);
  }
}
