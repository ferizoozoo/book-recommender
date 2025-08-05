import { Book } from "../../../../domain/library/book.entity.ts";

export interface ILibraryService {
    getAllBooks(): Promise<Book[]>;
    getBookById(id: number): Promise<Book | null>;
    getBookByIsbn(isbn: string): Promise<Book | null>;
    addBook(book: Book): Promise<void>;
    updateBook(book: Book): Promise<void>;
    deleteBook(id: number): Promise<void>;
    searchBooks(query: string): Promise<Book[]>;
    addLabelToBook(bookId: number, label: string): Promise<void>;
    removeLabelFromBook(bookId: number, label: string): Promise<void>;
    getBooksByLabel(label: string): Promise<Book[]>;
    orderBook(bookId: number, userId: string): Promise<void>;
    returnBook(bookId: number): Promise<void>;
}
