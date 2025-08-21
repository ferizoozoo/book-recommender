import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddUserBookAndUpdateBook1892547200000
  implements MigrationInterface
{
  name = "AddUserBookAndUpdateBook1892547200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create UserBook table
    await queryRunner.createTable(
      new Table({
        name: "user_books",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "userId",
            type: "integer",
          },
          {
            name: "bookId",
            type: "integer",
          },
        ],
      }),
      true
    );

    // Add foreign key for userId in UserBook
    await queryRunner.createForeignKey(
      "user_books",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Add foreign key for bookId in UserBook
    await queryRunner.createForeignKey(
      "user_books",
      new TableForeignKey({
        columnNames: ["bookId"],
        referencedColumnNames: ["id"],
        referencedTableName: "books",
        onDelete: "CASCADE",
      })
    );

    // No need to add a column to books table
    // The relationship is handled through the user_books junction table
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const userBookTable = await queryRunner.getTable("user_books");
    if (userBookTable) {
      const userForeignKey = userBookTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("userId") !== -1
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey("user_books", userForeignKey);
      }

      const bookForeignKey = userBookTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("bookId") !== -1
      );
      if (bookForeignKey) {
        await queryRunner.dropForeignKey("user_books", bookForeignKey);
      }
    }

    // Drop the UserBook table
    await queryRunner.dropTable("user_books");
  }
}
