import { Router } from 'express';
import {UserController} from "../controllers/userController";

const authRouter = Router();

authRouter.get('/users', UserController.getUsers);

export default authRouter;