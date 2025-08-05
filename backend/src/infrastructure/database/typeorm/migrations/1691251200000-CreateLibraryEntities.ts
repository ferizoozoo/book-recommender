import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateLibraryEntities1691251200000 implements MigrationInterface {
  name = "CreateLibraryEntities1691251200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Author table
    await queryRunner.createTable(
      new Table({
        name: "authors",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "bio",
            type: "text",
            isNullable: true,
          },
          {
            name: "image",
            type: "varchar",
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

    // Create Publisher table
    await queryRunner.createTable(
      new Table({
        name: "publishers",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "address",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "city",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "state",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "zip",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "country",
            type: "varchar",
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

    // Create Book table
    await queryRunner.createTable(
      new Table({
        name: "books",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "isbn",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "year",
            type: "integer",
          },
          {
            name: "image",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "quantity",
            type: "integer",
            default: 0,
          },
          {
            name: "available",
            type: "boolean",
            default: false,
          },
          {
            name: "labels",
            type: "text",
            isNullable: true,
          },
          {
            name: "rating",
            type: "float",
            default: 0,
          },
          {
            name: "numberOfRatings",
            type: "integer",
            default: 0,
          },
          {
            name: "numberOfReviews",
            type: "integer",
            default: 0,
          },
          {
            name: "authorId",
            type: "integer",
          },
          {
            name: "publisherId",
            type: "integer",
          },
        ],
      }),
      true
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      "books",
      new TableForeignKey({
        columnNames: ["authorId"],
        referencedColumnNames: ["id"],
        referencedTableName: "authors",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "books",
      new TableForeignKey({
        columnNames: ["publisherId"],
        referencedColumnNames: ["id"],
        referencedTableName: "publishers",
        onDelete: "CASCADE",
      })
    );

    // Add foreign key constraints for User relationships
    await queryRunner.createForeignKey(
      "authors",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "publishers",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const bookTable = await queryRunner.getTable("books");
    const authorTable = await queryRunner.getTable("authors");
    const publisherTable = await queryRunner.getTable("publishers");

    if (bookTable) {
      const authorForeignKey = bookTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("authorId") !== -1
      );
      if (authorForeignKey) {
        await queryRunner.dropForeignKey("books", authorForeignKey);
      }

      const publisherForeignKey = bookTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("publisherId") !== -1
      );
      if (publisherForeignKey) {
        await queryRunner.dropForeignKey("books", publisherForeignKey);
      }
    }

    if (authorTable) {
      const userForeignKey = authorTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("userId") !== -1
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey("authors", userForeignKey);
      }
    }

    if (publisherTable) {
      const userForeignKey = publisherTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("userId") !== -1
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey("publishers", userForeignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable("books");
    await queryRunner.dropTable("authors");
    await queryRunner.dropTable("publishers");
  }
}
