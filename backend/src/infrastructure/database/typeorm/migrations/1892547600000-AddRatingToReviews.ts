import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRatingToReviews1892547600000 implements MigrationInterface {
  name = "AddRatingToReviews1892547600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add rating column to reviews
    await queryRunner.addColumn(
      "reviews",
      new TableColumn({
        name: "rating",
        type: "integer",
        isNullable: false,
        default: 0,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop rating column from reviews
    const table = await queryRunner.getTable("reviews");
    if (table) {
      const col = table.findColumnByName("rating");
      if (col) {
        await queryRunner.dropColumn("reviews", col);
      }
    }
  }
}
