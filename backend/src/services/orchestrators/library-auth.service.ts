import { Book } from "../../domain/library/book.entity";
import { ILibraryAuthService } from "../../presentation/common/interfaces/services/i-library-authService";
import { IBookRepository } from "../common/interfaces/repositories/i-bookRepository";
import { IUserRepository } from "../common/interfaces/repositories/i-userRepository";

export class LibraryAuthService implements ILibraryAuthService {
  #userRepo: IUserRepository;
  #bookRepo: IBookRepository;

  constructor(userRepo: IUserRepository, bookRepo: IBookRepository) {
    this.#userRepo = userRepo;
    this.#bookRepo = bookRepo;
  }

  async getAllForUser(email: string): Promise<Book[]> {
    const user = await this.#userRepo.getUserByEmail(email);
    if (!user || !user.id) {
      throw new Error("User not found");
    }

    return await this.#bookRepo.getAllForUser(user.id);
  }
}
