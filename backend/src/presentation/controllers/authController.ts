import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../common/interfaces/services/i-authService.ts";
import { presentationConsts } from "../common/consts.ts";
import { AuthGuard } from "../common/decorators/auth.decorator.ts";

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
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: presentationConsts.AuthEmailAndPasswordRequired });
      return;
    }

    const token = await this.#authService.login(email, password);
    res.status(200).json({ token });
  }

  async register(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { email, password, retypePassword } = req.body;

    if (!email || !password || !retypePassword) {
      res
        .status(400)
        .json({ message: presentationConsts.AuthEmailAndPasswordRequired });
      return;
    }

    const token = await this.#authService.register(
      email,
      password,
      retypePassword
    );
    res.status(201).json({ token });
  }

  async refresh(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const refreshToken = req.body.refreshToken;

    const token = await this.#authService.refresh(refreshToken);
    res.status(201).json({ token });
  }

  @AuthGuard(["user"])
  async updateProfile(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { firstName, lastName, email } = req.body;

    const token = await this.#authService.updateProfile(
      firstName,
      lastName,
      email
    );
    res.status(201).json({ token });
  }

  @AuthGuard(["admin"])
  async getAllUsers(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const users = await this.#authService.getAllUsers();
    res.status(200).json({ users });
  }

  @AuthGuard(["admin"])
  async createUser(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { firstName, lastName, email, password } = req.body;

    const token = await this.#authService.createUser(
      firstName,
      lastName,
      email,
      password
    );
    res.status(201).json({ token });
  }

  @AuthGuard(["admin"])
  async updateUser(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { id, firstName, lastName, email, password } = req.body;
    if (!id) {
      res.status(400).json({ message: presentationConsts.AuthUserIdRequired });
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
  }

  @AuthGuard(["admin"])
  async deleteUser(
    req: Request,
    res: Response,
    nextFunction: NextFunction
  ): Promise<void> {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ message: presentationConsts.AuthUserIdRequired });
      return;
    }

    const token = await this.#authService.deleteUser(id);
    res.status(201).json({ token });
  }
}
