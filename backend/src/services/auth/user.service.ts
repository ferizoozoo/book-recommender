import {IUserService} from "../../presentation/interfaces/services/i-userService.ts";
import {IUserRepository} from "../interfaces/repositories/i-userRepository.ts";
import {User} from "../../domain/auth/user.entity.ts";

export class UserService implements IUserService {
    #userRepo: IUserRepository;
    constructor(userRepo: IUserRepository) {
        this.#userRepo = userRepo;
    }

    async getUsers(): Promise<User[]> {
        return await this.#userRepo.getAllUsers();
    }
}
