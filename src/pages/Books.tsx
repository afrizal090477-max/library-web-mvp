import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks } from '@/lib/api';
import { Book } from '@/types'; 
import { BookCard } from '@/components/common/BookCard';

// Pastikan interface ini ada atau di-import dari file types
interface FetchBooksResponse {
  data?: {
    books?: Book[];
  };
  books?: Book[];
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = (await getBooks({ page: 1, limit: 20 })) as FetchBooksResponse | Book[]; 
        const booksData = Array.isArray(response) 
          ? response 
          : response?.data?.books || response?.books || [];
        setBooks(booksData);
      } catch (error) {
        console.error('Gagal mengambil data buku:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter dipindahkan ke sini agar variabelnya terpakai di JSX
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author?.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-[120px]">
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0A0D12]">All Books</h1>
          <p className="text-[#6B7280]">Discover our collection of books</p>
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search books or authors..."
            value={query}
            onChange={(e) => setSearchParams({ q: e.target.value })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#1C65DA] focus:outline-none"
          />
        </div>
      </div>

      {/* Sekarang loading dan filteredBooks sudah dipakai di sini */}
      {loading ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-[320px] animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-[#6B7280]">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
}