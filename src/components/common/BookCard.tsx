import { Book } from "@/types";
import { Card } from "@/components/ui/card";
import { Star, Plus } from "lucide-react"; // Import ikon Plus
import { useAppDispatch } from "@/hooks/useAppDispatch"; // Pastikan import hook ini
import { addLoanItem } from "@/features/loans/loanSlice"; // Import action-nya
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const dispatch = useAppDispatch(); // Inisialisasi dispatch
  const bookRating = book.rating ?? 4.9;
  const isInvalidCover = !book.coverImage || book.coverImage.startsWith("blob:");
  const finalCoverImage = isInvalidCover ? "/placeholder-book.png" : book.coverImage;

  return (
    <Card className="flex flex-col items-start p-0 w-full max-w-[172px] md:max-w-[224px] h-[420px] md:h-[520px] bg-[#FFFFFF] border-0 rounded-[12px] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] font-['Quicksand'] transition-all hover:scale-[1.02] overflow-hidden flex-shrink-0 mx-auto">
      
      {/* Image Container */}
      <div className="w-full h-[258px] md:h-[336px] bg-slate-100 flex-shrink-0 rounded-t-[12px] overflow-hidden">
        <img
          src={finalCoverImage} 
          alt={book.title}
          className="object-cover w-full h-full"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = "/placeholder-book.png"; }}
        />
      </div>

      {/* Text & Button Container */}
      <div className="flex flex-col items-start p-[12px] gap-[2px] md:p-[16px] md:gap-[4px] w-full flex-1">
        <h3 className="w-full font-bold text-[14px] leading-[28px] md:text-[18px] md:leading-[32px] text-[#181D27] truncate">
          {book.title}
        </h3>
        <p className="w-full font-medium text-[14px] md:text-[16px] text-[#414651] truncate">
          {book.author?.name || "Unknown Author"}
        </p>

        <div className="flex flex-row items-center gap-[2px] w-full mt-auto">
          <Star className="w-[18px] h-[18px] fill-[#FFAB0D] stroke-[#FFAB0D]" />
          <span className="font-semibold text-[14px] text-[#181D27]">
            {bookRating.toFixed(1)}
          </span>
        </div>

        {/* Tombol Pinjam - Clean Code */}
        <Button 
          onClick={() => dispatch(addLoanItem(book))}
          className="w-full mt-3 h-[40px] bg-[#1C65DA] hover:bg-[#1652b4] text-white font-bold rounded-lg flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Pinjam
        </Button>
      </div>
    </Card>
  );
};

export default BookCard;