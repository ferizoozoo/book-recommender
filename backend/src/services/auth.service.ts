import {User} from "../domain/auth/user.entity.ts";
import {IUserRepository} from "./repositories/i-userRepository.ts";
import {IUserService} from "./interfaces/i-userService.ts";
import {
    mapUserDomainToModel,
    mapUserEntityToDomain
} from "../infrastructure/database/typeorm/models/mappers/auth.mapper.ts";

export class AuthService {

}

export class UserService implements IUserService {
    #userRepo: IUserRepository;
    constructor(userRepo: IUserRepository) {
        this.#userRepo = userRepo;
    }

    async getUsers(): Promise<User[]> {
        const userEntities = await this.#userRepo.getAllUsers();
        const users: User[] = [];

        userEntities.forEach(user => {
            users.push(mapUserEntityToDomain(user));
        })

        return users;
    }
}