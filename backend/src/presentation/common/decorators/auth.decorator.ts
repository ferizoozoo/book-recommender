import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import jwtConfig from "../../../infrastructure/config/auth.config.ts";
import {tokenService} from "../../di/setup.ts";
import {UserClaims} from "../../../domain/auth/user-claims.value.ts"; // NOTE: Well, we don't have any classes to inject the interface

export interface AuthenticatedRequest extends Request {
  user?: UserClaims
}

const JWT_SECRET = jwtConfig.secret;

export function AuthGuard(roles?: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: AuthenticatedRequest = args[0];
      const res: Response = args[1];
      const next: NextFunction = args[2];

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required: No token provided or invalid format.' });
      }

      const token = authHeader.split(' ')[1];

      try {
        const decodedUser = tokenService.validateAccessToken(token);
        req.user = decodedUser;

        if (roles && roles.length > 0) {
          const userRoles = decodedUser.roles || [];

          const hasRequiredRole = roles.some(requiredRole => userRoles.includes(requiredRole));

          if (!hasRequiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
          }
        }

        return await originalMethod.apply(this, args);

      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          // Handle specific JWT errors (e.g., token expired, malformed)
          return res.status(401).json({ message: `Authentication failed: ${error.message}` });
        }
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error during authentication.' });
      }
    };

    return descriptor;
  };
}