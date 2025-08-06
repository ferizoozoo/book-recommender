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
  #books: Repository<BookEntity>;

  constructor() {
    this.#publishers = AppDataSource.getRepository(PublisherEntity);
    this.#books = AppDataSource.getRepository(BookEntity);
  }

  async getById(id: number): Promise<Publisher | null> {
    const publisherEntity = await this.#publishers.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!publisherEntity) {
      return null;
    }

    const publisher = mapPublisherEntityToDomain(publisherEntity);

    // Load books separately to avoid circular references
    const bookEntities = await this.#books.find({
      where: { publisher: { id } },
      relations: ["author"],
    });

    publisher.books = mapBookEntitiesToDomain(bookEntities);

    return publisher;
  }

  async getAll(): Promise<Publisher[]> {
    const publisherEntities = await this.#publishers.find({
      relations: ["user"],
    });

    return Promise.all(
      publisherEntities.map(async (publisherEntity) => {
        const publisher = mapPublisherEntityToDomain(publisherEntity);

        // Load books separately for each publisher
        const bookEntities = await this.#books.find({
          where: { publisher: { id: publisher.id } },
          relations: ["author"],
        });

        publisher.books = mapBookEntitiesToDomain(bookEntities);

        return publisher;
      })
    );
  }

  async save(publisher: Publisher): Promise<void> {
    const publisherEntity = mapPublisherDomainToModel(publisher);
    await this.#publishers.save(publisherEntity);
  }

  async delete(id: number): Promise<void> {
    await this.#publishers.delete(id);
  }

  async update(publisher: Publisher): Promise<void> {
    const publisherEntity = mapPublisherDomainToModel(publisher);
    await this.#publishers.update(publisher.id, publisherEntity);
  }
}
