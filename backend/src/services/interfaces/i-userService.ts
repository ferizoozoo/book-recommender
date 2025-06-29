import { User } from "../../domain/auth/user.entity.ts";

export interface IUserService {
  getUsers(): Promise<User[]>;
}
