import {User} from "../../../domain/auth/user.entity.ts";

export interface AuthService {

}

export interface IUserService {
  getUsers(): Promise<User[]>;
}