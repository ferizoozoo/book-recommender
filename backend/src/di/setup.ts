import { UserService } from '../services/auth.service.ts';
import { UserController } from '../presentation/controllers/userController.ts';
import { UserRepository } from "../infrastructure/database/typeorm/repositories/userRepository.ts";

// NOTE: this is a very simple DI functionality for our purpose.
//        if a more sophisticated DI functionality is needed, then we could
//        simply build a container and use this file as a setup for filling the
//        container with concrete implementations of our service interfaces.

// Register services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// export the registered services
export { userController };