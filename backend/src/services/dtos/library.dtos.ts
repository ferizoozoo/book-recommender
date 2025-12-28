import { UserDto } from "./auth.dtos";

export type AuthorDto = {
  id?: number;
  bio: string;
  image: string;
  user?: UserDto;
};

export type PublisherDto = {
  id?: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type BookDto = {
  id?: number;
  title: string;
  isbn: string;
  author: AuthorDto;
  publisher: PublisherDto;
  authorId: number;
  publisherId: number;
  publishedDate: Date;
  description: string;
  quantity: number;
  year?: number;
  image?: string;
  labels: string[];
};

export type BookUpdateDto = {
  id: number;
  title?: string;
  isbn?: string;
  authorId?: number;
  publisherId?: number;
  publishedDate?: Date;
  description?: string;
  quantity?: number;
  year?: number;
  image?: string;
  labels: string[];
};

export type ReviewDto = {
  id?: number;
  book: BookDto;
  user: UserDto;
  rating: number;
  review: string;
};

export type LikeDto = {
  id?: number;
  book: BookDto;
  user: UserDto;
};

export type UserBookDto = {
  id?: number;
  user: UserDto;
  book: BookDto;
};
