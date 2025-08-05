import { IValidate } from "../common/interfaces/i-validate";
import { domainConsts } from "../common/consts";
import { User } from "../auth/user.entity";
import { Book } from "./book.entity";

// NOTE: the reason I didn't make the fields private and encapsulated is, "what is the point?"
export class Author implements IValidate {
  constructor(
    public id: number,
    public bio: string = "",
    public image: string = "",
    public books: Book[] = [],
    public user: User = new User()
  ) {}

  // TODO: maybe this validate method should be replaced with decorators.
  validate(): boolean {
    if (this.id < 0) {
      throw new Error(domainConsts.AuthorIdNonNegative);
    }

    return true;
  }
}
