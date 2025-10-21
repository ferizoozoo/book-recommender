import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserBookLikesToLikes1892547500000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const candidates = [
      "UserBookLikes",
      "user_book_likes",
      "userbooklikes",
      "UserBookLike",
      "user_book_like",
      "userbooklike",
    ];

    // Ensure meta table exists to store original name for down()
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS migration_meta_likes_rename (original_name TEXT)`
    );

    for (const name of candidates) {
      const table = await queryRunner.getTable(name);
      if (table) {
        // store original name only if not already stored
        const rows: Array<{ original_name: string }> = await queryRunner.query(
          `SELECT original_name FROM migration_meta_likes_rename LIMIT 1`
        );
        if (!rows || rows.length === 0) {
          await queryRunner.query(
            `INSERT INTO migration_meta_likes_rename (original_name) VALUES (?)`,
            [name]
          );
        }

        await queryRunner.renameTable(name, "likes");
        return;
      }
    }

    // No candidate found -> nothing to rename
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const rows: Array<{ original_name: string }> = await queryRunner.query(
      `SELECT original_name FROM migration_meta_likes_rename LIMIT 1`
    );
    if (rows && rows.length > 0) {
      const original = rows[0].original_name;
      const likesTable = await queryRunner.getTable("likes");
      if (likesTable) {
        await queryRunner.renameTable("likes", original);
      }
    }

    // cleanup meta table
    await queryRunner.query(`DROP TABLE IF EXISTS migration_meta_likes_rename`);
  }
}
