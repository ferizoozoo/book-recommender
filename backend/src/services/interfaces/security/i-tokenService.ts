import {User} from "../../../domain/auth/user.entity.ts";
import {UserClaims} from "../../../domain/auth/user-claims.value.ts";

export interface ITokenService {
    generateAccessToken(user: UserClaims): string;
    validateAccessToken(token: string): UserClaims;
    generateRefreshToken(payload: UserClaims): string;
    validateRefreshToken(token: string): UserClaims;
}