import { AuthorEntity } from "../models/library.models.ts";
import AppDataSource from "../index.ts";
import { Repository } from "typeorm";
import { Author } from "../../../../domain/library/author.entity.ts";
import {
  mapAuthorDomainToModel,
  mapAuthorEntityToDomain,
} from "../models/mappers/library.mapper.ts";
import { IAuthorRepository } from "../../../../services/common/interfaces/repositories/i-authorRepository.ts";

export class AuthorRepository implements IAuthorRepository {
  #authors: Repository<AuthorEntity>;

  constructor() {
    this.#authors = AppDataSource.getRepository(AuthorEntity);
  }

  async getById(id: number): Promise<Author | null> {
    const authorEntity = await this.#authors.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!authorEntity) {
      return null;
    }

    return mapAuthorEntityToDomain(authorEntity);
  }

  async getAll(): Promise<Author[]> {
    const authorEntities = await this.#authors.find({
      relations: ["user", "books"],
      order: { id: "DESC" },
    });

    return Promise.all(
      authorEntities.map(async (authorEntity) => {
        return mapAuthorEntityToDomain(authorEntity);
      })
    );
  }

  async getByUserId(userId: number): Promise<Author | null> {
    const authorEntity = await this.#authors.findOne({
      where: { user: { id: userId } },
      relations: ["user", "books"],
    });

    if (!authorEntity) {
      return null;
    }

    return mapAuthorEntityToDomain(authorEntity);
  }

  async save(author: Author): Promise<void> {
    const authorEntity = mapAuthorDomainToModel(author);
    // Extract everything except id for new authors
    const { id, ...entityWithoutId } = authorEntity;
    await this.#authors.insert(entityWithoutId);
  }

  async delete(id: number): Promise<void> {
    await this.#authors.delete(id);
  }

  async update(author: Author): Promise<void> {
    if (!author.id || author.id <= 0) {
      throw new Error("Cannot update author without a valid ID");
    }
    const authorEntity = mapAuthorDomainToModel(author);
    await this.#authors.update(author.id, authorEntity);
  }
}
