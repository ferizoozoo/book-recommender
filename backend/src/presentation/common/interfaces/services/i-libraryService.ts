import { Book } from "../../../../domain/library/book.entity";
import { Author } from "../../../../domain/library/author.entity";
import { Publisher } from "../../../../domain/library/publisher.entity";
import { Review } from "../../../../domain/library/review.entity";
import {
  AuthorDto,
  BookDto,
  PublisherDto,
} from "../../../../services/dtos/library.dtos";

// TODO: maybe return also dtos instead of domain entities
export interface ILibraryService {
  getAuthorById(authorId: number): Promise<Author | null>;
  addPublisher(publisher: PublisherDto): Promise<Publisher>;
  getPublisherById(publisherId: number): Promise<Publisher | null>;
  getAllBooks(): Promise<Book[]>;
  getAllAuthors(): Promise<Author[]>;
  getAllPublishers(): Promise<Publisher[]>;
  getBookById(id: number): Promise<Book | null>;
  getBookByIsbn(isbn: string): Promise<Book | null>;
  getReadersReviewBooks(bookId: number): Promise<Review[]>;
  getTrendingBooks(limit: number): Promise<Book[]>;
  getFilteredBooks(filters: any): Promise<Book[]>;
  addBook(book: BookDto): Promise<void>;
  updateBook(book: BookDto): Promise<void>;
  updateAuthor(author: AuthorDto): Promise<void>;
  updatePublisher(publisher: PublisherDto): Promise<void>;
  deleteBook(id: number): Promise<void>;
  addLabelToBook(bookId: number, label: string): Promise<void>;
  removeLabelFromBook(bookId: number, label: string): Promise<void>;
  getBooksByLabel(label: string): Promise<Book[]>;
}
