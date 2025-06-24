import {Request, Response, NextFunction} from "express";
import {User} from "../../domain/auth/user.entity";
import {UserService} from "../../services/auth.service";

export class UserController {
    public static getUsers(req: Request, res: Response, next: NextFunction) {
        // TODO: this is for testing purposes, but ports and adaptors may be used
        //       to gate the data received and sent at the presentation layer.
        const user = UserService.getUsers();
        res.status(200).json([{
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email
        }]);
    }
}