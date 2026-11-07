import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessagesTable1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "sender_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "receiver_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "content" text NOT NULL,
        "is_read" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_messages_sender_receiver" ON "messages" ("sender_id", "receiver_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_messages_receiver_id" ON "messages" ("receiver_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_messages_created_at" ON "messages" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "messages"`);
  }
}
