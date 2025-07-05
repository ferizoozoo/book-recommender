import {IUserRepository} from "../interfaces/repositories/i-userRepository.ts";
import {IHasher} from "../../domain/common/interfaces/i-hasher.ts";
import {ITokenService} from "../interfaces/security/i-tokenService.ts";
import {IAuthService} from "../../presentation/interfaces/services/i-authService.ts";
import {User} from "../../domain/auth/user.entity.ts";

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
            throw new Error('Email and password are required');
        }

        const oldUser = await this.#userRepo.getUserByEmail(email);
        if (oldUser !== null) {
            throw new Error('Email already registered');
        }

        // TODO: is 'new'ing an Entity a good thing or do we need like a static method for creating objects?
        const user = new User();
        user.email = email; // TODO: about encapsulation of entities, it can be discussed if it's necessary or not
        await user.savePassword(password, this.#hasher);
        await this.#userRepo.addUser(user);

        const userClaims = user.toClaims();
        return this.#tokenService.generateAccessToken(userClaims);
    }

    async login(email: string, password: string): Promise<string> {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await this.#userRepo.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!await user.checkPassword(password, this.#hasher)) {
            throw new Error('Invalid email or password');
        }

        const userClaims = user.toClaims();
        return this.#tokenService.generateAccessToken(userClaims);
    }
}


