import { AuthorEntity, BookEntity } from "../models/library.models.ts";
import AppDataSource from "../index.ts";
import { Repository } from "typeorm";
import { Author } from "../../../../domain/library/author.entity.ts";
import {
  mapAuthorDomainToModel,
  mapAuthorEntityToDomain,
  mapBookEntitiesToDomain,
} from "../models/mappers/library.mapper.ts";
import { IAuthorRepository } from "../../../../services/common/interfaces/repositories/i-authorRepository.ts";

export class AuthorRepository implements IAuthorRepository {
  #authors: Repository<AuthorEntity>;
  #books: Repository<BookEntity>;

  constructor() {
    this.#authors = AppDataSource.getRepository(AuthorEntity);
    this.#books = AppDataSource.getRepository(BookEntity);
  }

  async getById(id: number): Promise<Author | null> {
    const authorEntity = await this.#authors.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!authorEntity) {
      return null;
    }

    const author = mapAuthorEntityToDomain(authorEntity);

    // Load books separately to avoid circular references
    const bookEntities = await this.#books.find({
      where: { author: { id } },
      relations: ["publisher"],
    });

    author.books = mapBookEntitiesToDomain(bookEntities);

    return author;
  }

  async getAll(): Promise<Author[]> {
    const authorEntities = await this.#authors.find({
      relations: ["user"],
    });

    return Promise.all(
      authorEntities.map(async (authorEntity) => {
        const author = mapAuthorEntityToDomain(authorEntity);

        // Load books separately for each author
        const bookEntities = await this.#books.find({
          where: { author: { id: author.id } },
          relations: ["publisher"],
        });

        author.books = mapBookEntitiesToDomain(bookEntities);

        return author;
      })
    );
  }

  async getByUserId(userId: number): Promise<Author | null> {
    const authorEntity = await this.#authors.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!authorEntity) {
      return null;
    }

    const author = mapAuthorEntityToDomain(authorEntity);

    // Load books separately
    const bookEntities = await this.#books.find({
      where: { author: { id: author.id } },
      relations: ["publisher"],
    });

    author.books = mapBookEntitiesToDomain(bookEntities);

    return author;
  }

  async save(author: Author): Promise<void> {
    const authorEntity = mapAuthorDomainToModel(author);
    await this.#authors.save(authorEntity);
  }

  async delete(id: number): Promise<void> {
    await this.#authors.delete(id);
  }

  async update(author: Author): Promise<void> {
    const authorEntity = mapAuthorDomainToModel(author);
    await this.#authors.update(author.id, authorEntity);
  }
}
