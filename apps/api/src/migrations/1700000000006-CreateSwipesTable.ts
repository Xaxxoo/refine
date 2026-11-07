import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSwipesTable1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "swipes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "swiper_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "swiped_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "action" varchar NOT NULL,
        "is_match" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE ("swiper_id", "swiped_id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_swipes_swiper_id" ON "swipes" ("swiper_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_swipes_swiped_id" ON "swipes" ("swiped_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_swipes_is_match" ON "swipes" ("swiper_id") WHERE "is_match" = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "swipes"`);
  }
}
