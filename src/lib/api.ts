import {
  Book,
  BookDetail,
  Author,
  Category,
  User,
  BorrowedBook,
  Review,
} from "@/types";

const BASE_URL = "/api";

const handleResponse = async <T>(res: Response): Promise<T> => {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Terjadi kesalahan pada server");
  }
  return json;
};

interface ApiResponse<T> {
  data: T;
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result =
    await handleResponse<ApiResponse<{ user: User; token: string }>>(res);
  return result.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
};

export const getBookById = async (id: number | string): Promise<BookDetail> => {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  const result = await handleResponse<ApiResponse<BookDetail>>(res);
  return result.data;
};

export const getBooks = async (params?: Record<string, string | number>) => {
  const query = params
    ? new URLSearchParams(params as Record<string, string>).toString()
    : "";
  const res = await fetch(`${BASE_URL}/books?${query}`);
  return handleResponse(res);
};

export const getBooksByCategory = async (
  categoryId: number,
  limit = 5,
): Promise<Book[]> => {
  const res = await fetch(
    `${BASE_URL}/books?category=${categoryId}&limit=${limit}`,
  );
  const result = await handleResponse<ApiResponse<{ books: unknown[] }>>(res);

  return (result.data.books || []).map((item): Book => {
    const b = item as Record<string, unknown>;
    return {
      id: Number(b.id),
      title: String(b.title),
      author: b.author as Author,
      category: b.category as Category,
      coverImage: String(b.coverImage ?? b.cover ?? ""),
      description: String(b.description ?? ""),
      stock: Number(b.stock ?? 0),
      rating: Number(b.rating ?? 0),
      reviewCount: Number(b.reviewCount ?? 0),
    };
  });
};

export const getRecommendedBooks = async (limit = 10): Promise<Book[]> => {
  const res = await fetch(`${BASE_URL}/books/recommend?limit=${limit}`);
  const result = await handleResponse<ApiResponse<{ books: Book[] }>>(res);
  return result.data.books || [];
};

export const getPopularAuthors = async (limit = 5): Promise<Author[]> => {
  const res = await fetch(`${BASE_URL}/authors/popular?limit=${limit}`);
  const result = await handleResponse<ApiResponse<{ authors: Author[] }>>(res);
  return result.data.authors || [];
};

export const getMe = async (token: string) => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const getBorrowedBooks = async (
  token?: string,
): Promise<BorrowedBook[]> => {
  const authToken = token || localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/loans/me`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });
  const result = await handleResponse<ApiResponse<BorrowedBook[]>>(res);
  return result.data || [];
};

export const getUserReviews = async (token?: string): Promise<Review[]> => {
  const authToken = token || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/reviews/me`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });
  const result = await handleResponse<ApiResponse<Review[]>>(res);
  return result.data || [];
};

export interface TopBorrowedBook {
  id: number;
  title: string;
  borrowCount: number;
  rating: number;
  availableCopies: number;
  totalCopies: number;
  author: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

export interface AdminOverviewData {
  totals: {
    users: number;
    books: number;
  };
  loans: {
    active: number;
    overdue: number;
  };
  topBorrowed: TopBorrowedBook[]; 
  generatedAt: string;
}

export const getAdminOverview = async (token?: string): Promise<AdminOverviewData> => {
  const authToken = token || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/overview`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });
  const result = await handleResponse<ApiResponse<AdminOverviewData>>(res);
  return result.data;
};