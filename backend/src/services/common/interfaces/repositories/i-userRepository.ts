import { User } from "../../../../domain/auth/user.entity.ts";

export interface IUserRepository {
  addUser(user: User): Promise<void>; // TODO: the name 'addUser' doesn't make sense, use 'add'
  updateUser(user: User): Promise<void>; // TODO: the name 'addUser' doesn't make sense, use 'update'
  getAllUsers(): Promise<User[]>;
  getById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
}
