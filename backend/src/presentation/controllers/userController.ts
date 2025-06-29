import {Request, Response, NextFunction} from "express";
import {IUserService} from "../../services/interfaces/i-userService.ts";

export class UserController {
    #userService: IUserService;

    constructor(userService: IUserService) {
        this.#userService = userService;
    }

    public getUsers(req: Request, res: Response, next: NextFunction) {
        // TODO: this is for testing purposes, but ports and adaptors may be used
        //       to gate the data received and sent at the presentation layer.
        res.status(200).json(this.#userService.getUsers());
    }
}