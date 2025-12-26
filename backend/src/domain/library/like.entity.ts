import { User } from "../auth/user.entity";
import { domainConsts } from "../common/consts";
import { IValidate } from "../common/interfaces/i-validate";
import { Book } from "./book.entity";

// NOTE: the reason I didn't make the fields private and encapsulated is, "what is the point?"
export class Like implements IValidate {
  constructor(public id: number, public book: Book, public user: User) {}

  validate(): boolean {
    // Allow 0 for new records that haven't been saved yet
    // Only enforce non-negative for existing records
    if (this.id < 0) {
      throw new Error(domainConsts.ReviewIdNonNegative);
    }

    return true;
  }
}
