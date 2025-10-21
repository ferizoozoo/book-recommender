import { Router } from "express";
import { authController } from "../di/setup.ts";

const authRouter = Router();

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
