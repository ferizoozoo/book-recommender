import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./auth.models.ts";

@Entity("authors")
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => BookEntity, (book) => book.author)
  books: BookEntity[];

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}

@Entity("publishers")
export class PublisherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  country: string;

  @OneToMany(() => BookEntity, (book) => book.publisher)
  books: BookEntity[];
}

@Entity("books")
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: "int", default: 0 })
  quantity: number;

  @Column({ type: "boolean", default: false })
  available: boolean;

  @Column({
    type: "text",
    nullable: true,
    transformer: {
      to: (value: string[]) => (value ? value.join(",") : null),
      from: (value: string) => (value ? value.split(",") : []),
    },
  })
  labels: string[];

  @Column({ type: "float", default: 0 })
  rating: number;

  @Column({ type: "int", default: 0 })
  numberOfRatings: number;

  @Column({ type: "int", default: 0 })
  numberOfReviews: number;

  @ManyToOne(() => AuthorEntity, (author) => author.books)
  @JoinColumn({ name: "authorId" })
  author: AuthorEntity;

  @ManyToOne(() => PublisherEntity, (publisher) => publisher.books)
  @JoinColumn({ name: "publisherId" })
  publisher: PublisherEntity;
}
