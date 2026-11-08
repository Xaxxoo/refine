import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserPreferencesTable1700000000009
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_preferences" (
        "user_id" uuid PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
        "min_age" int DEFAULT 18,
        "max_age" int DEFAULT 99,
        "preferred_gender" varchar,
        "max_distance_km" int DEFAULT 50
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_preferences"`);
  }
}
