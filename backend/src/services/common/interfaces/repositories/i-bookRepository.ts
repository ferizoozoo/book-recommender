import { User } from "../../../../domain/auth/user.entity.ts";
import { Book } from "../../../../domain/library/book.entity.ts";

export interface IBookRepository {
  getById(id: number): Promise<Book | null>;
  getAll(): Promise<Book[]>;
  getAllForUser(userId: number): Promise<Book[]>;
  getByAuthorId(authorId: number): Promise<Book[]>;
  getByPublisherId(publisherId: number): Promise<Book[]>;
  getByIsbn(isbn: string): Promise<Book | null>;
  getTrendingBooks(limit: number): Promise<Book[]>;
  save(book: Book): Promise<void>;
  delete(id: number): Promise<void>;
  update(book: Book): Promise<void>;
  search(query: string): Promise<Book[]>;
  likeBook(user: User, book: Book): Promise<void>;
}
