import { Request, Response, NextFunction } from "express";
import { ILibraryService } from "../common/interfaces/services/i-libraryService";
import { presentationConsts } from "../common/consts";
import { Book } from "../../domain/library/book.entity";
import { Author } from "../../domain/library/author.entity";
import { Publisher } from "../../domain/library/publisher.entity";
import { User } from "../../domain/auth/user.entity";
import { ILibraryAuthService } from "../common/interfaces/services/i-library-authService";
import {
  AuthGuard,
  AuthenticatedRequest,
} from "../common/decorators/auth.decorator";
import { UserClaims } from "../../domain/auth/user-claims.value";
import { authController, userRepository } from "../di/setup";
import { mapAuthorDomainToModel } from "../../infrastructure/database/typeorm/models/mappers/library.mapper";
import { mapUserDomainToModel } from "../../infrastructure/database/typeorm/models/mappers/auth.mapper";

// TODO: each controller should have its own DTO, for better validation and type safety

// TODO: this controller methods have a lot of code that should be done at the
//        service/application layer. A refactor is needed to move this logic
//        into the appropriate layer.
export class LibraryController {
  #libraryService: ILibraryService;
  #libraryAuthService: ILibraryAuthService;

  constructor(
    libraryService: ILibraryService,
    libraryAuthService: ILibraryAuthService
  ) {
    this.#libraryService = libraryService;
    this.#libraryAuthService = libraryAuthService;
  }

  @AuthGuard(["admin"])
  async addAuthor(
    req: AuthenticatedRequest,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { bio } = req.body;
      if (!bio) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryAuthorNameRequired });
        return;
      }

      // Access the authenticated user's claims
      const userClaims = req.user;
      console.log("User adding author:", userClaims?.email, userClaims?.roles);

      // TODO: DISASTER, this code belongs to the service layer
      //       we should not be creating entities in the controller
      //       also, we should not be using the User entity here at all
      const user = await userRepository.getUserByEmail(userClaims?.email || "");
      if (!user) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryAuthorNotFound });
        return;
      }
      const author = new Author(0, bio, "", [], user);
      const savedAuthor = await this.#libraryService.addAuthor(author);
      res.status(201).json({ author: savedAuthor });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add author";
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
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

  @AuthGuard(["admin"])
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

  @AuthGuard(["admin"])
  async getAllAuthors(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const authors = await this.#libraryService.getAllAuthors();
      res.status(200).json({ authors });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve authors";
      res.status(500).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
  async getAllPublishers(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const publishers = await this.#libraryService.getAllPublishers();
      res.status(200).json({ publishers });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve publishers";
      res.status(500).json({ message: errorMessage });
    }
  }

  @AuthGuard(["user", "admin"])
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

  @AuthGuard(["user", "admin"])
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

  async getTrendingBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const books = await this.#libraryService.getTrendingBooks(limit);
      res.status(200).json({ books });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve trending books";
      res.status(500).json({ message: errorMessage });
    }
  }

  @AuthGuard(["user", "admin"])
  async getReadersReviewBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { book } = req.params;
      const bookId = parseInt(book);
      const reviews = await this.#libraryService.getReadersReviewBooks(bookId);
      res.status(200).json({ reviews });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve reviews";
      res.status(500).json({ message: errorMessage });
    }
  }

  @AuthGuard(["user", "admin"])
  async getFilteredBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { year, author, title } = req.body;

      const filters: any = {};
      if (year) filters.year = year;
      if (author) filters.author = author;
      if (title) filters.title = title;

      const books = await this.#libraryService.getFilteredBooks(filters);
      res.status(200).json({ books });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve filtered books";
      res.status(500).json({ message: errorMessage });
    }
  }

  // TODO: for now, we are using the Book entity directly in the controller.
  //       In a real application, we might want to use a DTO (Data Transfer Object)
  //       to avoid exposing domain entities directly.
  @AuthGuard(["admin"])
  async addBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const {
        title,
        authorId,
        publisherId,
        isbn,
        quantity,
        publishedDate,
        description,
      } = req.body;

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
        description || "",
        isbn || "",
        publisher,
        new Date().getFullYear(), // default to current year
        "", // image
        0, // rating
        0, // numberOfRatings
        0 // numberOfReviews
      );

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

  @AuthGuard(["admin"])
  async updateAuthor(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const authorId = parseInt(req.params.id);
      if (isNaN(authorId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidAuthorId });
        return;
      }

      const existingAuthor = await this.#libraryService.getAuthorById(authorId);
      if (!existingAuthor) {
        res
          .status(404)
          .json({ message: presentationConsts.LibraryAuthorNotFound });
        return;
      }

      const { bio, image } = req.body;

      // TODO: this seems sketchy, we should not be creating a new Author instance
      const updatedAuthor = new Author(
        existingAuthor.id,
        bio || existingAuthor.bio,
        image || existingAuthor.image
      );

      console.log("Updated Author:", updatedAuthor);

      await this.#libraryService.updateAuthor(updatedAuthor);
      res
        .status(200)
        .json({ message: presentationConsts.LibraryAuthorUpdated });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update author";
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
  async updatePublisher(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const publisherId = parseInt(req.params.id);
      if (isNaN(publisherId)) {
        res
          .status(400)
          .json({ message: presentationConsts.LibraryInvalidPublisherId });
        return;
      }

      const existingPublisher = await this.#libraryService.getPublisherById(
        publisherId
      );
      if (!existingPublisher) {
        res
          .status(404)
          .json({ message: presentationConsts.LibraryPublisherNotFound });
        return;
      }

      const { name, address, city, state, zip, country } = req.body;

      // TODO: this seems sketchy, we should not be creating a new Publisher instance
      const updatedPublisher = new Publisher(
        existingPublisher.id,
        name || existingPublisher.name,
        address || existingPublisher.address,
        city || existingPublisher.city,
        state || existingPublisher.state,
        zip || existingPublisher.zip,
        country || existingPublisher.country,
        existingPublisher.books
      );

      await this.#libraryService.updatePublisher(updatedPublisher);
      res
        .status(200)
        .json({ message: presentationConsts.LibraryPublisherUpdated });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update publisher";
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
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

      const {
        title,
        author,
        description,
        isbn,
        publisher,
        year,
        image,
        quantity,
      } = req.body;

      // TODO: this seems sketchy, we should not be creating a new Book instance
      const updatedBook = new Book(
        existingBook.id,
        title || existingBook.title,
        author instanceof Author
          ? author
          : existingBook.author || new Author(0, ""),
        description || existingBook.description,
        isbn || existingBook.isbn,
        publisher || existingBook.publisher,
        year || existingBook.year,
        image || existingBook.image,
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

  @AuthGuard(["admin"])
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

  @AuthGuard(["admin"])
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

  @AuthGuard(["admin"])
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

  @AuthGuard(["user", "admin"])
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

  @AuthGuard(["user", "admin"])
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

  @AuthGuard(["user", "admin"])
  async getAllBooksForUser(
    req: AuthenticatedRequest,
    res: Response,
    nextFunction: NextFunction
  ): Promise<Book[]> {
    try {
      const books = await this.#libraryAuthService.getAllForUser(
        req.user!.email
      );
      res.status(200).json({ books });
      return books;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve books";
      res.status(500).json({ message: errorMessage });
      return [];
    }
  }
}
