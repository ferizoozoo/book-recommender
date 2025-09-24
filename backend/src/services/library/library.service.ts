import { IBookRepository } from "../common/interfaces/repositories/i-bookRepository";
import { IAuthorRepository } from "../common/interfaces/repositories/i-authorRepository";
import { IPublisherRepository } from "../common/interfaces/repositories/i-publisherRepository";
import { Book } from "../../domain/library/book.entity";
import { Author } from "../../domain/library/author.entity";
import { Publisher } from "../../domain/library/publisher.entity";
import { ILibraryService } from "../../presentation/common/interfaces/services/i-libraryService";
import { serviceConsts } from "../common/consts";
import { IUserRepository } from "../common/interfaces/repositories/i-userRepository";
import { Review } from "../../domain/library/review.entity";
import { IReviewRepository } from "../common/interfaces/repositories/i-reviewRepository";

export class LibraryService implements ILibraryService {
  #bookRepo: IBookRepository;
  #authorRepo: IAuthorRepository;
  #publisherRepo: IPublisherRepository;
  #userRepo: IUserRepository; // TODO: here the user repository from the auth context is used, it should be used in the related orchestrator
  #reviewRepo: IReviewRepository;

  constructor(
    bookRepo: IBookRepository,
    authorRepo: IAuthorRepository,
    publisherRepo: IPublisherRepository,
    userRepo: IUserRepository,
    reviewRepo: IReviewRepository
  ) {
    this.#bookRepo = bookRepo;
    this.#authorRepo = authorRepo;
    this.#publisherRepo = publisherRepo;
    this.#userRepo = userRepo;
    this.#reviewRepo = reviewRepo;
  }
  async updateAuthor(author: Author): Promise<void> {
    if (!author.id) {
      throw new Error("Author ID is required for updates");
    }

    if (!author.validate()) {
      throw new Error(serviceConsts.AuthorValidationFailed);
    }

    const existingAuthor = await this.#authorRepo.getById(author.id);
    if (!existingAuthor) {
      throw new Error(serviceConsts.AuthorNotFound);
    }

    await this.#authorRepo.update(author);
  }

  async updatePublisher(publisher: Publisher): Promise<void> {
    if (!publisher.id) {
      throw new Error("Publisher ID is required for updates");
    }

    if (!publisher.validate()) {
      throw new Error(serviceConsts.PublisherValidationFailed);
    }

    const existingPublisher = await this.#publisherRepo.getById(publisher.id);
    if (!existingPublisher) {
      throw new Error(serviceConsts.PublisherNotFound);
    }

    await this.#publisherRepo.update(publisher);
  }

  async getFilteredBooks(filters: any): Promise<Book[]> {
    return await this.#bookRepo.filter(filters);
  }

  async getReadersReviewBooks(bookId: number): Promise<Review[]> {
    const bookReviews = await this.#reviewRepo.getBookReviews(bookId);
    return bookReviews!;
  }

  async getAllBooks(): Promise<Book[]> {
    return await this.#bookRepo.getAll();
  }

  async getAllPublishers(): Promise<Publisher[]> {
    return await this.#publisherRepo.getAll();
  }

  async getAllAuthors(): Promise<Author[]> {
    return await this.#authorRepo.getAll();
  }
  async getBookById(id: number): Promise<Book | null> {
    return await this.#bookRepo.getById(id);
  }

  async getBookByIsbn(isbn: string): Promise<Book | null> {
    if (!isbn) {
      throw new Error("ISBN is required");
    }
    return await this.#bookRepo.getByIsbn(isbn);
  }

  async getTrendingBooks(limit: number): Promise<Book[]> {
    return await this.#bookRepo.getTrendingBooks(limit);
  }

  async addAuthor(author: Author): Promise<Author> {
    if (!author.validate()) {
      throw new Error(serviceConsts.AuthorValidationFailed);
    }

    await this.#authorRepo.save(author);
    // After save, we need to find the latest author since we don't know the new ID
    const authors = await this.#authorRepo.getAll();
    const savedAuthor = authors[authors.length - 1];
    if (!savedAuthor) {
      throw new Error(serviceConsts.AuthorNotFound);
    }
    return savedAuthor;
  }

  async getAuthorById(authorId: number): Promise<Author | null> {
    if (authorId < 0) {
      throw new Error(serviceConsts.AuthorIdNonNegative);
    }
    return await this.#authorRepo.getById(authorId);
  }

  async addPublisher(publisher: Publisher): Promise<Publisher> {
    if (!publisher.validate()) {
      throw new Error(serviceConsts.PublisherValidationFailed);
    }

    await this.#publisherRepo.save(publisher);
    // After save, we need to find the latest publisher since we don't know the new ID
    const publishers = await this.#publisherRepo.getAll();
    const savedPublisher = publishers[publishers.length - 1];
    if (!savedPublisher) {
      throw new Error(serviceConsts.PublisherNotFound);
    }
    return savedPublisher;
  }

  async getPublisherById(publisherId: number): Promise<Publisher | null> {
    if (publisherId < 0) {
      throw new Error(serviceConsts.PublisherIdNonNegative);
    }
    return await this.#publisherRepo.getById(publisherId);
  }

  async addBook(book: Book): Promise<void> {
    if (!book.validate()) {
      throw new Error(serviceConsts.BookValidationFailed);
    }

    const existingBook = await this.#bookRepo.getByIsbn(book.isbn);
    if (existingBook) {
      throw new Error(serviceConsts.BookAlreadyExists);
    }

    await this.#bookRepo.save(book);
  }

  async updateBook(book: Book): Promise<void> {
    if (!book.id) {
      throw new Error("Book ID is required for updates");
    }

    const existingBook = await this.#bookRepo.getById(book.id);
    if (!existingBook) {
      throw new Error("Book not found");
    }

    await this.#bookRepo.update(book);
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

  async getBooksByLabel(label: string): Promise<Book[]> {
    if (!label) {
      throw new Error("Label is required");
    }

    const allBooks = await this.#bookRepo.getAll();
    return allBooks.filter(
      (book) => book.labels && book.labels.includes(label)
    );
  }

  async orderBook(bookId: number, userId: string): Promise<void> {
    const book = await this.#bookRepo.getById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    if (!book.available || book.quantity < 1) {
      throw new Error("Book is not available for ordering");
    }

    // Update book quantity and availability
    book.quantity--;
    book.available = book.quantity > 0;
    await this.#bookRepo.update(book);

    // In a real implementation, you would save the order to an order repository
    // For now, we're just updating the book quantity
  }

  async returnBook(bookId: number): Promise<void> {
    const book = await this.#bookRepo.getById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Update book quantity and availability
    book.quantity++;
    book.available = true;
    await this.#bookRepo.update(book);

    // In a real implementation, you would update the order status
  }

  // TODO: maybe we should use a separate service for user-related operations
  // to avoid tight coupling between library and user services.
  async likeBook(userId: number, bookId: number): Promise<void> {
    const book = await this.#bookRepo.getById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    const user = await this.#userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await this.#bookRepo.likeBook(user, book);
  }
}
