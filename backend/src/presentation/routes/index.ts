import { Router } from "express";
import authRouter from "./auth.routes.ts";
import libraryRouter from "./library.routes.ts";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/library", libraryRouter);

export default appRouter;
