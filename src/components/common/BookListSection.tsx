import { useQuery } from "@tanstack/react-query";
import BookCard from "./BookCard";
import { Book } from "@/types"; 

interface BookListResponse {
  success: boolean;
  message: string;
  data: {
    books: Book[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface BookListSectionProps {
  selectedCategory?: string; // Bikin opsional
  searchQuery?: string;      // Tambahkan prop pencarian
}

export const BookListSection = ({ selectedCategory, searchQuery }: BookListSectionProps) => {
  const { data, isLoading, isError } = useQuery<BookListResponse>({
    // Query key kita buat dinamis agar React Query me-refresh data kalau kategori/search berubah
    queryKey: ["books", selectedCategory, searchQuery],
    queryFn: async () => {
      // Clean Code: Gunakan URLSearchParams agar URL rapi otomatis
      const params = new URLSearchParams();
      
      if (selectedCategory) params.append("category", selectedCategory);
      // Sesuaikan key "search" ini dengan endpoint API backend-mu (bisa "search" atau "q")
      if (searchQuery) params.append("search", searchQuery); 

      const queryString = params.toString();
      const url = `/api/books${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center w-full py-10 md:py-20">
        <span className="animate-pulse font-semibold text-[#414651] font-['Quicksand']">
          Memuat daftar buku...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex justify-center py-10 text-[#EE1D52] font-['Quicksand']">
        Gagal memuat buku. Silakan coba lagi.
      </div>
    );
  }

  const books = data?.data?.books || [];

  return (
    <div className="w-full mt-4 md:mt-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-[20px]">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-[#414651] font-['Quicksand'] font-medium">
            Tidak ada buku yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListSection;