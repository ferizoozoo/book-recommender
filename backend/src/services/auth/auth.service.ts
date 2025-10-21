import { IUserRepository } from "../common/interfaces/repositories/i-userRepository.ts";
import { IHasher } from "../../domain/common/interfaces/i-hasher.ts";
import { ITokenService } from "../common/interfaces/security/i-tokenService.ts";
import { IAuthService } from "../../presentation/common/interfaces/services/i-authService.ts";
import { User } from "../../domain/auth/user.entity.ts";
import { serviceConsts } from "../common/consts.ts";
import { AuthTokens } from "../common/interfaces/types/authTokens.ts";

export class AuthService implements IAuthService {
  #userRepo: IUserRepository;
  #hasher: IHasher;
  #tokenService: ITokenService;

  constructor(
    userRepo: IUserRepository,
    hasher: IHasher,
    tokenService: ITokenService
  ) {
    this.#userRepo = userRepo;
    this.#hasher = hasher;
    this.#tokenService = tokenService;
  }
  async updateUser(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    isAdmin: boolean
  ): Promise<void> {
    const user = await this.#userRepo.getById(id);
    if (!user) {
      throw new Error(serviceConsts.AuthUserNotFound);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.roles = ["user"];
    await this.#userRepo.update(user);
  }
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    await user.savePassword(password, this.#hasher);
    await this.#userRepo.add(user);
  }
  async deleteUser(id: string): Promise<void> {
    return this.#userRepo.delete(id);
  }

  async register(
    email: string,
    password: string,
    retypePassword: string
  ): Promise<string> {
    if (!email || !password || !retypePassword) {
      throw new Error(serviceConsts.AuthEmailAndPasswordRequired);
    }

    if (password !== retypePassword) {
      throw new Error(serviceConsts.AuthPasswordsDoNotMatch);
    }

    const oldUser = await this.#userRepo.getByEmail(email);
    if (oldUser !== null) {
      throw new Error(serviceConsts.AuthEmailAndPasswordRequired);
    }

    const user = new User();
    user.email = email;
    user.roles = ["user"];
    user.validate();

    await user.savePassword(password, this.#hasher);
    await this.#userRepo.add(user);

    const userClaims = user.toClaims();
    return this.#tokenService.generateAccessToken(userClaims);
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    if (!email || !password) {
      throw new Error(serviceConsts.AuthEmailAndPasswordRequired);
    }

    const user = await this.#userRepo.getByEmail(email);
    if (!user) {
      throw new Error(serviceConsts.AuthInvalidEmailAndPassword);
    }

    if (!(await user.checkPassword(password, this.#hasher))) {
      throw new Error(serviceConsts.AuthInvalidEmailAndPassword);
    }

    const userClaims = user.toClaims();
    const newAccessToken = this.#tokenService.generateAccessToken(userClaims);
    const newRefreshToken = this.#tokenService.generateRefreshToken(userClaims);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const claims = this.#tokenService.validateRefreshToken(refreshToken);
    const newRefreshToken = this.#tokenService.generateRefreshToken(claims);
    const newAccessToken = this.#tokenService.generateAccessToken(claims);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async updateProfile(
    firstName: string,
    lastName: string,
    email: string
  ): Promise<void> {
    const user = await this.#userRepo.getByEmail(email);
    if (!user) {
      throw new Error(serviceConsts.AuthUserNotFound);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    await this.#userRepo.update(user);
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const users = await this.#userRepo.getAll();
      return users;
    } catch (error) {
      throw new Error(serviceConsts.AuthGetUsersFailed);
    }
  }
}
