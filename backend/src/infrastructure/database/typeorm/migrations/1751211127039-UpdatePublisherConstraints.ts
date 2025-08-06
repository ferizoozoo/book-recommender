import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdatePublisherConstraints1751211127039
  implements MigrationInterface
{
  name = "UpdatePublisherConstraints1751211127039";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("publishers", "user");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "publishers",
      new TableColumn({
        name: "user",
        type: "foreignKey",
        isNullable: true,
      })
    );
  }
}
