import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateReviewEntity1851351456293 implements MigrationInterface {
  name = "CreateReviewEntity1851351456293";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Publisher table
    await queryRunner.createTable(
      new Table({
        name: "reviews",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "bookId",
            type: "integer",
            isNullable: true,
          },
          {
            name: "userId",
            type: "integer",
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      "reviews",
      new TableForeignKey({
        columnNames: ["user"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "reviews",
      new TableForeignKey({
        columnNames: ["book"],
        referencedColumnNames: ["id"],
        referencedTableName: "books",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const reviewTable = await queryRunner.getTable("reviews");

    if (reviewTable) {
      const userForeignKey = reviewTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("user") !== -1
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey("reviews", userForeignKey);
      }

      const bookForeignKey = reviewTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("book") !== -1
      );
      if (bookForeignKey) {
        await queryRunner.dropForeignKey("reviews", bookForeignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable("reviews");
  }
}
