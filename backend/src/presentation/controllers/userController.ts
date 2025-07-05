import {Request, Response, NextFunction} from "express";
import {IUserService} from "../interfaces/services/i-userService.ts";

export class UserController {
    #userService: IUserService;

    constructor(userService: IUserService) {
        this.#userService = userService;
    }

    public getUsers() {
        // TODO: this is for testing purposes, but ports and adaptors may be used
        //       to gate the data received and sent at the presentation layer.
    }
}