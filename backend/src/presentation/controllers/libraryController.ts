import { Request, Response, NextFunction } from "express";
import { ILibraryService } from "../common/interfaces/services/i-libraryService";
import { presentationConsts } from "../common/consts";
import { Book } from "../../domain/library/book.entity";
import { Author } from "../../domain/library/author.entity";
import { Publisher } from "../../domain/library/publisher.entity";
import { User } from "../../domain/auth/user.entity";

// TODO: this controller methods have a lot of code that should be done at the
//        service/application layer. A refactor is needed to move this logic
//        into the appropriate layer.
export class LibraryController {
  #libraryService: ILibraryService;

  constructor(libraryService: ILibraryService) {
    this.#libraryService = libraryService;
  }

  async addAuthor(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { id, bio, image } = req.body;
      if (!id || !bio || !image) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryAuthorNameRequired });
        return;
      }

      const author = new Author(id, bio, image, [], new User());
      const savedAuthor = await this.#libraryService.addAuthor(author);
      res.status(201).json({ author: savedAuthor });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add author";
      res.status(400).json({ message: errorMessage });
    }
  }

  async addPublisher(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { id, name, address } = req.body;
      if (!id || !name || !address) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryPublisherNotFound });
        return;
      }

      const publisher = new Publisher(id, name, address);
      const savedPublisher = await this.#libraryService.addPublisher(publisher);
      res.status(201).json({ publisher: savedPublisher });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add publisher";
      res.status(400).json({ message: errorMessage });
    }
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

  // TODO: for now, we are using the Book entity directly in the controller.
  //       In a real application, we might want to use a DTO (Data Transfer Object)
  //       to avoid exposing domain entities directly.
  async addBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { title, authorId, publisherId, isbn, quantity } = req.body;

      if (!title || !authorId || !publisherId || !isbn) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryBookDetailsRequired });
        return;
      }
      const author = await this.#libraryService.getAuthorById(authorId);
      if (!author) {
        res
          .status(404)
          .json({ message: presentationConsts.LibraryAuthorNotFound });
        return;
      }

      const publisher = await this.#libraryService.getPublisherById(
        publisherId
      );
      if (!publisher) {
        res
          .status(404)
          .json({ message: presentationConsts.LibraryPublisherNotFound });
        return;
      }

      const book = new Book(
        0, // ID will be set by the database
        title || "",
        author,
        "", // description
        isbn || "",
        publisher,
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
      res
        .status(201)
        .json({ message: presentationConsts.LibraryBookAdded, isbn });
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
      res.status(200).json({ message: presentationConsts.LibraryBookUpdated });
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
      res.status(200).json({ message: presentationConsts.LibraryBookDeleted });
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
        res
          .status(400)
          .json({ message: presentationConsts.LibraryBookDetailsRequired });
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
      res.status(200).json({ message: presentationConsts.LibraryLabelAdded });
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
      res.status(200).json({ message: presentationConsts.LibraryLabelRemoved });
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
        res
          .status(400)
          .json({ message: presentationConsts.LibraryUserIdRequired });
        return;
      }

      await this.#libraryService.orderBook(bookId, userId);
      res.status(200).json({ message: presentationConsts.LibraryBookOrdered });
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
      res.status(200).json({ message: presentationConsts.LibraryBookReturned });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to return book";
      res.status(400).json({ message: errorMessage });
    }
  }

  async likeBook(
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

      const { userId } = req.body;
      if (!userId) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryUserIdRequired });
        return;
      }

      await this.#libraryService.likeBook(bookId, userId);
      res.status(200).json({ message: presentationConsts.LibraryBookLiked });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to like book";
      res.status(400).json({ message: errorMessage });
    }
  }
}
