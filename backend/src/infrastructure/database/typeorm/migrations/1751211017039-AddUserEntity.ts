import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEntity1751211017039 implements MigrationInterface {
  name = "AddUserEntity1751211017039";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(250) NOT NULL, "lastName" varchar(250) NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "salt" varchar NOT NULL)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
