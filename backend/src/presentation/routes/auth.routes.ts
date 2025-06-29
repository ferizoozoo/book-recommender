import { Router } from 'express';
import { userController } from "../../di/setup.ts";

const authRouter = Router();

authRouter.get('/users', (req, res, next) => {
    userController.getUsers(req,  res,  next)
});

export default authRouter;