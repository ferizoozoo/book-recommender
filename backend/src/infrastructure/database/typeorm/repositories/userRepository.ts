import {UserEntity} from "../models/auth.models.ts";
import AppDataSource from "../main.ts";
import {Repository} from "typeorm";
import {User} from "../../../../domain/auth/user.entity.ts";
import {mapUserDomainToModel, mapUserEntityToDomain} from "../models/mappers/auth.mapper.ts";
import {IUserRepository} from "../../../../services/interfaces/repositories/i-userRepository.ts";

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

   async getAllUsers(): Promise<User[]> {
        const userEntities = await this.#users.find();
        const users: User[] = [];
       userEntities.forEach(user => {
           users.push(mapUserEntityToDomain(user));
       })
       return users;
   }
}