export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  status: 'BORROWED' | 'RETURNED';
}