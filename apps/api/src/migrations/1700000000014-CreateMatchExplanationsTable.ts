import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMatchExplanationsTable1700000000014
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "match_explanations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "candidate_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "overall_score" float NOT NULL DEFAULT 0,
        "score_breakdown" jsonb NOT NULL DEFAULT '{}',
        "strengths" text[] NOT NULL DEFAULT '{}',
        "differences" text[] NOT NULL DEFAULT '{}',
        "generated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_match_explanations_user_id" ON "match_explanations" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_match_explanations_user_candidate" ON "match_explanations" ("user_id", "candidate_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "match_explanations"`);
  }
}
