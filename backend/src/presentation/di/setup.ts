import { AuthService } from "../../services/auth/auth.service.ts";
import { UserController } from "../controllers/userController.ts";
import { UserRepository } from "../../infrastructure/database/typeorm/repositories/userRepository.ts";
import { BcryptHasher } from "../../infrastructure/security/bcrypt-hasher.ts";
import { JwtTokenService } from "../../infrastructure/security/token.service.ts";
import { AuthController } from "../controllers/authController.ts";
import { UserService } from "../../services/auth/user.service";
import { LibraryService } from "../../services/library/library.service.ts";
import { LibraryController } from "../controllers/libraryController.ts";
import { BookRepository } from "../../infrastructure/database/typeorm/repositories/bookRepository.ts";
import { AuthorRepository } from "../../infrastructure/database/typeorm/repositories/authorRepository.ts";
import { PublisherRepository } from "../../infrastructure/database/typeorm/repositories/publisherRepository.ts";

// NOTE: this is a very simple DI functionality for our purpose.
//        if a more sophisticated DI functionality is needed, then we could
//        simply build a container and use this file as a setup for filling the
//        container with concrete implementations of our service interfaces.

// Register services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const hasher = new BcryptHasher();
const tokenService = new JwtTokenService();
const authService = new AuthService(userRepository, hasher, tokenService);

const authController = new AuthController(authService);

// Library services
const bookRepository = new BookRepository();
const authorRepository = new AuthorRepository();
const publisherRepository = new PublisherRepository();
const libraryService = new LibraryService(
  bookRepository,
  authorRepository,
  publisherRepository
);
const libraryController = new LibraryController(libraryService);

// export the registered services
export { userController, authController, libraryController, tokenService };
