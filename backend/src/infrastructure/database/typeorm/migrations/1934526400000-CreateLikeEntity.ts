import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateLikeEntity1934526400000 implements MigrationInterface {
  name = "CreateLikeEntity1934526400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create likes table
    await queryRunner.createTable(
      new Table({
        name: "likes",
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
            isNullable: false,
          },
          {
            name: "bookId",
            type: "integer",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Add foreign key constraint for userId
    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Add foreign key constraint for bookId
    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        columnNames: ["bookId"],
        referencedColumnNames: ["id"],
        referencedTableName: "books",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const likesTable = await queryRunner.getTable("likes");

    if (likesTable) {
      const userForeignKey = likesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("userId") !== -1
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey("likes", userForeignKey);
      }

      const bookForeignKey = likesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("bookId") !== -1
      );
      if (bookForeignKey) {
        await queryRunner.dropForeignKey("likes", bookForeignKey);
      }
    }

    // Drop the likes table
    await queryRunner.dropTable("likes");
  }
}
