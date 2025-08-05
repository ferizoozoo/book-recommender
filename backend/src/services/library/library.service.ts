import { IBookRepository } from "../common/interfaces/repositories/i-bookRepository.ts";
import { Book } from "../../domain/library/book.entity.ts";
import { ILibraryService } from "../../presentation/common/interfaces/services/i-libraryService.ts";
import { serviceConsts } from "../common/consts.ts";

export class LibraryService implements ILibraryService {
    #bookRepo: IBookRepository;

    constructor(bookRepo: IBookRepository) {
        this.#bookRepo = bookRepo;
    }

    async getAllBooks(): Promise<Book[]> {
        return await this.#bookRepo.getAll();
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

    async addBook(book: Book): Promise<void> {
        if (!book.title || !book.isbn) {
            throw new Error("Book title and ISBN are required");
        }

        const existingBook = await this.#bookRepo.getByIsbn(book.isbn);
        if (existingBook) {
            throw new Error("A book with this ISBN already exists");
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

    async searchBooks(query: string): Promise<Book[]> {
        if (!query) {
            throw new Error("Search query is required");
        }
        return await this.#bookRepo.search(query);
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
            book.labels = book.labels.filter(l => l !== label);
            await this.#bookRepo.update(book);
        }
    }

    async getBooksByLabel(label: string): Promise<Book[]> {
        if (!label) {
            throw new Error("Label is required");
        }

        const allBooks = await this.#bookRepo.getAll();
        return allBooks.filter(book => book.labels && book.labels.includes(label));
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
}
