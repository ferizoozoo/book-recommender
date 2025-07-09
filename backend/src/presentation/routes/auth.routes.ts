import { Router } from 'express';
import {authController} from "../../di/setup.ts";

const authRouter = Router();

// TODO: it seems like this is the real controller, so when defining controllers,
//          there would be an extra unnecessary layer, maybe not, worth thinking about it later.
authRouter.post('/login', async (req, res, next) => {
    await authController.login(req, res, next);
});

authRouter.post('/register', async (req, res, next) => {
    await authController.register(req, res, next);
});

authRouter.post('/refresh', async (req, res, next) => {
    await authController.refresh(req, res, next);
})

export default authRouter;