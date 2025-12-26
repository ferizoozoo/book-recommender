import {
  BookEntity,
  LikeEntity,
  UserBookEntity,
} from "../models/library.models";
import { Repository } from "typeorm";
import { Book } from "../../../../domain/library/book.entity";
import {
  mapBookDomainToModel,
  mapBookEntityToDomain,
  mapBookEntitiesToDomain,
  mapUserBookEntitiesToBookDomain,
  mapLikeEntityToDomain,
} from "../models/mappers/library.mapper";
import { IBookRepository } from "../../../../services/common/interfaces/repositories/i-bookRepository";
import { User } from "../../../../domain/auth/user.entity";
import AppDataSource from "..";
import { mapUserDomainToModel } from "../models/mappers/auth.mapper";
import { ILikeRepository } from "../../../../services/common/interfaces/repositories/i-likeRepository";
import { UserEntity } from "../models/auth.models";
import { Like } from "../../../../domain/library/like.entity";

export class LikeRepository implements ILikeRepository {
  #books: Repository<BookEntity>;
  #user: Repository<UserEntity>;
  #likes: Repository<LikeEntity>;

  constructor() {
    this.#books = AppDataSource.getRepository(BookEntity);
    this.#user = AppDataSource.getRepository(UserEntity);
    this.#likes = AppDataSource.getRepository(LikeEntity);
  }

  async getByUserAndBook(userId: number, bookId: number): Promise<Like | null> {
    const likeEntity = await this.#likes.findOne({
      where: { book: { id: bookId }, user: { id: userId } },
      relations: ["user", "book"],
    });
    return likeEntity ? mapLikeEntityToDomain(likeEntity) : null;
  }

  async getByUserId(userId: number): Promise<Like[]> {
    const likeEntities = await this.#likes.find({
      where: { user: { id: userId } },
      relations: ["user", "book"],
    });
    return likeEntities.map((likeEntity) => mapLikeEntityToDomain(likeEntity));
  }

  async remove(id: number): Promise<void> {
    await this.#likes.delete(id);
  }
  // NOTE: should this method be in LikeRepository?
  async add(user: User, book: Book): Promise<void> {
    if (!user || !book) {
      throw new Error("User and Book are required to like a book");
    }

    const like = new LikeEntity();

    like.user = mapUserDomainToModel(user);
    like.book = mapBookDomainToModel(book);
    await this.#likes.save(like);
  }
}
