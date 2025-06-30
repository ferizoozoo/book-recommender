import {User} from "../../../domain/auth/user.entity.ts";
import {UserEntity} from "../../../infrastructure/database/typeorm/models/auth.models.ts";

// TODO: this interface which is in the application layer, shouldn't know about UserEntity! it should only know about User!
export interface IUserRepository {
    addUser(user: User): void;
    getAllUsers(): Promise<User[]>;
}