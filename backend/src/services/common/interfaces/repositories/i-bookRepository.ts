import { Book } from "../../../../domain/library/book.entity.ts";

export interface IBookRepository {
    getById(id: number): Promise<Book | null>;
    getAll(): Promise<Book[]>;
    getByAuthorId(authorId: number): Promise<Book[]>;
    getByPublisherId(publisherId: number): Promise<Book[]>;
    getByIsbn(isbn: string): Promise<Book | null>;
    save(book: Book): Promise<void>;
    delete(id: number): Promise<void>;
    update(book: Book): Promise<void>;
    search(query: string): Promise<Book[]>;
}
