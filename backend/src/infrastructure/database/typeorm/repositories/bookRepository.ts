import {
  BookEntity,
  UserBookEntity,
  UserBookLikeEntity,
} from "../models/library.models";
import { Like, Repository } from "typeorm";
import { Book } from "../../../../domain/library/book.entity";
import { Author } from "../../../../domain/library/author.entity";
import { Publisher } from "../../../../domain/library/publisher.entity";
import {
  mapBookDomainToModel,
  mapBookEntityToDomain,
  mapBookEntitiesToDomain,
  mapUserBookEntitiesToBookDomain,
} from "../models/mappers/library.mapper";
import { IBookRepository } from "../../../../services/common/interfaces/repositories/i-bookRepository";
import { UserEntity } from "../models/auth.models";
import { User } from "../../../../domain/auth/user.entity";
import AppDataSource from "..";

export class BookRepository implements IBookRepository {
  private bookRepository: Repository<BookEntity>;
  private readonly bookLikeRepository: Repository<UserBookLikeEntity>; // TODO: this violates DDD, and for fetching books, we should use an orchestrator
  private readonly bookUserRepository: Repository<UserBookEntity>; // TODO: this violates DDD, and for fetching books, we should use an orchestrator
  private readonly userRepository: Repository<UserEntity>; // TODO: this violates DDD, and for fetching books, we should use an orchestrator

  // TODO: use the di to use the repositories, instead of creating them here
  constructor() {
    this.bookRepository = AppDataSource.getRepository(BookEntity);
    this.bookLikeRepository = AppDataSource.getRepository(UserBookLikeEntity);
    this.bookUserRepository = AppDataSource.getRepository(UserBookEntity);
  }
  async filter(filters: any): Promise<Book[]> {
    const query = this.bookRepository.createQueryBuilder("book");

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
    const bookEntities = await this.bookUserRepository.find({
      where: { userId: userId },
    });

    return mapUserBookEntitiesToBookDomain(bookEntities);
  }

  async getById(id: number): Promise<Book | null> {
    const bookEntity = await this.bookRepository.findOne({
      where: { id },
      relations: ["author", "publisher"],
    });
    return bookEntity ? mapBookEntityToDomain(bookEntity) : null;
  }

  async getAll(): Promise<Book[]> {
    const bookEntities = await this.bookRepository.find({
      relations: ["author", "publisher"],
      order: { id: "DESC" },
    });
    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getByAuthorId(authorId: number): Promise<Book[]> {
    const bookEntities = await this.bookRepository.find({
      where: { author: { id: authorId } },
      relations: ["author", "publisher"],
    });
    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getTrendingBooks(limit: number): Promise<Book[]> {
    const bookEntities = await this.bookRepository.find({
      take: limit,
      relations: ["author", "publisher"],
      order: { id: "DESC" },
    });

    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getByPublisherId(publisherId: number): Promise<Book[]> {
    const bookEntities = await this.bookRepository.find({
      where: { publisher: { id: publisherId } },
      relations: ["author", "publisher"],
    });
    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
  }

  async getByIsbn(isbn: string): Promise<Book | null> {
    const bookEntity = await this.bookRepository.findOne({
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
      await this.bookRepository.insert(bookEntity);
    } else {
      await this.bookRepository.insert(entityWithoutId);
    }
  }

  async delete(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }

  async update(book: Book): Promise<void> {
    const bookEntity = mapBookDomainToModel(book);
    await this.bookRepository.save(bookEntity);
  }

  async likeBook(user: User, book: Book): Promise<void> {
    if (!user || !book) {
      throw new Error("User and Book are required to like a book");
    }

    const like = new UserBookLikeEntity();

    const userEntity = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!userEntity) {
      throw new Error("User not found");
    }

    const bookEntity = await this.bookRepository.findOne({
      where: book.id ? { id: book.id } : undefined,
    });

    if (!bookEntity) {
      throw new Error("Book not found");
    }

    like.user = userEntity;
    like.book = bookEntity;
    await this.bookLikeRepository.save(like);
  }
}
