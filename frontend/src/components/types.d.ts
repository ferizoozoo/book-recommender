export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Publisher {
  id: string;
  name: string;
  address: string;
  website?: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  authorId: string;
  publisherId: string;
  publishedDate: Date;
  genre: string;
  pages: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
