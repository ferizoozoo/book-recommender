import {User} from "../domain/auth/user.entity.ts";
import {IUserRepository} from "./interfaces/repositories/i-userRepository.ts";
import {IUserService} from "../presentation/interfaces/services/auth.service.ts";

export class AuthService {

}

export class UserService implements IUserService {
    #userRepo: IUserRepository;
    constructor(userRepo: IUserRepository) {
        this.#userRepo = userRepo;
    }

    async getUsers(): Promise<User[]> {
        return await this.#userRepo.getAllUsers();
    }
}