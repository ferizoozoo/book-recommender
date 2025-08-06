import { User } from "../../../../domain/auth/user.entity.ts";

export interface IUserRepository {
  addUser(user: User): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
}
