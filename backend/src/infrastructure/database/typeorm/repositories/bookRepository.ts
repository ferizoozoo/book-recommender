import { BookEntity, UserBookLikeEntity } from "../models/library.models";
import AppDataSource from "..";
import { Like, Repository } from "typeorm";
import { Book } from "../../../../domain/library/book.entity";
import { Author } from "../../../../domain/library/author.entity";
import { Publisher } from "../../../../domain/library/publisher.entity";
import {
  mapBookDomainToModel,
  mapBookEntityToDomain,
  mapBookEntitiesToDomain,
} from "../models/mappers/library.mapper";
import { IBookRepository } from "../../../../services/common/interfaces/repositories/i-bookRepository";
import { UserEntity } from "../models/auth.models";

export class BookRepository implements IBookRepository {
  private bookRepository: Repository<BookEntity>;
  private readonly bookLikeRepository: Repository<UserBookLikeEntity>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(BookEntity);
    this.bookLikeRepository = AppDataSource.getRepository(UserBookLikeEntity);
  }

  async getById(id: number): Promise<Book | null> {
    const bookEntity = await this.bookRepository.findOne({
      where: { id },
      relations: ["author", "publisher"],
    });
    return bookEntity ? this.mapToDomain(bookEntity) : null;
  }

  async getAll(): Promise<Book[]> {
    const bookEntities = await this.bookRepository.find({
      relations: ["author", "publisher"],
    });
    return bookEntities.map((entity) => this.mapToDomain(entity));
  }

  async getByAuthorId(authorId: number): Promise<Book[]> {
    const bookEntities = await this.bookRepository.find({
      where: { author: { id: authorId } },
      relations: ["author", "publisher"],
    });
    return bookEntities.map((entity) => this.mapToDomain(entity));
  }

  async getByPublisherId(publisherId: number): Promise<Book[]> {
    const bookEntities = await this.bookRepository.find({
      where: { publisher: { id: publisherId } },
      relations: ["author", "publisher"],
    });
    return bookEntities.map((entity) => this.mapToDomain(entity));
  }

  async getByIsbn(isbn: string): Promise<Book | null> {
    const bookEntity = await this.bookRepository.findOne({
      where: { isbn },
      relations: ["author", "publisher"],
    });
    return bookEntity ? this.mapToDomain(bookEntity) : null;
  }

  async save(book: Book): Promise<void> {
    const bookEntity = this.mapToEntity(book);
    await this.bookRepository.save(bookEntity);
  }

  async delete(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }

  async update(book: Book): Promise<void> {
    const bookEntity = this.mapToEntity(book);
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

    return bookEntities.map((entity) => this.mapToDomain(entity));
  }

  async likeBook(user: UserEntity, book: BookEntity): Promise<void> {
    const like = new UserBookLikeEntity();
    if (!user || !book) {
      throw new Error("User and Book are required to like a book");
    }
    like.user = user;
    like.book = book;
    await this.bookLikeRepository.save(like);
  }

  private mapToDomain(entity: BookEntity): Book {
    const book = new Book(
      entity.id,
      entity.title,
      new Author(0),
      entity.description || "",
      entity.isbn,
      new Publisher(0),
      entity.year || 0,
      entity.image || "",
      entity.rating,
      entity.numberOfRatings,
      entity.numberOfReviews
    );
    // We assume these fields are available in the Book domain entity
    // If not, they would need to be added or mapped appropriately
    book.rating = entity.rating;
    book.numberOfRatings = entity.numberOfRatings;
    book.numberOfReviews = entity.numberOfReviews;

    // We would also map author and publisher if needed
    // This depends on your domain model structure

    return book;
  }

  private mapToEntity(book: Book): BookEntity {
    const entity = new BookEntity();
    if (book.id) entity.id = book.id;
    entity.title = book.title;
    entity.description = book.description || "";
    entity.isbn = book.isbn;
    entity.year = book.year || 0;
    entity.image = book.image || "";
    entity.rating = book.rating || 0;
    entity.numberOfRatings = book.numberOfRatings || 0;
    entity.numberOfReviews = book.numberOfReviews || 0;

    // Author and publisher would be set here if needed
    // This depends on your entity relationships

    return entity;
  }
}
