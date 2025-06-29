import {Router} from "express";
import authRouter from "./auth.routes.ts";

const appRouter = Router();

appRouter.use('/auth', authRouter);

export default appRouter;
