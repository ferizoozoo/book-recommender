import { Request, Response, NextFunction } from "express";
import { ILibraryService } from "../common/interfaces/services/i-libraryService";
import { presentationConsts } from "../common/consts";
import { Book } from "../../domain/library/book.entity";
import { Author } from "../../domain/library/author.entity";
import { Publisher } from "../../domain/library/publisher.entity";

export class LibraryController {
  #libraryService: ILibraryService;

  constructor(libraryService: ILibraryService) {
    this.#libraryService = libraryService;
  }

  async getAllBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const books = await this.#libraryService.getAllBooks();
      res.status(200).json({ books });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve books";
      res.status(500).json({ message: errorMessage });
    }
  }

  async getBookById(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidBookId });
        return;
      }

      const book = await this.#libraryService.getBookById(bookId);
      if (!book) {
        res
          .status(404)
          .json({ message: presentationConsts.LibraryBookNotFound });
        return;
      }

      res.status(200).json({ book });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve book";
      res.status(500).json({ message: errorMessage });
    }
  }

  async getBookByIsbn(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { isbn } = req.params;
      if (!isbn) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryIsbnRequired });
        return;
      }

      const book = await this.#libraryService.getBookByIsbn(isbn);
      if (!book) {
        res
          .status(404)
          .json({ message: presentationConsts.LibraryBookNotFound });
        return;
      }

      res.status(200).json({ book });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve book";
      res.status(500).json({ message: errorMessage });
    }
  }

  async addBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { title, author, isbn, quantity } = req.body;

      if (!title || !author || !isbn) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryBookDetailsRequired });
        return;
      }

      const defaultAuthor =
        author instanceof Author ? author : new Author(0, String(author));
      const defaultPublisher =
        req.body.publisher instanceof Publisher
          ? req.body.publisher
          : new Publisher(0, "");

      const book = new Book(
        0, // ID will be set by the database
        title || "",
        defaultAuthor,
        "", // description
        isbn || "",
        defaultPublisher,
        new Date().getFullYear(), // default to current year
        "", // image
        0, // rating
        0, // numberOfRatings
        0 // numberOfReviews
      );

      book.quantity = quantity || 1;
      book.available = true;
      book.labels = [];

      await this.#libraryService.addBook(book);
      res.status(201).json({ message: "Book added successfully", isbn });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add book";
      res.status(400).json({ message: errorMessage });
    }
  }

  async updateBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidBookId });
        return;
      }

      const existingBook = await this.#libraryService.getBookById(bookId);
      if (!existingBook) {
        res
          .status(404)
          .json({ message: presentationConsts.LibraryBookNotFound });
        return;
      }

      const { title, author, quantity } = req.body;

      const updatedBook = new Book(
        existingBook.id,
        title || existingBook.title,
        author instanceof Author
          ? author
          : existingBook.author || new Author(0, ""),
        existingBook.description,
        existingBook.isbn,
        existingBook.publisher,
        existingBook.year,
        existingBook.image,
        existingBook.rating,
        existingBook.numberOfRatings,
        existingBook.numberOfReviews
      );

      if (quantity !== undefined) {
        updatedBook.quantity = quantity;
        updatedBook.available = quantity > 0;
      } else {
        updatedBook.quantity = existingBook.quantity;
        updatedBook.available = existingBook.available;
      }

      updatedBook.labels = existingBook.labels;

      await this.#libraryService.updateBook(updatedBook);
      res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update book";
      res.status(400).json({ message: errorMessage });
    }
  }

  async deleteBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidBookId });
        return;
      }

      await this.#libraryService.deleteBook(bookId);
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete book";
      res.status(400).json({ message: errorMessage });
    }
  }

  async searchBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const books = await this.#libraryService.searchBooks(query);
      res.status(200).json({ books });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to search books";
      res.status(500).json({ message: errorMessage });
    }
  }

  async addLabelToBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidBookId });
        return;
      }

      const { label } = req.body;
      if (!label) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryLabelRequired });
        return;
      }

      await this.#libraryService.addLabelToBook(bookId, label);
      res.status(200).json({ message: "Label added successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add label";
      res.status(400).json({ message: errorMessage });
    }
  }

  async removeLabelFromBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidBookId });
        return;
      }

      const { label } = req.body;
      if (!label) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryLabelRequired });
        return;
      }

      await this.#libraryService.removeLabelFromBook(bookId, label);
      res.status(200).json({ message: "Label removed successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove label";
      res.status(400).json({ message: errorMessage });
    }
  }

  async getBooksByLabel(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { label } = req.query;
      if (!label || typeof label !== "string") {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryLabelRequired });
        return;
      }

      const books = await this.#libraryService.getBooksByLabel(label);
      res.status(200).json({ books });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve books by label";
      res.status(500).json({ message: errorMessage });
    }
  }

  async orderBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidBookId });
        return;
      }

      // In a real app, userId would come from authenticated user session
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      await this.#libraryService.orderBook(bookId, userId);
      res.status(200).json({ message: "Book ordered successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to order book";
      res.status(400).json({ message: errorMessage });
    }
  }

  async returnBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidBookId });
        return;
      }

      await this.#libraryService.returnBook(bookId);
      res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to return book";
      res.status(400).json({ message: errorMessage });
    }
  }
}
