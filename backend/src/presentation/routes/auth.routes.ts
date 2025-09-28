import { Router } from "express";
import { authController } from "../di/setup.ts";

const authRouter = Router();

// TODO: it seems like this is the real controller, so when defining controllers,
//          there would be an extra unnecessary layer, maybe not, worth thinking about it later.
authRouter.post("/login", async (req, res, next) => {
  await authController.login(req, res, next);
});

authRouter.post("/register", async (req, res, next) => {
  await authController.register(req, res, next);
});

authRouter.post("/refresh", async (req, res, next) => {
  await authController.refresh(req, res, next);
});

authRouter.put("/profile", async (req, res, next) => {
  await authController.updateProfile(req, res, next);
});

// TODO: should it be here or put in user routes?
authRouter.get("/users", async (req, res, next) => {
  await authController.getAllUsers(req, res, next);
});

authRouter.post("/users", async (req, res, next) => {
  await authController.createUser(req, res, next);
});

authRouter.put("/users", async (req, res, next) => {
  await authController.updateUser(req, res, next);
});

authRouter.delete("/users", async (req, res, next) => {
  await authController.deleteUser(req, res, next);
});

export default authRouter;
