import { Author } from "../../../../../domain/library/author.entity.ts";
import { Book } from "../../../../../domain/library/book.entity.ts";
import { Publisher } from "../../../../../domain/library/publisher.entity.ts";
import { User } from "../../../../../domain/auth/user.entity.ts";
import {
  AuthorEntity,
  BookEntity,
  PublisherEntity,
  ReviewEntity,
  UserBookEntity,
} from "../library.models.ts";
import { mapUserDomainToModel, mapUserEntityToDomain } from "./auth.mapper.ts";
import { Review } from "../../../../../domain/library/review.entity.ts";
import { r } from "@faker-js/faker/dist/airline-CHFQMWko";

export function mapAuthorDomainToModel(author: Author): AuthorEntity {
  const authorEntity = new AuthorEntity();
  // Only set ID if it exists and is a positive number
  if (typeof author.id === "number" && author.id > 0) {
    authorEntity.id = author.id;
  }
  authorEntity.bio = author.bio;
  authorEntity.image = author.image;

  // Map the user if it exists
  if (author.user && author.user.id > 0) {
    authorEntity.user = mapUserDomainToModel(author.user);
  }

  return authorEntity;
}

export function mapAuthorEntityToDomain(authorEntity: AuthorEntity): Author {
  const author = new Author(
    authorEntity.id,
    authorEntity.bio,
    authorEntity.image,
    [], // Books will be populated separately if needed
    authorEntity.user ? mapUserEntityToDomain(authorEntity.user) : new User()
  );

  return author;
}

export function mapBookDomainToModel(book: Book): BookEntity {
  const bookEntity = new BookEntity();
  // Only set ID if it exists and is a positive number (not -1, 0, or null)
  if (book.id && typeof book.id === "number" && book.id > 0) {
    bookEntity.id = book.id;
  }
  bookEntity.title = book.title;
  bookEntity.description = book.description;
  bookEntity.isbn = book.isbn;
  bookEntity.year = book.year;
  bookEntity.image = book.image;

  // Map the author if it exists
  if (book.author && typeof book.author.id === "number" && book.author.id > 0) {
    bookEntity.author = mapAuthorDomainToModel(book.author);
  }

  // Map the publisher if it exists
  if (
    book.publisher &&
    typeof book.publisher.id === "number" &&
    book.publisher.id > 0
  ) {
    bookEntity.publisher = mapPublisherDomainToModel(book.publisher);
  }

  return bookEntity;
}

export function mapBookEntityToDomain(bookEntity: BookEntity): Book {
  const book = new Book(
    bookEntity.id,
    bookEntity.title,
    bookEntity.author
      ? mapAuthorEntityToDomain(bookEntity.author)
      : new Author(0),
    bookEntity.description,
    bookEntity.isbn,
    bookEntity.publisher
      ? mapPublisherEntityToDomain(bookEntity.publisher)
      : new Publisher(0),
    bookEntity.year,
    bookEntity.image
  );

  return book;
}

export function mapPublisherDomainToModel(
  publisher: Publisher
): PublisherEntity {
  const publisherEntity = new PublisherEntity();
  // Only set ID if it exists and is a positive number
  if (typeof publisher.id === "number" && publisher.id > 0) {
    publisherEntity.id = publisher.id;
  }
  publisherEntity.name = publisher.name;
  publisherEntity.address = publisher.address;
  publisherEntity.city = publisher.city;
  publisherEntity.state = publisher.state;
  publisherEntity.zip = publisher.zip;
  publisherEntity.country = publisher.country;

  return publisherEntity;
}

export function mapPublisherEntityToDomain(
  publisherEntity: PublisherEntity
): Publisher {
  const publisher = new Publisher(
    publisherEntity.id,
    publisherEntity.name,
    publisherEntity.address,
    publisherEntity.city,
    publisherEntity.state,
    publisherEntity.zip,
    publisherEntity.country,
    [] // Books will be populated separately if needed
  );

  return publisher;
}

export function mapReviewDomainToModel(
  review: Review,
  isUpdate: boolean = false
): ReviewEntity {
  const reviewEntity = new ReviewEntity();
  if (isUpdate && review.id > 0) {
    reviewEntity.id = review.id;
  }
  reviewEntity.book = mapBookDomainToModel(review.book);
  reviewEntity.user = mapUserDomainToModel(review.user);
  reviewEntity.review = review.review;
  reviewEntity.rating = review.rating;

  return reviewEntity;
}

export function mapReviewEntityToDomain(reviewEntity: ReviewEntity): Review {
  const review = new Review(
    reviewEntity.id,
    mapBookEntityToDomain(reviewEntity.book),
    mapUserEntityToDomain(reviewEntity.user),
    reviewEntity.rating,
    reviewEntity.review
  );

  return review;
}

export function mapBookEntitiesToDomain(bookEntities: BookEntity[]): Book[] {
  return bookEntities
    ? bookEntities.map((entity) => mapBookEntityToDomain(entity))
    : [];
}

export function mapAuthorEntitiesToDomain(
  authorEntities: AuthorEntity[]
): Author[] {
  return authorEntities
    ? authorEntities.map((entity) => mapAuthorEntityToDomain(entity))
    : [];
}

export function mapPublisherEntitiesToDomain(
  publisherEntities: PublisherEntity[]
): Publisher[] {
  return publisherEntities
    ? publisherEntities.map((entity) => mapPublisherEntityToDomain(entity))
    : [];
}

export function mapReviewEntitiesToDomain(
  reviewEntities: ReviewEntity[]
): Review[] {
  return reviewEntities
    ? reviewEntities.map((entity) => mapReviewEntityToDomain(entity))
    : [];
}

export function mapUserBookEntitiesToBookDomain(
  bookUser: UserBookEntity[]
): Book[] {
  return bookUser.map((userBook) => {
    const book = new Book(
      userBook.book.id,
      userBook.book.title,
      mapAuthorEntityToDomain(userBook.book.author),
      userBook.book.description,
      userBook.book.isbn,
      mapPublisherEntityToDomain(userBook.book.publisher),
      userBook.book.year,
      userBook.book.image
    );
    return book;
  });
}
