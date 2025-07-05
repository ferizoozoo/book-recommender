import { AuthService } from '../services/auth/auth.service.ts';
import { UserController } from '../presentation/controllers/userController.ts';
import { UserRepository } from "../infrastructure/database/typeorm/repositories/userRepository.ts";
import {BcryptHasher} from "../infrastructure/security/bcrypt-hasher.ts";
import {JwtTokenService} from "../infrastructure/security/token.service.ts";
import {AuthController} from "../presentation/controllers/authController.ts";
import {UserService} from "../services/auth/user.service.ts";

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

// export the registered services
export {
    userController,
    authController,
};