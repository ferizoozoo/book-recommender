import { UserEntity } from "../models/auth.models.ts";
import AppDataSource from "../index.ts";
import { Repository } from "typeorm";
import { User } from "../../../../domain/auth/user.entity.ts";
import {
  mapUserDomainToModel,
  mapUserEntityToDomain,
} from "../models/mappers/auth.mapper.ts";
import { IUserRepository } from "../../../../services/common/interfaces/repositories/i-userRepository.ts";

export class UserRepository implements IUserRepository {
  #users: Repository<UserEntity>;

  constructor() {
    this.#users = AppDataSource.getRepository(UserEntity);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const userEntity = await this.#users.findOne({
      where: { email: email },
    });

    if (!userEntity) {
      return null;
    }

    return mapUserEntityToDomain(userEntity);
  }

  async addUser(user: User) {
    const userEntity = mapUserDomainToModel(user);
    await this.#users.save(userEntity);
  }

  async updateUser(user: User) {
    const userEntity = mapUserDomainToModel(user);
    await this.#users.update(user.id, userEntity);
  }

  async getAllUsers(): Promise<User[]> {
    const userEntities = await this.#users.find();
    const users: User[] = [];
    userEntities.forEach((user) => {
      users.push(mapUserEntityToDomain(user));
    });
    return users;
  }

  async getById(id: number): Promise<User | null> {
    const userEntity = await this.#users.findOne({
      where: { id: id },
    });

    if (!userEntity) {
      return null;
    }

    return mapUserEntityToDomain(userEntity);
  }
}
