import { IValidate } from "../common/interfaces/i-validate.ts";
import { IHasher } from "../common/interfaces/i-hasher.ts";
import { UserClaims } from "./user-claims.value.ts";
import { domainConsts } from "../common/consts.ts";

// NOTE: the reason I didn't make the fields private and encapsulated is, "what is the point?"
export class User implements IValidate {
  constructor(
    public id: number = 0,
    public firstName: string = "",
    public lastName: string = "",
    public email: string = "",
    public password: string = "",
    public salt: string = "",
    public roles: string[] = []
  ) {}

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  validate(): boolean {
    if (this.id < 0) {
      throw new Error(domainConsts.UserIdNonNegative);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email || !emailRegex.test(this.email)) {
      throw new Error(domainConsts.UserEmailShouldBeValid);
    }
    // While the regex limits the local part, RFC 5321 (SMTP) limits total email to 254 chars.
    // It's still good to have this explicit check for the whole string.
    if (this.email.length > 254) {
      throw new Error(domainConsts.UserEmailCannotExceedLimit);
    }

    console.log("Validating password:", this.password);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!this.password && !passwordRegex.test(this.password)) {
      throw new Error(domainConsts.UserInvalidPassword);
    }

    return true;
  }

  async checkPassword(
    password: string,
    passwordHasher: IHasher
  ): Promise<boolean> {
    return await passwordHasher.compare(password, this.password);
  }

  async savePassword(password: string, passwordHasher: IHasher): Promise<void> {
    this.password = await passwordHasher.hash(password);
  }

  toClaims(): UserClaims {
    return new UserClaims(
      this.id,
      this.email,
      this.roles,
      this.firstName,
      this.lastName
    );
  }
}
