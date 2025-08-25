import {
  BookEntity,
  UserBookEntity,
  UserBookLikeEntity,
} from "../models/library.models";
import AppDataSource from "..";
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

export class BookRepository implements IBookRepository {
  private bookRepository: Repository<BookEntity>;
  private readonly bookLikeRepository: Repository<UserBookLikeEntity>;
  private readonly bookUserRepository: Repository<UserBookEntity>;
  private readonly userRepository: Repository<UserEntity>;

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

    query.andWhere("book.title ILIKE :title", { title: `%${filters.title}%` });
    query.andWhere("book.author ILIKE :author", {
      author: `%${filters.author}%`,
    });

    const filteredBooks = await query.getMany();
    return mapBookEntitiesToDomain(filteredBooks);
  }
  async getAllForUser(userId: number): Promise<Book[]> {
    const bookEntities = await this.bookUserRepository.find({
      where: { userId: userId },
      relations: ["author", "publisher"],
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
    const bookEntities = await this.bookRepository
      .createQueryBuilder("books")
      // Select all columns from the book entity
      .addSelect("COUNT(books.numberOfRatings)", "ratingsCount")
      // Group by book to count ratings for each one
      .groupBy("books.id")
      // Order by the new 'ratingsCount' field in descending order
      .orderBy("ratingsCount", "DESC")
      // Optional: Limit the number of results (e.g., top 10)
      .take(limit)
      // Execute the query
      .getRawMany();
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
    const bookEntity = mapBookDomainToModel(book);
    await this.bookRepository.save(bookEntity);
  }

  async delete(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }

  async update(book: Book): Promise<void> {
    const bookEntity = mapBookDomainToModel(book);
    await this.bookRepository.save(bookEntity);
  }

  async search(query: string): Promise<Book[]> {
    // Simple implementation that searches title and description
    // A more robust implementation would use full-text search
    const bookEntities = await this.bookRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.publisher", "publisher")
      .where("book.title LIKE :query OR book.description LIKE :query", {
        query: `%${query}%`,
      })
      .getMany();

    return bookEntities.map((entity) => mapBookEntityToDomain(entity));
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
      where: { id: book.id },
    });

    if (!bookEntity) {
      throw new Error("Book not found");
    }

    like.user = userEntity;
    like.book = bookEntity;
    await this.bookLikeRepository.save(like);
  }
}
