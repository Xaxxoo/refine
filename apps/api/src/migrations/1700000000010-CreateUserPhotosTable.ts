import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserPhotosTable1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_photos" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "url" varchar NOT NULL,
        "position" int NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE ("user_id", "position")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_user_photos_user_id" ON "user_photos" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_photos"`);
  }
}
