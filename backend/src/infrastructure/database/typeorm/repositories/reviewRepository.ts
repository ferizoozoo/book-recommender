import { BookEntity, ReviewEntity } from "../models/library.models.ts";
import AppDataSource from "../index.ts";
import { Repository } from "typeorm";
import {
  mapBookEntityToDomain,
  mapReviewDomainToModel,
  mapReviewEntityToDomain,
} from "../models/mappers/library.mapper.ts";
import { Review } from "../../../../domain/library/review.entity.ts";
import { IReviewRepository } from "../../../../services/common/interfaces/repositories/i-reviewRepository.ts";

export class ReviewRepository implements IReviewRepository {
  #reviews: Repository<ReviewEntity>;

  constructor() {
    this.#reviews = AppDataSource.getRepository(ReviewEntity);
  }

  async getById(id: number): Promise<Review | null> {
    const reviewEntity = await this.#reviews.findOne({
      where: { id },
      relations: ["book", "user"],
    });

    if (!reviewEntity) {
      return null;
    }

    return mapReviewEntityToDomain(reviewEntity);
  }

  async getBookReviews(bookId: number): Promise<Review[] | null> {
    const reviewEntities = await this.#reviews.find({
      where: { book: { id: bookId } },
      relations: ["book", "user"],
    });

    if (!reviewEntities) {
      return null;
    }

    return reviewEntities.map(mapReviewEntityToDomain);
  }

  async getByBookAndUser(
    bookId: number,
    userId: number
  ): Promise<Review | null> {
    const reviewEntity = await this.#reviews.findOne({
      where: { book: { id: bookId }, user: { id: userId } },
      relations: ["book", "user"],
    });

    if (!reviewEntity) {
      return null;
    }

    return mapReviewEntityToDomain(reviewEntity);
  }

  async save(review: Review): Promise<void> {
    const reviewEntity = mapReviewDomainToModel(review);
    let res = await this.#reviews.create(reviewEntity);
    console.log({ res });
    await this.#reviews.save(res);
  }

  async delete(id: number): Promise<void> {
    await this.#reviews.delete(id);
  }

  async update(review: Review): Promise<void> {
    const reviewEntity = mapReviewDomainToModel(review, true);
    await this.#reviews.save(reviewEntity);
  }
}
