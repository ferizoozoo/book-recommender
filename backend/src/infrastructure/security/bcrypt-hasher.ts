import {IHasher} from "../../domain/common/interfaces/i-hasher.ts";
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export class BcryptHasher implements IHasher {
    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    }
}