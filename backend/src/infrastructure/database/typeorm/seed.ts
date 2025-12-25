import { fakerEN as faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import AppDataSource from "./index.ts";
import { UserEntity } from "./models/auth.models.ts";
import {
  AuthorEntity,
  BookEntity,
  PublisherEntity,
} from "./models/library.models.ts";

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    await createUsers(AppDataSource);
    await createAuthors(AppDataSource);
    await createPublishers(AppDataSource);
    await createBooks(AppDataSource);
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("Data Source has been destroyed.");
  }
}

async function createUsers(AppDataSource: DataSource) {
  const userRepository = AppDataSource.getRepository(UserEntity);

  await userRepository.clear();
  console.log("Cleared existing data.");

  const users: UserEntity[] = [];
  for (let i = 0; i < 50; i++) {
    const user = new UserEntity();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.password = faker.internet.password();
    user.salt = faker.string.alphanumeric(16);
    user.email = faker.internet.email().toLowerCase();
    users.push(user);
  }

  try {
    await userRepository.save(users);
    console.log("✅ Successfully seeded 50 users.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

async function createAuthors(AppDataSource: DataSource) {
  const authorRepository = AppDataSource.getRepository(AuthorEntity);
  const userRepository = AppDataSource.getRepository(UserEntity);

  await authorRepository.clear();
  console.log("Cleared existing data.");

  const authors: AuthorEntity[] = [];
  for (let i = 0; i < 50; i++) {
    const author = new AuthorEntity();
    author.bio = faker.lorem.paragraph();
    author.image = faker.image.url();
    author.user = await userRepository.findOneOrFail({
      where: {},
      order: { id: "ASC" },
    });
    authors.push(author);
  }

  try {
    await authorRepository.save(authors);
    console.log("✅ Successfully seeded 50 authors.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

async function createPublishers(AppDataSource: DataSource) {
  const publisherRepository = AppDataSource.getRepository(PublisherEntity);

  await publisherRepository.clear();
  console.log("Cleared existing data.");

  const publishers: PublisherEntity[] = [];
  for (let i = 0; i < 50; i++) {
    const publisher = new PublisherEntity(); // Create an instance of the Publisher entity
    publisher.name = faker.company.name();
    publisher.address = faker.lorem.paragraph();
    publisher.city = faker.string.alphanumeric(10);
    publisher.state = faker.string.alphanumeric(10);
    publisher.country = faker.string.alphanumeric(10);
    publisher.zip = faker.string.alphanumeric(5);
    publishers.push(publisher);
  }

  try {
    await publisherRepository.save(publishers);
    console.log("✅ Successfully seeded 50 publishers.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

async function createBooks(AppDataSource: DataSource) {
  const bookRepository = AppDataSource.getRepository(BookEntity);
  const publisherRepository = AppDataSource.getRepository(PublisherEntity);
  const authorRepository = AppDataSource.getRepository(AuthorEntity);

  await bookRepository.clear();
  console.log("Cleared existing data.");

  const books: BookEntity[] = [];
  for (let i = 0; i < 50; i++) {
    const book = new BookEntity(); // Create an instance of the Book entity
    book.title = faker.lorem.sentence();
    book.description = faker.lorem.paragraph();
    book.isbn = faker.string.alphanumeric(13);
    book.quantity = faker.number.int({ min: 1, max: 100 });
    book.image = faker.image.url();
    book.labels = [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()];
    book.available = faker.datatype.boolean();
    book.year = faker.number.int({ min: 1900, max: 2023 });
    book.publisher = await publisherRepository.findOneOrFail({
      where: {},
      order: { id: "ASC" },
    });
    book.author = await authorRepository.findOneOrFail({
      where: {},
      order: { id: "ASC" },
    });
    books.push(book);
  }

  try {
    await bookRepository.save(books);
    console.log("✅ Successfully seeded 50 books.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

// run seeding the DB
seedDatabase();
