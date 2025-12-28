import { Author } from "../../../../domain/library/author.entity";
import { Book } from "../../../../domain/library/book.entity";
import { AuthorDto, BookDto } from "../../../../services/dtos/library.dtos";

export interface ILibraryAuthService {
  // Define your service methods here
  getAllForUser(email: string): Promise<BookDto[]>;
  addAuthor(authorData: AuthorDto, userClaims: any): Promise<AuthorDto>;
  likeToggle(userId: number, bookId: number): Promise<void>;
  getUserLikedBooks(userId: number): Promise<number[]>;
  addReview(
    bookId: number,
    rating: number,
    review: string,
    userId: number
  ): Promise<void>;
}
