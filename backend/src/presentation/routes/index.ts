import {Router} from "express";
import authRouter from "./auth.routes.ts";
import userRouter from "./user.routes.ts";
import libraryRouter from "./library.routes.ts";

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter);
appRouter.use('/library', libraryRouter);

export default appRouter;
