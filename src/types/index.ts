export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; 
  avatar?: string;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  user: { id: number; name: string };
  rating: number;
  star: number;
  comment: string;
  createdAt: string;
}

export interface Book {
  id: number;
  title: string;
  author: Author;
  category: Category;
  coverImage: string; 
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
}

export interface BookDetail {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  stock: number;
  availableCopies: number;
  author: Author;
  category: Category;
  reviews: Review[];
}

export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  status: 'BORROWED' | 'RETURNED';
}

export interface BorrowedBook {
  id: number; // <--- UBAH DI SINI (Hapus string | nya)
  title: string;
  author: string;
  category: string;
  coverImage: string;
  borrowDate: string;
  duration: string;
  dueDate: string;
  status: "Active" | "Returned" | "Overdue" | string;
}

export interface Review {
  id: number; // <--- UBAH DI SINI (Hapus string | nya)
  bookTitle?: string;
  date: string;
  rating: number;
  comment: string;
}