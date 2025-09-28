import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../common/interfaces/services/i-authService.ts";
import { presentationConsts } from "../common/consts.ts";
import { AuthGuard } from "../common/decorators/auth.decorator.ts";

// TODO: each controller should have its own DTO, for better validation and type safety
export class AuthController {
  #authService: IAuthService;

  constructor(authService: IAuthService) {
    this.#authService = authService;
  }

  async login(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    // TODO: there should be a global exception handler as a middleware to avoid these try/catch blocks
    //          in each of the controller actions/methods.
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ message: presentationConsts.AuthEmailAndPasswordRequired });
        return;
      }

      const token = await this.#authService.login(email, password);
      res.status(200).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthAuthenticationFailed;
      res.status(401).json({ message: errorMessage });
    }
  }

  async register(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ message: presentationConsts.AuthEmailAndPasswordRequired });
        return;
      }

      const token = await this.#authService.register(email, password);
      res.status(201).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthRegisterFailed;
      res.status(400).json({ message: errorMessage });
    }
  }

  async refresh(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.body.refreshToken;

      const token = await this.#authService.refresh(refreshToken);
      res.status(201).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthRegisterFailed;
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["user"])
  async updateProfile(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { firstName, lastName, email } = req.body;

      const token = await this.#authService.updateProfile(
        firstName,
        lastName,
        email
      );
      res.status(201).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthRegisterFailed;
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
  async getAllUsers(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const users = await this.#authService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthGetUsersFailed;
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
  async createUser(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body;

      const token = await this.#authService.createUser(
        firstName,
        lastName,
        email,
        password
      );
      res.status(201).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthCreateUserFailed;
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
  async updateUser(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { id, firstName, lastName, email, password } = req.body;
      if (!id) {
        res
          .status(400)
          .json({ message: presentationConsts.AuthUserIdRequired });
        return;
      }

      const token = await this.#authService.updateUser(
        id,
        firstName,
        lastName,
        email,
        password
      );
      res.status(201).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthUpdateUserFailed;
      res.status(400).json({ message: errorMessage });
    }
  }

  @AuthGuard(["admin"])
  async deleteUser(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.body;
      if (!id) {
        res
          .status(400)
          .json({ message: presentationConsts.AuthUserIdRequired });
        return;
      }

      const token = await this.#authService.deleteUser(id);
      res.status(201).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : presentationConsts.AuthDeleteUserFailed;
      res.status(400).json({ message: errorMessage });
    }
  }
}
