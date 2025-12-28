import { User } from "../../../domain/auth/user.entity";
import { Author } from "../../../domain/library/author.entity";
import { Book } from "../../../domain/library/book.entity";
import { Like } from "../../../domain/library/like.entity";
import { Publisher } from "../../../domain/library/publisher.entity";
import { Review } from "../../../domain/library/review.entity";
import { ReviewEntity } from "../../../infrastructure/database/typeorm/models/library.models";
import {
  mapUserDomainToModel,
  mapUserEntityToDomain,
} from "../../../infrastructure/database/typeorm/models/mappers/auth.mapper";
import { mapBookEntityToDomain } from "../../../infrastructure/database/typeorm/models/mappers/library.mapper";
import {
  AuthorDto,
  BookDto,
  LikeDto,
  PublisherDto,
  ReviewDto,
} from "../library.dtos";
import { mapUserDomainToDto, mapUserDtoToDomain } from "./auth.mapper";

export function mapAuthorDomainToDto(author: Author): AuthorDto {
  const authorEntity = {} as AuthorDto;
  // Only set ID if it exists and is a positive number
  if (typeof author.id === "number" && author.id > 0) {
    authorEntity.id = author.id;
  }
  authorEntity.bio = author.bio;
  authorEntity.image = author.image;

  // Map the user if it exists
  authorEntity.user = mapUserDomainToDto(author.user);

  return authorEntity;
}

export function mapAuthorDtoToDomain(authorDto: AuthorDto): Author {
  const author = new Author(
    authorDto.id,
    authorDto.bio,
    authorDto.image,
    [], // Books will be populated separately if needed
    authorDto.user ? mapUserDtoToDomain(authorDto.user) : new User()
  );

  return author;
}

export function mapBookDomainToDto(book: Book): BookDto {
  const bookEntity = {} as BookDto;
  // Only set ID if it exists and is a positive number (not -1, 0, or null)
  bookEntity.id = book.id!;
  bookEntity.title = book.title;
  bookEntity.description = book.description;
  bookEntity.isbn = book.isbn;
  bookEntity.year = book.year;
  bookEntity.image = book.image;

  bookEntity.author = mapAuthorDomainToDto(book.author);

  bookEntity.publisher = mapPublisherDomainToDto(book.publisher);

  return bookEntity;
}

export function mapBookDtoToDomain(bookEntity: BookDto): Book {
  const book = new Book(
    bookEntity.id,
    bookEntity.title,
    bookEntity.author ? mapAuthorDtoToDomain(bookEntity.author) : new Author(0),
    bookEntity.description,
    bookEntity.isbn,
    bookEntity.publisher
      ? mapPublisherDtoToDomain(bookEntity.publisher)
      : new Publisher(0),
    bookEntity.year,
    bookEntity.image
  );

  return book;
}

export function mapPublisherDomainToDto(publisher: Publisher): PublisherDto {
  const publisherEntity = {} as PublisherDto;
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

export function mapPublisherDtoToDomain(
  publisherEntity: PublisherDto
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

export function mapReviewDomainToDto(
  review: Review,
  isUpdate: boolean = false
): ReviewDto {
  const reviewEntity = {} as ReviewDto;
  if (isUpdate && review.id > 0) {
    reviewEntity.id = review.id;
  }
  reviewEntity.book = mapBookDomainToDto(review.book);
  reviewEntity.user = mapUserDomainToDto(review.user);
  reviewEntity.review = review.review;
  reviewEntity.rating = review.rating;

  return reviewEntity;
}

export function mapReviewEntityToDomain(reviewEntity: ReviewDto): Review {
  const review = new Review(
    reviewEntity.id!,
    mapBookDtoToDomain(reviewEntity.book),
    mapUserDtoToDomain(reviewEntity.user),
    reviewEntity.rating,
    reviewEntity.review
  );

  return review;
}

export function mapLikeDomainToDto(
  like: Like,
  isUpdate: boolean = false
): LikeDto {
  const likeEntity = {} as LikeDto;
  if (isUpdate && like.id > 0) {
    likeEntity.id = like.id;
  }
  likeEntity.book = mapBookDomainToDto(like.book);
  likeEntity.user = mapUserDomainToDto(like.user);

  return likeEntity;
}

export function mapLikeDtoToDomain(likeEntity: LikeDto): Like {
  const like = new Like(
    likeEntity.id!,
    mapBookDtoToDomain(likeEntity.book),
    mapUserDtoToDomain(likeEntity.user)
  );

  return like;
}

export function mapLikeEntitiesToDomain(likeEntities: LikeDto[]): Like[] {
  return likeEntities
    ? likeEntities.map((entity) => mapLikeDtoToDomain(entity))
    : [];
}

export function mapBookDtosToDomain(bookEntities: BookDto[]): Book[] {
  return bookEntities
    ? bookEntities.map((entity) => mapBookDtoToDomain(entity))
    : [];
}

export function mapAuthorDtosToDomain(authorEntities: AuthorDto[]): Author[] {
  return authorEntities
    ? authorEntities.map((entity) => mapAuthorDtoToDomain(entity))
    : [];
}

export function mapPublisherDtosToDomain(
  publisherEntities: PublisherDto[]
): Publisher[] {
  return publisherEntities
    ? publisherEntities.map((entity) => mapPublisherDtoToDomain(entity))
    : [];
}

export function mapReviewDtosToDomain(reviewEntities: ReviewDto[]): Review[] {
  return reviewEntities
    ? reviewEntities.map((entity) => mapReviewEntityToDomain(entity))
    : [];
}

export function mapBookDomainsToDtos(books: Book[]): BookDto[] {
  return books ? books.map((book) => mapBookDomainToDto(book)) : [];
}

export function mapReviewDomainsToDtos(reviews: Review[]): ReviewDto[] {
  return reviews ? reviews.map((review) => mapReviewDomainToDto(review)) : [];
}

export function mapAuthorDomainsToDtos(authors: Author[]): AuthorDto[] {
  return authors ? authors.map((author) => mapAuthorDomainToDto(author)) : [];
}

export function mapPublisherDomainsToDtos(
  publishers: Publisher[]
): PublisherDto[] {
  return publishers
    ? publishers.map((publisher) => mapPublisherDomainToDto(publisher))
    : [];
}
