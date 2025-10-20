export type AuthorDto = {
  id?: number;
  bio: string;
  image: string;
};

export type PublisherDto = {
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
  authorId: number;
  publisherId: number;
  publishedDate: Date;
  description: string;
  quantity: number;
  labels: string[];
};
