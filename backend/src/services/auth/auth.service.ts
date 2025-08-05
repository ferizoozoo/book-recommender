import {IUserRepository} from "../common/interfaces/repositories/i-userRepository.ts";
import {IHasher} from "../../domain/common/interfaces/i-hasher.ts";
import {ITokenService} from "../common/interfaces/security/i-tokenService.ts";
import {IAuthService} from "../../presentation/common/interfaces/services/i-authService.ts";
import {User} from "../../domain/auth/user.entity.ts";
import {serviceConsts} from "../common/consts.ts";
import {AuthTokens} from "../common/interfaces/types/authTokens.ts";

export class AuthService implements IAuthService {
    #userRepo: IUserRepository;
    #hasher: IHasher;
    #tokenService: ITokenService;

    constructor(userRepo: IUserRepository, hasher: IHasher, tokenService: ITokenService) {
        this.#userRepo = userRepo;
        this.#hasher = hasher;
        this.#tokenService = tokenService;
    }

    async register(email: string, password: string): Promise<string> {
        if (!email || !password) {
            throw new Error(serviceConsts.AuthEmailAndPasswordRequired);
        }

        const oldUser = await this.#userRepo.getUserByEmail(email);
        if (oldUser !== null) {
            throw new Error(serviceConsts.AuthEmailAndPasswordRequired);
        }

        // TODO: is 'new'ing an Entity a good thing or do we need like a static method for creating objects?
        const user = new User();
        user.email = email; // TODO: about encapsulation of entities, it can be discussed if it's necessary or not
        await user.savePassword(password, this.#hasher);
        await this.#userRepo.addUser(user);

        const userClaims = user.toClaims();
        return this.#tokenService.generateAccessToken(userClaims);
    }

    async login(email: string, password: string): Promise<AuthTokens> {
        if (!email || !password) {
            throw new Error(serviceConsts.AuthEmailAndPasswordRequired);
        }

        const user = await this.#userRepo.getUserByEmail(email);
        if (!user) {
            throw new Error(serviceConsts.AuthInvalidEmailAndPassword);
        }

        if (!await user.checkPassword(password, this.#hasher)) {
            throw new Error(serviceConsts.AuthInvalidEmailAndPassword);
        }

        const userClaims = user.toClaims();
        const newAccessToken = this.#tokenService.generateAccessToken(userClaims);
        const newRefreshToken = this.#tokenService.generateRefreshToken(userClaims);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }

    async refresh(refreshToken: string): Promise<AuthTokens> {
        const claims = this.#tokenService.validateRefreshToken(refreshToken);
        const newRefreshToken = this.#tokenService.generateRefreshToken(claims);
        const newAccessToken = this.#tokenService.generateAccessToken(claims);
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }

    async getUsers(): Promise<User[]> {
        return await this.#userRepo.getAllUsers();
    }
}


