import { PublisherEntity, BookEntity } from "../models/library.models.ts";
import AppDataSource from "../index.ts";
import { Repository } from "typeorm";
import { Publisher } from "../../../../domain/library/publisher.entity.ts";
import {
  mapPublisherDomainToModel,
  mapPublisherEntityToDomain,
  mapBookEntitiesToDomain,
} from "../models/mappers/library.mapper.ts";
import { IPublisherRepository } from "../../../../services/common/interfaces/repositories/i-publisherRepository.ts";

export class PublisherRepository implements IPublisherRepository {
  #publishers: Repository<PublisherEntity>;
  #books: Repository<BookEntity>; // TODO: this violates DDD, and for fetching books, we should use an orchestrator

  constructor() {
    this.#publishers = AppDataSource.getRepository(PublisherEntity);
    this.#books = AppDataSource.getRepository(BookEntity);
  }

  async getById(id: number): Promise<Publisher | null> {
    const publisherEntity = await this.#publishers.findOne({
      where: { id },
    });

    if (!publisherEntity) {
      return null;
    }

    const publisher = mapPublisherEntityToDomain(publisherEntity);

    // Load books separately to avoid circular references
    const bookEntities = await this.#books.find({
      where: id ? { publisher: { id } } : {},
      relations: ["author"],
    });

    publisher.books = mapBookEntitiesToDomain(bookEntities);

    return publisher;
  }

  async getAll(): Promise<Publisher[]> {
    const publisherEntities = await this.#publishers.find({
      order: { id: "DESC" },
    });

    return Promise.all(
      publisherEntities.map(async (publisherEntity) => {
        const publisher = mapPublisherEntityToDomain(publisherEntity);

        // Load books separately for each publisher
        const bookEntities = await this.#books.find({
          where: publisher.id ? { publisher: { id: publisher.id } } : {},
          relations: ["author"],
        });

        publisher.books = mapBookEntitiesToDomain(bookEntities);

        return publisher;
      })
    );
  }

  async save(publisher: Publisher): Promise<void> {
    const publisherEntity = mapPublisherDomainToModel(publisher);
    // Extract everything except id for new publishers
    const { id, ...entityWithoutId } = publisherEntity;
    await this.#publishers.insert(entityWithoutId);
  }

  async delete(id: number): Promise<void> {
    await this.#publishers.delete(id);
  }

  async update(publisher: Publisher): Promise<void> {
    if (!publisher.id || publisher.id <= 0) {
      throw new Error("Cannot update publisher without a valid ID");
    }
    const publisherEntity = mapPublisherDomainToModel(publisher);
    await this.#publishers.update(publisher.id, publisherEntity);
  }
}
