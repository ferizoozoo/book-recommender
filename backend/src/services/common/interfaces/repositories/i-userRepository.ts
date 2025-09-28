import { User } from "../../../../domain/auth/user.entity.ts";

export interface IUserRepository {
  add(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(): Promise<User[]>;
  getById(id: number): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
}
