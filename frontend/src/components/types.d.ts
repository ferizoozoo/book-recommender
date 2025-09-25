export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
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
  year: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
