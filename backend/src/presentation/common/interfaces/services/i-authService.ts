import {AuthTokens} from "../../../../services/common/interfaces/types/authTokens.ts";

export interface IAuthService {
    login(email: string, password: string): Promise<AuthTokens>
    register(email: string, password: string): Promise<string>
    refresh(refreshToken: string): Promise<AuthTokens>
}