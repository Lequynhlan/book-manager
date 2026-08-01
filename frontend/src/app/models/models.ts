export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Book {
  id: number;
  title: string;
  author: string | null;
  category: string | null;
  status: string | null;
  rating: number;
  description: string | null;
  coverUrl: string | null;
  link: string | null;
  startedDate: string | null;
  finishedDate: string | null;
  createdAt: string;
}

export interface BookRequest {
  title: string;
  author: string | null;
  category: string | null;
  status: string | null;
  rating: number;
  description: string | null;
  coverUrl: string | null;
  link: string | null;
  startedDate: string | null;
  finishedDate: string | null;
}

export interface ErrorResponse {
  status: number;
  message: string;
  path: string;
  timestamp: string;
  fieldErrors?: Record<string, string>;
}
