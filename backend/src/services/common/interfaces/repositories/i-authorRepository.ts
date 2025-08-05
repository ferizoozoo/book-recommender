import { Author } from "../../../../domain/library/author.entity.ts";

export interface IAuthorRepository {
    getById(id: number): Promise<Author | null>;
    getAll(): Promise<Author[]>;
    getByUserId(userId: number): Promise<Author | null>;
    save(author: Author): Promise<void>;
    delete(id: number): Promise<void>;
    update(author: Author): Promise<void>;
}
