import { IValidate } from "../common/interfaces/i-validate";
import { domainConsts } from "../common/consts";
import { Author } from "./author.entity";
import { Publisher } from "./publisher.entity";

// NOTE: the reason I didn't make the fields private and encapsulated is, "what is the point?"
export class Book implements IValidate {
  public labels: string[] = [];
  public quantity: number = 0;
  public available: boolean = false;

  constructor(
    public id: number | null = null,
    public title: string = "",
    public author: Author,
    public description: string = "",
    public isbn: string = "",
    public publisher: Publisher,
    public year: number = 0,
    public image: string = ""
  ) {}

  validate(): boolean {
    if (this.id !== null && this.id < 0) {
      throw new Error(domainConsts.BookIdNonNegative);
    }

    if (this.author && this.author.id !== null && this.author.id < 0) {
      throw new Error(domainConsts.BookAuthorShouldBeValid);
    }

    if (this.publisher && this.publisher.id !== null && this.publisher.id < 0) {
      throw new Error(domainConsts.BookPublisherShouldBeValid);
    }

    if (!this.title || this.title.length < 1 || this.title.length > 200) {
      throw new Error(domainConsts.BookTitleShouldBeValid);
    }

    if (this.description && this.description.length > 2000) {
      throw new Error(domainConsts.BookDescriptionTooLong);
    }

    // Remove any hyphens or spaces from ISBN before validation
    const cleanIsbn = this.isbn.replace(/[-\s]/g, "");
    // ISBN-10: Digits and 'X' allowed (for check digit)
    // ISBN-13: Only digits allowed
    const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
    if (!this.isbn || !isbnRegex.test(cleanIsbn)) {
      throw new Error(domainConsts.BookIsbnShouldBeValid);
    }

    const currentYear = new Date().getFullYear();
    if (this.year < 1440 || this.year > currentYear) {
      throw new Error(domainConsts.BookYearShouldBeValid);
    }

    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
    if (this.image && !urlRegex.test(this.image)) {
      throw new Error(domainConsts.BookImageUrlShouldBeValid);
    }

    return true;
  }
}
