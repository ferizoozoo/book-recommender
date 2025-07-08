import {Request, Response, NextFunction} from "express";
import {IUserService} from "../common/interfaces/services/i-userService.ts";
import {AuthGuard} from "../common/decorators/auth.decorator.ts";

export class UserController {
    #userService: IUserService;

    constructor(userService: IUserService) {
        this.#userService = userService;
    }

    @AuthGuard()
    public getUsers(req: Request, res: Response, nextFunction: NextFunction) {
        // TODO: this is for testing purposes, but ports and adaptors may be used
        //       to gate the data received and sent at the presentation layer.
       res.send("all users")
    }
}