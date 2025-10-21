import { User } from "../auth/user.entity";
import { domainConsts } from "../common/consts";
import { IValidate } from "../common/interfaces/i-validate";
import { Book } from "./book.entity";

// NOTE: the reason I didn't make the fields private and encapsulated is, "what is the point?"
export class Review implements IValidate {
  constructor(
    public id: number,
    public book: Book,
    public user: User,
    // TODO: the decision to have the rating here, in the book entity or even having it in the review entity, must be done later
    // public rating: number,
    public comment: string
  ) {}

  validate(): boolean {
    if (this.id < 0) {
      throw new Error(domainConsts.ReviewIdNonNegative);
    }

    return true;
  }
}
