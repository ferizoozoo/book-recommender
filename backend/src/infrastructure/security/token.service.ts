import jwt from 'jsonwebtoken';
import { ITokenService } from "../../services/common/interfaces/security/i-tokenService.ts";
import { UserClaims } from "../../domain/auth/user-claims.value.ts";
import jwtConfig from "../config/auth.config.ts";

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: UserClaims): string {
    // @ts-ignore
    return jwt.sign(this.transformPayload(payload), jwtConfig.secret, {
      expiresIn: jwtConfig.accessTokenExpiresIn 
    });
  }

  validateAccessToken(token: string): UserClaims {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as Record<string, any>;
      return new UserClaims(
        decoded.userId,
        decoded.email,
        decoded.roles,
        decoded.firstname,
        decoded.lastname
      );
    } catch (error) {
      throw new Error(`Invalid access token: ${(error as Error).message}`);
    }
  }

  generateRefreshToken(payload: UserClaims): string {
    // @ts-ignore
    return jwt.sign(this.transformPayload(payload), jwtConfig.secret, {
      expiresIn: jwtConfig.refreshTokenExpiresIn 
    });
  }

  validateRefreshToken(token: string): UserClaims {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as Record<string, any>;
      return new UserClaims(
        decoded.userId,
        decoded.email,
        decoded.roles,
        decoded.firstname,
        decoded.lastname
      );
    } catch (error) {
      throw new Error(`Invalid refresh token: ${(error as Error).message}`);
    }
  }

  private transformPayload(payload: UserClaims): Record<string, any> {
    return {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles,
      firstname: payload.firstname,
      lastname: payload.lastname
    };
  }
}