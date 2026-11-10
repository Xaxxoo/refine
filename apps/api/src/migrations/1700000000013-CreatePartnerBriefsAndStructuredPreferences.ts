import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePartnerBriefsAndStructuredPreferences1700000000013
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "partner_briefs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "raw_text" text NOT NULL,
        "title" varchar(100),
        "is_active" boolean NOT NULL DEFAULT false,
        "processing_status" varchar(20) NOT NULL DEFAULT 'pending',
        "brief_embedding" vector(768),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_partner_briefs_user_id" ON "partner_briefs" ("user_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "structured_preferences" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "brief_id" uuid NOT NULL REFERENCES "partner_briefs"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "attribute" varchar(100) NOT NULL,
        "normalized_value" varchar(200) NOT NULL,
        "original_wording" text NOT NULL,
        "category" varchar(50) NOT NULL,
        "priority" varchar(20) NOT NULL,
        "confidence" float NOT NULL DEFAULT 0.5,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_structured_preferences_brief_id" ON "structured_preferences" ("brief_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_structured_preferences_user_id" ON "structured_preferences" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "structured_preferences"`);
    await queryRunner.query(`DROP TABLE "partner_briefs"`);
  }
}
