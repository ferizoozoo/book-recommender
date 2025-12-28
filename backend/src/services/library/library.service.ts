import { IBookRepository } from "../common/interfaces/repositories/i-bookRepository";
import { IAuthorRepository } from "../common/interfaces/repositories/i-authorRepository";
import { IPublisherRepository } from "../common/interfaces/repositories/i-publisherRepository";
import { Book } from "../../domain/library/book.entity";
import { Author } from "../../domain/library/author.entity";
import { Publisher } from "../../domain/library/publisher.entity";
import { ILibraryService } from "../../presentation/common/interfaces/services/i-libraryService";
import { serviceConsts } from "../common/consts";
import { Review } from "../../domain/library/review.entity";
import { IReviewRepository } from "../common/interfaces/repositories/i-reviewRepository";
import { presentationConsts } from "../../presentation/common/consts";
import {
  AuthorDto,
  BookDto,
  BookUpdateDto,
  PublisherDto,
  ReviewDto,
} from "../dtos/library.dtos";
import {
  mapAuthorDomainsToDtos,
  mapAuthorDomainToDto,
  mapBookDomainsToDtos,
  mapBookDomainToDto,
  mapPublisherDomainsToDtos,
  mapPublisherDomainToDto,
  mapReviewDomainsToDtos,
  mapReviewDomainToDto,
} from "../dtos/mappers/library.mapper";

export class LibraryService implements ILibraryService {
  #bookRepo: IBookRepository;
  #authorRepo: IAuthorRepository;
  #publisherRepo: IPublisherRepository;
  #reviewRepo: IReviewRepository;

  constructor(
    bookRepo: IBookRepository,
    authorRepo: IAuthorRepository,
    publisherRepo: IPublisherRepository,
    reviewRepo: IReviewRepository
  ) {
    this.#bookRepo = bookRepo;
    this.#authorRepo = authorRepo;
    this.#publisherRepo = publisherRepo;
    this.#reviewRepo = reviewRepo;
  }
  async updateAuthor(author: AuthorDto): Promise<void> {
    if (!author.id) {
      throw new Error("Author ID is required for updates");
    }

    const existingAuthor = await this.#authorRepo.getById(author.id);
    if (!existingAuthor) {
      throw new Error(serviceConsts.AuthorNotFound);
    }

    existingAuthor.bio = author.bio;
    existingAuthor.image = author.image;

    existingAuthor.validate();

    await this.#authorRepo.update(existingAuthor);
  }

  async updatePublisher(publisher: PublisherDto): Promise<void> {
    if (!publisher.id) {
      throw new Error("Publisher ID is required for updates");
    }

    const existingPublisher = await this.#publisherRepo.getById(publisher.id);
    if (!existingPublisher) {
      throw new Error(serviceConsts.PublisherNotFound);
    }

    existingPublisher.name = publisher.name;
    existingPublisher.address = publisher.address;
    existingPublisher.validate();

    await this.#publisherRepo.update(existingPublisher);
  }

  async getFilteredBooks(filters: any): Promise<BookDto[]> {
    const books = await this.#bookRepo.filter(filters);
    const res = mapBookDomainsToDtos(books);
    return res;
  }

  async getReadersReviewBooks(bookId: number): Promise<ReviewDto[]> {
    const bookReviews = await this.#reviewRepo.getBookReviews(bookId);
    const res = mapReviewDomainsToDtos(bookReviews!);
    return res;
  }

  async getUserReviewForBook(
    bookId: number,
    userId: number
  ): Promise<ReviewDto | null> {
    const res = await this.#reviewRepo.getByBookAndUser(bookId, userId);
    return res ? mapReviewDomainToDto(res) : null;
  }

  async getAllBooks(): Promise<BookDto[]> {
    const res = await this.#bookRepo.getAll();
    return mapBookDomainsToDtos(res);
  }

  async getAllPublishers(): Promise<PublisherDto[]> {
    const res = await this.#publisherRepo.getAll();
    return mapPublisherDomainsToDtos(res);
  }

  async getAllAuthors(): Promise<AuthorDto[]> {
    const res = await this.#authorRepo.getAll();
    return mapAuthorDomainsToDtos(res);
  }

  async getBookById(id: number): Promise<BookDto | null> {
    const res = await this.#bookRepo.getById(id);
    return res ? mapBookDomainToDto(res) : null;
  }

  async getBookByIsbn(isbn: string): Promise<BookDto | null> {
    if (!isbn) {
      throw new Error("ISBN is required");
    }
    const res = await this.#bookRepo.getByIsbn(isbn);
    return res ? mapBookDomainToDto(res) : null;
  }

  async getTrendingBooks(limit: number): Promise<BookDto[]> {
    const res = await this.#bookRepo.getTrendingBooks(limit);
    return mapBookDomainsToDtos(res);
  }

  async getAuthorById(authorId: number): Promise<AuthorDto | null> {
    if (authorId < 0) {
      throw new Error(serviceConsts.AuthorIdNonNegative);
    }
    const author = await this.#authorRepo.getById(authorId);
    const authorsBooks = await this.#bookRepo.getByAuthorId(authorId);

    author!.books = authorsBooks;
    return mapAuthorDomainToDto(author!);
  }

  async addPublisher(publisherDto: PublisherDto): Promise<PublisherDto> {
    const publisher = new Publisher(
      0,
      publisherDto.name,
      publisherDto.address,
      publisherDto.city,
      publisherDto.state,
      publisherDto.zip,
      publisherDto.country
    );

    if (!publisher.validate()) {
      throw new Error(serviceConsts.PublisherValidationFailed);
    }

    await this.#publisherRepo.save(publisher);

    const publishers = await this.#publisherRepo.getAll();
    const savedPublisher = publishers[publishers.length - 1];
    if (!savedPublisher) {
      throw new Error(serviceConsts.PublisherNotFound);
    }
    return mapPublisherDomainToDto(savedPublisher);
  }

  async getPublisherById(publisherId: number): Promise<PublisherDto | null> {
    if (publisherId < 0) {
      throw new Error(serviceConsts.PublisherIdNonNegative);
    }
    const publisher = await this.#publisherRepo.getById(publisherId);
    return publisher ? mapPublisherDomainToDto(publisher) : null;
  }

  async addBook(bookDto: BookDto): Promise<void> {
    const author = await this.#authorRepo.getById(bookDto.authorId);
    if (!author) {
      throw new Error(presentationConsts.LibraryAuthorNotFound);
    }

    const publisher = await this.#publisherRepo.getById(bookDto.publisherId);
    if (!publisher) {
      throw new Error(presentationConsts.LibraryPublisherNotFound);
    }

    const book = new Book(
      0, // ID will be set by the database
      bookDto.title || "",
      author,
      bookDto.description || "",
      bookDto.isbn || "",
      publisher,
      new Date().getFullYear(), // default to current year
      "" // image
    );

    if (!book.validate()) {
      throw new Error(serviceConsts.BookValidationFailed);
    }

    const existingBook = await this.#bookRepo.getByIsbn(bookDto.isbn);
    if (existingBook) {
      throw new Error(serviceConsts.BookAlreadyExists);
    }

    await this.#bookRepo.save(book);
  }

  async updateBook(bookDto: BookUpdateDto): Promise<void> {
    if (!bookDto.id) {
      throw new Error("Book ID is required for updates");
    }

    const existingBook = await this.#bookRepo.getById(bookDto.id);
    if (!existingBook) {
      throw new Error("Book not found");
    }

    // Update fields
    existingBook.title = bookDto.title!;
    existingBook.isbn = bookDto.isbn!;
    existingBook.labels = bookDto.labels;

    await this.#bookRepo.update(existingBook);
  }

  async deleteBook(id: number): Promise<void> {
    const existingBook = await this.#bookRepo.getById(id);
    if (!existingBook) {
      throw new Error("Book not found");
    }

    await this.#bookRepo.delete(id);
  }

  async addLabelToBook(bookId: number, label: string): Promise<void> {
    if (!label) {
      throw new Error("Label is required");
    }

    const book = await this.#bookRepo.getById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    if (!book.labels) {
      book.labels = [];
    }

    if (!book.labels.includes(label)) {
      book.labels.push(label);
      await this.#bookRepo.update(book);
    }
  }

  async removeLabelFromBook(bookId: number, label: string): Promise<void> {
    const book = await this.#bookRepo.getById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    if (book.labels && book.labels.includes(label)) {
      book.labels = book.labels.filter((l) => l !== label);
      await this.#bookRepo.update(book);
    }
  }

  async getBooksByLabel(label: string): Promise<BookDto[]> {
    if (!label) {
      throw new Error("Label is required");
    }

    const allBooks = await this.#bookRepo.getAll();
    return mapBookDomainsToDtos(allBooks).filter((book) =>
      book.labels.includes(label)
    );
  }
}
