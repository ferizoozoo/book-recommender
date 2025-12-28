import { Book } from "../../../../domain/library/book.entity";
import { Author } from "../../../../domain/library/author.entity";
import { Publisher } from "../../../../domain/library/publisher.entity";
import { Review } from "../../../../domain/library/review.entity";
import {
  AuthorDto,
  BookDto,
  BookUpdateDto,
  PublisherDto,
  ReviewDto,
} from "../../../../services/dtos/library.dtos";

// TODO: maybe return also dtos instead of domain entities
export interface ILibraryService {
  getAuthorById(authorId: number): Promise<AuthorDto | null>;
  addPublisher(publisher: PublisherDto): Promise<PublisherDto>;
  getPublisherById(publisherId: number): Promise<PublisherDto | null>;
  getAllBooks(): Promise<BookDto[]>;
  getAllAuthors(): Promise<AuthorDto[]>;
  getAllPublishers(): Promise<PublisherDto[]>;
  getBookById(id: number): Promise<BookDto | null>;
  getBookByIsbn(isbn: string): Promise<BookDto | null>;
  getReadersReviewBooks(bookId: number): Promise<ReviewDto[]>;
  getUserReviewForBook(
    bookId: number,
    userId: number
  ): Promise<ReviewDto | null>;
  getTrendingBooks(limit: number): Promise<BookDto[]>;
  getFilteredBooks(filters: any): Promise<BookDto[]>;
  addBook(book: BookDto): Promise<void>;
  updateBook(book: BookUpdateDto): Promise<void>;
  updateAuthor(author: AuthorDto): Promise<void>;
  updatePublisher(publisher: PublisherDto): Promise<void>;
  deleteBook(id: number): Promise<void>;
  addLabelToBook(bookId: number, label: string): Promise<void>;
  removeLabelFromBook(bookId: number, label: string): Promise<void>;
  getBooksByLabel(label: string): Promise<BookDto[]>;
}
