import { AuthTokens } from "../../../../services/common/interfaces/types/authTokens.ts";

export interface IAuthService {
  login(email: string, password: string): Promise<AuthTokens>;
  register(
    email: string,
    password: string,
    retypePassword: string
  ): Promise<string>;
  refresh(refreshToken: string): Promise<AuthTokens>;
  updateProfile(
    firstName: string,
    lastName: string,
    email: string
  ): Promise<void>;
  getAllUsers(): Promise<any[]>;
  updateUser(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    isAdmin: boolean
  ): Promise<void>;
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
