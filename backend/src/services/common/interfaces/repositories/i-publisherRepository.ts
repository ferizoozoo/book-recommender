import { Publisher } from "../../../../domain/library/publisher.entity.ts";

export interface IPublisherRepository {
    getById(id: number): Promise<Publisher | null>;
    getAll(): Promise<Publisher[]>;
    getByUserId(userId: number): Promise<Publisher | null>;
    save(publisher: Publisher): Promise<void>;
    delete(id: number): Promise<void>;
    update(publisher: Publisher): Promise<void>;
}
