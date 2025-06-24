import {User} from "../domain/auth/user.entity";

export class AuthService {

}

export class UserService {
    static getUsers(): User {
        const user = new User(
            1, "ace", "mania", "ace@hello.co", "deez", "hjk32S%");
        user.validate();
        return user;
    }
}