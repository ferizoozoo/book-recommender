import { Review } from "../../../../domain/library/review.entity";

export interface IReviewRepository {
  getById(id: number): Promise<Review | null>;
  getBookReviews(bookId: number): Promise<Review[] | null>;
  save(review: Review): Promise<void>;
  delete(id: number): Promise<void>;
  update(review: Review): Promise<void>;
}
