import { Router } from 'express';
import {userController} from "../../di/setup.ts";

const userRouter = Router();

userRouter.get('/all', async (req, res, next) => {
    await userController.getUsers(req, res, next);
});

export default userRouter;