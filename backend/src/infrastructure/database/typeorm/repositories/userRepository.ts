import {UserEntity} from "../models/auth.models.ts";
import AppDataSource from "../main.ts";
import {Repository} from "typeorm";
import {User} from "../../../../domain/auth/user.entity.ts";
import {mapUserDomainToModel} from "../models/mappers/auth.mapper.ts";
import {IUserRepository} from "../../../../services/repositories/i-userRepository.ts";

export class UserRepository implements IUserRepository {
    #users: Repository<UserEntity>;

    constructor() {
        this.#users = AppDataSource.getRepository(UserEntity);
    }

   async addUser(user: User) {
        const userEntity = mapUserDomainToModel(user);
        await this.#users.save(userEntity);
       console.log("User has been saved. User id is", userEntity.id)
   }

   async getAllUsers(): Promise<UserEntity[]> {
        return await this.#users.find();
   }
}