import { Book } from "../../../../domain/library/book.entity";

export interface ILibraryAuthService {
  // Define your service methods here
  getAllForUser(email: string): Promise<Book[]>;
}
