import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInterestsAndEmbeddingToUsers1700000000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "interests" text[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "embedding" vector(768)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_embedding_ivfflat" ON "users" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_embedding_ivfflat"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "embedding"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "interests"`,
    );
  }
}
