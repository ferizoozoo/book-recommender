import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAutoIncrementToPrimaryKeys1735100000000
  implements MigrationInterface
{
  name = "AddAutoIncrementToPrimaryKeys1735100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add AUTOINCREMENT constraint to all primary key columns for SQLite
    // Note: This is a workaround for SQLite as it requires explicit AUTOINCREMENT
    // The entities now use @PrimaryGeneratedColumn('increment') strategy

    // Drop and recreate authors table with AUTOINCREMENT
    await queryRunner.query(`
      CREATE TABLE authors_new (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        bio text,
        image text,
        userId integer
      );
    `);
    await queryRunner.query(`
      INSERT INTO authors_new (id, bio, image, userId)
      SELECT id, bio, image, userId FROM authors;
    `);
    await queryRunner.query(`DROP TABLE authors;`);
    await queryRunner.query(`ALTER TABLE authors_new RENAME TO authors;`);

    // Drop and recreate publishers table with AUTOINCREMENT
    await queryRunner.query(`
      CREATE TABLE publishers_new (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        name varchar NOT NULL,
        address varchar,
        city varchar,
        state varchar,
        zip varchar,
        country varchar
      );
    `);
    await queryRunner.query(`
      INSERT INTO publishers_new (id, name, address, city, state, zip, country)
      SELECT id, name, address, city, state, zip, country FROM publishers;
    `);
    await queryRunner.query(`DROP TABLE publishers;`);
    await queryRunner.query(`ALTER TABLE publishers_new RENAME TO publishers;`);

    // Drop and recreate books table with AUTOINCREMENT
    await queryRunner.query(`
      CREATE TABLE books_new (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        title varchar NOT NULL,
        description text,
        isbn varchar NOT NULL UNIQUE,
        year integer,
        image varchar,
        quantity integer NOT NULL DEFAULT 0,
        available boolean NOT NULL DEFAULT 0,
        labels text,
        authorId integer,
        publisherId integer
      );
    `);
    await queryRunner.query(`
      INSERT INTO books_new (id, title, description, isbn, year, image, quantity, available, labels, authorId, publisherId)
      SELECT id, title, description, isbn, year, image, quantity, available, labels, authorId, publisherId FROM books;
    `);
    await queryRunner.query(`DROP TABLE books;`);
    await queryRunner.query(`ALTER TABLE books_new RENAME TO books;`);

    // Drop and recreate users table with AUTOINCREMENT
    await queryRunner.query(`
      CREATE TABLE users_new (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        firstName varchar NOT NULL,
        lastName varchar NOT NULL,
        email varchar NOT NULL,
        password varchar NOT NULL,
        salt varchar NOT NULL,
        roles varchar NOT NULL
      );
    `);
    await queryRunner.query(`
      INSERT INTO users_new (id, firstName, lastName, email, password, salt, roles)
      SELECT id, firstName, lastName, email, password, salt, roles FROM users;
    `);
    await queryRunner.query(`DROP TABLE users;`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users;`);

    // Drop and recreate likes table with AUTOINCREMENT
    await queryRunner.query(`
      CREATE TABLE likes_new (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        userId integer,
        bookId integer
      );
    `);
    await queryRunner.query(`
      INSERT INTO likes_new (id, userId, bookId)
      SELECT id, userId, bookId FROM likes;
    `);
    await queryRunner.query(`DROP TABLE likes;`);
    await queryRunner.query(`ALTER TABLE likes_new RENAME TO likes;`);

    // Drop and recreate reviews table with AUTOINCREMENT
    await queryRunner.query(`
      CREATE TABLE reviews_new (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        rating integer NOT NULL DEFAULT 0,
        review text NOT NULL DEFAULT '',
        bookId integer,
        userId integer
      );
    `);
    await queryRunner.query(`
      INSERT INTO reviews_new (id, rating, review, bookId, userId)
      SELECT id, rating, review, bookId, userId FROM reviews;
    `);
    await queryRunner.query(`DROP TABLE reviews;`);
    await queryRunner.query(`ALTER TABLE reviews_new RENAME TO reviews;`);

    // Drop and recreate user_books table with AUTOINCREMENT
    await queryRunner.query(`
      CREATE TABLE user_books_new (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        userId integer NOT NULL,
        bookId integer
      );
    `);
    await queryRunner.query(`
      INSERT INTO user_books_new (id, userId, bookId)
      SELECT id, userId, bookId FROM user_books;
    `);
    await queryRunner.query(`DROP TABLE user_books;`);
    await queryRunner.query(`ALTER TABLE user_books_new RENAME TO user_books;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert is complex for SQLite table recreation, so we'll skip it
    // This migration is one-way to add AUTOINCREMENT support
  }
}
