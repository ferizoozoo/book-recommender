import { User } from "../../../../domain/auth/user.entity.ts";
import { Book } from "../../../../domain/library/book.entity.ts";
import { Like } from "../../../../domain/library/like.entity.ts";

export interface ILikeRepository {
  add(user: User, book: Book): Promise<void>;
  remove(id: number): Promise<void>;
  getByUserAndBook(userId: number, bookId: number): Promise<Like | null>;
  getByUserId(userId: number): Promise<Like[]>;
}
