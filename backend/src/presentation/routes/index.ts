import authRoutes from './auth.routes';
import {Router} from "express";

const appRouter = Router();

// define all the routes below
appRouter.use('/auth', authRoutes);

export default appRouter;
