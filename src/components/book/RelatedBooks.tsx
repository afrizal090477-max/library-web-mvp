import { Book } from "@/types";
import BookCard from "../common/BookCard";
import { Link } from "react-router-dom";

export const RelatedBooks = ({ books }: { books: Book[] }) => {
  if (!books || books.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-[20px] md:gap-[40px]">
      <h2 className="text-[24px] md:text-[36px] font-bold text-[#0A0D12] tracking-[-0.02em]">
        Related Books
      </h2>
      <div className="flex flex-row flex-wrap justify-start gap-[16px] md:gap-[20px]">
        {books.map((book) => (
          <div 
            key={book.id} 
            className="w-[calc(50%-8px)] md:w-[calc(20%-16px)]" 
          >
            <Link to={`/books/${book.id}`}>
              <BookCard book={book} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};