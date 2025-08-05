import { IValidate } from "../common/interfaces/i-validate";
import { domainConsts } from "../common/consts";
import { User } from "../auth/user.entity";
import { Author } from "./author.entity";
import { Book } from "./book.entity";

// NOTE: the reason I didn't make the fields private and encapsulated is, "what is the point?"
export class Publisher implements IValidate {
  constructor(
    public id: number,
    public name: string = "",
    public address: string = "",
    public city: string = "",
    public state: string = "",
    public zip: string = "",
    public country: string = "",
    public books: Book[] = [],
    public user: User = new User()
  ) {}

  // TODO: maybe this validate method should be replaced with decorators.
  validate(): boolean {
    if (this.id < 0) {
      throw new Error(domainConsts.PublisherIdNonNegative);
    }

    if (!this.name || this.name.length < 1 || this.name.length > 200) {
      throw new Error(domainConsts.PublisherTitleShouldBeValid);
    }

    if (!this.address) {
      throw new Error(domainConsts.PublisherDescriptionNotDefined);
    }

    return true;
  }
}
