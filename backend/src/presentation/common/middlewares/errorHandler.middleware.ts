import {Request, Response, NextFunction} from "express";

export function errorHandler (err: any, req: Request, res: Response, next: NextFunction) {
    res.status(500)
    res.render('error', { error: err })
}