import {Router} from "express";
import authRouter from "./auth.routes.ts";
import userRouter from "./user.routes.ts";

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter);

export default appRouter;
