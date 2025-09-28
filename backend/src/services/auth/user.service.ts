import { IUserRepository } from "../common/interfaces/repositories/i-userRepository.ts";
import { IUserService } from "../../presentation/common/interfaces/services/i-userService.ts";
import { User } from "../../domain/auth/user.entity.ts";
import { serviceConsts } from "../common/consts.ts";

export class UserService implements IUserService {
  #userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.#userRepo = userRepo;
  }

  async getUsers(): Promise<User[]> {
    return await this.#userRepo.getAll();
  }
}
