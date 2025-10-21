import { Author } from "../../domain/library/author.entity";
import { Book } from "../../domain/library/book.entity";
import { ILibraryAuthService } from "../../presentation/common/interfaces/services/i-library-authService";
import { serviceConsts } from "../common/consts";
import { IAuthorRepository } from "../common/interfaces/repositories/i-authorRepository";
import { IBookRepository } from "../common/interfaces/repositories/i-bookRepository";
import { IUserRepository } from "../common/interfaces/repositories/i-userRepository";
import { AuthorDto } from "../dtos/library.dtos";

export class LibraryAuthService implements ILibraryAuthService {
  #userRepo: IUserRepository;
  #bookRepo: IBookRepository;
  #authorRepo: IAuthorRepository;

  constructor(
    userRepo: IUserRepository,
    bookRepo: IBookRepository,
    authorRepo: IAuthorRepository
  ) {
    this.#userRepo = userRepo;
    this.#bookRepo = bookRepo;
    this.#authorRepo = authorRepo;
  }

  async getAllForUser(email: string): Promise<Book[]> {
    const user = await this.#userRepo.getByEmail(email);
    if (!user || !user.id) {
      throw new Error("User not found");
    }

    return await this.#bookRepo.getAllForUser(user.id);
  }

  async addAuthor(authorData: AuthorDto, userClaims: any): Promise<Author> {
    const author = new Author(
      0,
      authorData.bio,
      authorData.image,
      [], // Books will be populated separately if needed
      undefined // User will be populated separately if needed
    );

    if (!author.validate()) {
      throw new Error(serviceConsts.AuthorValidationFailed);
    }

    const user = await this.#userRepo.getByEmail(userClaims?.email || "");
    if (!user) {
      throw new Error(serviceConsts.LibraryAuthorNotFound);
    }

    author.user = user;

    await this.#authorRepo.save(author);

    const authors = await this.#authorRepo.getAll();
    const savedAuthor = authors[authors.length - 1];
    if (!savedAuthor) {
      throw new Error(serviceConsts.AuthorNotFound);
    }
    return savedAuthor;
  }

  async likeBook(userId: number, bookId: number): Promise<void> {
    const book = await this.#bookRepo.getById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    const user = await this.#userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await this.#bookRepo.likeBook(user, book);
  }
}
