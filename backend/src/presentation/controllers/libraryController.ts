import { Request, Response, NextFunction } from "express";
import { ILibraryService } from "../common/interfaces/services/i-libraryService";
import { presentationConsts } from "../common/consts";
import { ILibraryAuthService } from "../common/interfaces/services/i-library-authService";
import {
  AuthorDto,
  BookDto,
  PublisherDto,
} from "../../services/dtos/library.dtos";
import {
  AuthGuard,
  AuthenticatedRequest,
} from "../common/decorators/auth.decorator";

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
    const { bio } = req.body;
    if (!bio) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryAuthorNameRequired });
      return;
    }

    const authorData = { bio, image: req.body.image || "" };
    const userClaims = req.user;

    const savedAuthor = await this.#libraryAuthService.addAuthor(
      authorData,
      userClaims
    );
    res.status(201).json({ author: savedAuthor });
  }

  @AuthGuard(["admin"])
  async addPublisher(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { name, address, city, state, zip, country } = req.body;
    if (!name || !address || !city || !state || !zip || !country) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryPublisherNotFound });
      return;
    }

    const publisher = { id: 0, name, address, city, state, zip, country };
    const savedPublisher = await this.#libraryService.addPublisher(publisher);
    res.status(201).json({ publisher: savedPublisher });
  }

  @AuthGuard(["admin"])
  async getAllBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const books = await this.#libraryService.getAllBooks();
    res.status(200).json({ books });
  }

  @AuthGuard(["admin"])
  async getAllAuthors(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const authors = await this.#libraryService.getAllAuthors();
    res.status(200).json({ authors });
  }

  @AuthGuard(["admin"])
  async getAllPublishers(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const publishers = await this.#libraryService.getAllPublishers();
    res.status(200).json({ publishers });
  }

  @AuthGuard(["user", "admin"])
  async getBookById(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryInvalidBookId });
      return;
    }

    const book = await this.#libraryService.getBookById(bookId);
    if (!book) {
      res.status(404).json({ message: presentationConsts.LibraryBookNotFound });
      return;
    }

    res.status(200).json({ book });
  }

  @AuthGuard(["user", "admin"])
  async getBookByIsbn(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { isbn } = req.params;
    if (!isbn) {
      res.status(400).json({ message: presentationConsts.LibraryIsbnRequired });
      return;
    }

    const book = await this.#libraryService.getBookByIsbn(isbn);
    if (!book) {
      res.status(404).json({ message: presentationConsts.LibraryBookNotFound });
      return;
    }

    res.status(200).json({ book });
  }

  async getTrendingBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 10;
    const books = await this.#libraryService.getTrendingBooks(limit);
    res.status(200).json({ books });
  }

  @AuthGuard(["user", "admin"])
  async getReadersReviewBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { book } = req.params;
    const bookId = parseInt(book);
    const reviews = await this.#libraryService.getReadersReviewBooks(bookId);
    res.status(200).json({ reviews });
  }

  @AuthGuard(["user", "admin"])
  async getUserReviewForBook(
    req: AuthenticatedRequest,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const bookId = parseInt(req.params.bookId);
    if (isNaN(bookId)) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryInvalidBookId });
      return;
    }

    if (!req.user) {
      res
        .status(401)
        .json({ message: presentationConsts.LibraryUserIdRequired });
      return;
    }

    const userReview = await this.#libraryService.getUserReviewForBook(
      bookId,
      req.user.userId
    );

    res.status(200).json({ review: userReview });
  }

  @AuthGuard(["user", "admin"])
  async getFilteredBooks(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { year, author, title } = req.body;

    const filters: any = {};
    if (year) filters.year = year;
    if (author) filters.author = author;
    if (title) filters.title = title;

    const books = await this.#libraryService.getFilteredBooks(filters);
    res.status(200).json({ books });
  }

  @AuthGuard(["admin"])
  async addBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
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

    const book = {
      title,
      authorId,
      publisherId,
      author: {} as AuthorDto,
      publisher: {} as PublisherDto,
      isbn,
      quantity,
      publishedDate,
      description,
      labels: [],
    };

    await this.#libraryService.addBook(book);
    res
      .status(201)
      .json({ message: presentationConsts.LibraryBookAdded, isbn });
  }

  @AuthGuard(["admin"])
  async updateAuthor(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const authorId = parseInt(req.params.id);
    const { id, bio, image } = req.body;

    if (isNaN(authorId)) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryInvalidAuthorId });
      return;
    }

    const updatedAuthor = {
      id: id,
      bio: bio,
      image: image,
    };

    await this.#libraryService.updateAuthor(updatedAuthor);
    res.status(200).json({ message: presentationConsts.LibraryAuthorUpdated });
  }

  @AuthGuard(["admin"])
  async updatePublisher(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const publisherId = parseInt(req.params.id);
    const { name, address, city, state, zip, country } = req.body;

    if (isNaN(publisherId)) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryInvalidPublisherId });
      return;
    }

    const updatedPublisher = {
      name,
      address,
      city,
      state,
      zip,
      country,
    };

    await this.#libraryService.updatePublisher(updatedPublisher);
    res
      .status(200)
      .json({ message: presentationConsts.LibraryPublisherUpdated });
  }

  @AuthGuard(["admin"])
  async updateBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryInvalidBookId });
      return;
    }

    const {
      title,
      description,
      isbn,
      year,
      image,
      quantity,
      publishedDate,
      authorId,
      publisherId,
    } = req.body;

    const updatedBook = {
      id: bookId,
      title: title,
      authorId: authorId,
      author: null,
      publisher: null,
      description: description,
      isbn: isbn,
      publisherId: publisherId,
      publishedDate,
      year: year,
      image: image,
      quantity,
      labels: [],
    };

    await this.#libraryService.updateBook(updatedBook);
    res.status(200).json({ message: presentationConsts.LibraryBookUpdated });
  }

  @AuthGuard(["admin"])
  async deleteBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryInvalidBookId });
      return;
    }

    await this.#libraryService.deleteBook(bookId);
    res.status(200).json({ message: presentationConsts.LibraryBookDeleted });
  }

  @AuthGuard(["admin"])
  async addLabelToBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
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
  }

  @AuthGuard(["admin"])
  async removeLabelFromBook(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
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
  }

  @AuthGuard(["user", "admin"])
  async getBooksByLabel(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { label } = req.query;
    if (!label || typeof label !== "string") {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryLabelRequired });
      return;
    }

    const books = await this.#libraryService.getBooksByLabel(label);
    res.status(200).json({ books });
  }

  @AuthGuard(["user", "admin"])
  async getAllBooksForUser(
    req: AuthenticatedRequest,
    res: Response,
    nextFunction: NextFunction
  ): Promise<BookDto[]> {
    const books = await this.#libraryAuthService.getAllForUser(req.user!.email);
    res.status(200).json({ books });
    return books;
  }

  @AuthGuard(["user", "admin"])
  async addReviews(
    req: AuthenticatedRequest,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const bookId = parseInt(req.params.bookId);
    if (isNaN(bookId)) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryInvalidBookId });
      return;
    }

    const userId = req.user?.userId;

    const { rating, review } = req.body;
    if (!userId) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryUserIdRequired });
      return;
    }

    await this.#libraryAuthService.addReview(bookId, rating, review, userId);
    res
      .status(200)
      .json({ message: presentationConsts.LibraryReviewAddedSuccessfully });
  }

  @AuthGuard(["user", "admin"])
  async likeToggle(
    req: AuthenticatedRequest,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const userId = req.user?.userId;

    const bookId = parseInt(req.body.bookId);

    if (!userId) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryUserIdRequired });
      return;
    }

    await this.#libraryAuthService.likeToggle(userId, bookId);
    res
      .status(200)
      .json({ message: presentationConsts.LibraryLikedOrDislikedSuccessfully });
  }

  @AuthGuard(["user", "admin"])
  async getUserLikedBooks(
    req: AuthenticatedRequest,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(400)
        .json({ message: presentationConsts.LibraryUserIdRequired });
      return;
    }

    const likedBookIds = await this.#libraryAuthService.getUserLikedBooks(
      userId
    );
    res.status(200).json({ likedBookIds });
  }
}
