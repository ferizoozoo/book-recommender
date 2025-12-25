import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddReviewTextToReviews1735000000000 implements MigrationInterface {
  name = "AddReviewTextToReviews1735000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add review column to reviews table
    await queryRunner.addColumn(
      "reviews",
      new TableColumn({
        name: "review",
        type: "text",
        isNullable: false,
        default: "''",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop review column from reviews table
    const table = await queryRunner.getTable("reviews");
    if (table) {
      const col = table.findColumnByName("review");
      if (col) {
        await queryRunner.dropColumn("reviews", col);
      }
    }
  }
}
