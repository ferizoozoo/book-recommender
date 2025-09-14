import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolesToUser1694547200000 implements MigrationInterface {
  name = "AddRolesToUser1694547200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "roles" text NOT NULL DEFAULT '["user"]'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
  }
}
