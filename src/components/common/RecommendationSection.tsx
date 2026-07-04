import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import { Book } from "@/types";

interface BookListResponse {
  success: boolean;
  message: string;
  data: {
    books: Book[];
    pagination: { page: number; totalPages: number };
  };
}

export const RecommendationSection = ({ selectedCategory }: { selectedCategory: string }) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useInfiniteQuery<BookListResponse>({
      queryKey: ["recommendations", selectedCategory],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const cat = selectedCategory ? `&categoryId=${selectedCategory}` : "";
        const res = await fetch(`https://library-backend-production-b9cf.up.railway.app/api/books/recommend?page=${pageParam}&limit=10${cat}`);
        return res.json();
      },
      getNextPageParam: (last) => last.data.pagination.page < last.data.pagination.totalPages 
        ? last.data.pagination.page + 1 : undefined,
    });

  const allBooks = data?.pages.flatMap((p) => p.data.books) || [];
  if (isLoading) return <div className="py-10 text-center">Memuat rekomendasi...</div>;
  if (isError) return <div className="py-10 text-center text-red-500">Gagal memuat.</div>;

  return (
    <section className="flex flex-col items-center w-full max-w-[1200px] gap-[40px] font-['Quicksand'] mx-auto px-4 md:px-0">
      {/* Title */}
      <div className="w-full text-left">
        <h2 className="font-bold text-[24px] md:text-[36px] leading-[44px] text-[#0A0D12]">
          Recommendation
        </h2>
      </div>

      {/*  Gunakan Grid agar pas 5 kolom di desktop (lg) dan 2 kolom di mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[16px] md:gap-[20px] w-full justify-items-center">
        {allBooks.map((book) => (
          <Link 
            key={book.id} 
            to={`/books/${book.id}`} 
            className="w-full flex justify-center transition-transform hover:scale-[1.02] active:scale-95"
          >
            <BookCard book={book} />
          </Link>
        ))}
      </div>

      {/* Button Load More */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="flex justify-center items-center px-[24px] py-[8px] w-[150px] md:w-[200px] h-[40px] md:h-[48px] border border-[#D5D7DA] rounded-[100px] bg-white hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </span>
        </button>
      )}
    </section>
  );
};

export default RecommendationSection;