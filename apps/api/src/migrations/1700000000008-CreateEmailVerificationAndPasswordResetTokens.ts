import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmailVerificationAndPasswordResetTokens1700000000008
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "email_verification_tokens" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" varchar NOT NULL UNIQUE,
        "expires_at" TIMESTAMP NOT NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_email_verification_tokens_user_id" ON "email_verification_tokens" ("user_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "password_reset_tokens" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" varchar NOT NULL UNIQUE,
        "expires_at" TIMESTAMP NOT NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_password_reset_tokens_user_id" ON "password_reset_tokens" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    await queryRunner.query(`DROP TABLE "email_verification_tokens"`);
  }
}
