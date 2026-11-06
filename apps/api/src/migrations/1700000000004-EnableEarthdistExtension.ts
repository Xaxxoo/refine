import { MigrationInterface, QueryRunner } from "typeorm";

export class EnableEarthdistExtension1700000000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS cube`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS earthdistance`);
    await queryRunner.query(
      `CREATE INDEX "IDX_users_earth_location" ON "users" USING gist (ll_to_earth("latitude", "longitude")) WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_users_earth_location"`,
    );
    await queryRunner.query(`DROP EXTENSION IF EXISTS earthdistance`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS cube`);
  }
}
