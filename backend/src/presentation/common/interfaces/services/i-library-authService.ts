import { Author } from "../../../../domain/library/author.entity";
import { Book } from "../../../../domain/library/book.entity";
import { AuthorDto } from "../../../../services/dtos/library.dtos";

export interface ILibraryAuthService {
  // Define your service methods here
  getAllForUser(email: string): Promise<Book[]>;
  addAuthor(authorData: AuthorDto, userClaims: any): Promise<Author>;
  likeBook(userId: number, bookId: number): Promise<void>;
  addReview(
    bookId: number,
    rating: number,
    review: string,
    userId: number
  ): Promise<void>;
}
