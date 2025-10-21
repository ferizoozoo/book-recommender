import {
  BookEntity,
  LikeEntity,
  UserBookEntity,
} from "../models/library.models";
import { Repository } from "typeorm";
import { Book } from "../../../../domain/library/book.entity";
import {
  mapBookDomainToModel,
  mapBookEntityToDomain,
  mapBookEntitiesToDomain,
  mapUserBookEntitiesToBookDomain,
} from "../models/mappers/library.mapper";
import { IBookRepository } from "../../../../services/common/interfaces/repositories/i-bookRepository";
import { User } from "../../../../domain/auth/user.entity";
import AppDataSource from "..";
import { mapUserDomainToModel } from "../models/mappers/auth.mapper";

export class BookRepository implements IBookRepository {
  #books: Repository<BookEntity>;
  #userBooks: Repository<UserBookEntity>;

  constructor() {
    this.#books = AppDataSource.getRepository(BookEntity);
    this.#userBooks = AppDataSource.getRepository(UserBookEntity);
  }

  async filter(filters: any): Promise<Book[]> {
    const query = this.#books.createQueryBuilder("book");

    if (filters.year) {
      query.andWhere("book.year = :year", { year: filters.year });
    }

    query.orWhere("book.title LIKE :title", { title: `%${filters.title}%` });
    query.orWhere("book.author LIKE :author", {
      author: `%${filters.author}%`,
    });

    const filteredBooks = await query.getMany();
    return mapBookEntitiesToDomain(filteredBooks);
  }
  async getAllForUser(userId: number): Promise<Book[]> {
    const bookEntities = await this.#userBooks.find({
      where: { user: { id: userId } },
    });

    return mapUserBookEntitiesToBookDomain(bookEntities);
  }

  async getById(id: number): Promise<Book | null> {
    const bookEntity = await this.#books.findOne({
      where: { id },
      relations: ["author", "publisher"],
    });
    return bookEntity ? mapBookEntityToDomain(bookEntity) : null;
  }

  async getAll(): Promise<Book[]> {
    const bookEntities = await this.#books.find({
      relations: ["author", "publisher"],
      order: { id: "DESC" },
    });
    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getByAuthorId(authorId: number): Promise<Book[]> {
    const bookEntities = await this.#books.find({
      where: { author: { id: authorId } },
      relations: ["author", "publisher"],
    });
    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getTrendingBooks(limit: number): Promise<Book[]> {
    const bookEntities = await this.#books.find({
      take: limit,
      relations: ["author", "publisher"],
      order: { id: "DESC" },
    });

    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getByPublisherId(publisherId: number): Promise<Book[]> {
    const bookEntities = await this.#books.find({
      where: { publisher: { id: publisherId } },
      relations: ["author", "publisher"],
    });
    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getByIsbn(isbn: string): Promise<Book | null> {
    const bookEntity = await this.#books.findOne({
      where: { isbn },
      relations: ["author", "publisher"],
    });
    return bookEntity ? mapBookEntityToDomain(bookEntity) : null;
  }

  async save(book: Book): Promise<void> {
    // Ensure we're not passing a sentinel value (-1) as ID
    if (book.id && book.id <= 0) {
      book.id = null;
    }
    const bookEntity = mapBookDomainToModel(book);
    // Extract everything except id for new books
    const { id, ...entityWithoutId } = bookEntity;
    if (id && id > 0) {
      await this.#books.insert(bookEntity);
    } else {
      await this.#books.insert(entityWithoutId);
    }
  }

  async delete(id: number): Promise<void> {
    await this.#books.delete(id);
  }

  async update(book: Book): Promise<void> {
    const bookEntity = mapBookDomainToModel(book);
    await this.#books.save(bookEntity);
  }

  async likeBook(user: User, book: Book): Promise<void> {
    if (!user || !book) {
      throw new Error("User and Book are required to like a book");
    }

    const like = new LikeEntity();

    like.user = mapUserDomainToModel(user);
    like.book = mapBookDomainToModel(book);
    await this.#books.save(like);
  }
}
