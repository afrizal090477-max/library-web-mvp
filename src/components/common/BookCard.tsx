import { Book } from "@/types";
import { Star } from "lucide-react"; 

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const bookRating = book.rating ?? 0.0;
  
  const isInvalidCover = !book.coverImage || book.coverImage.startsWith("blob:");
  const finalCoverImage = isInvalidCover ? "/placeholder-book.png" : book.coverImage;
  const authorName = typeof book.author === 'object' ? book.author?.name : book.author;

  return (
    // DIKEMBALIKAN KE DIV, BUKAN LINK LAGI
    <div className="flex flex-col items-start p-0 w-full max-w-[172px] md:max-w-[224px] bg-[#FFFFFF] border border-transparent rounded-[12px] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] font-['Quicksand'] transition-transform hover:scale-[1.02] cursor-pointer flex-shrink-0 mx-auto">
      
      {/* Frame Gambar: 172px x 258px (Mobile) | 224px x 336px (Desktop) */}
      <div className="w-full h-[258px] md:h-[336px] bg-[#E0ECFF] flex-shrink-0 rounded-t-[12px] overflow-hidden">
        <img
          src={finalCoverImage} 
          alt={book.title}
          className="object-cover w-full h-full"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = "/placeholder-book.png"; }}
        />
      </div>

      {/* Frame Detail (Bawah): Tinggi disesuaikan setelah tombol dihapus (112px Mobile) */}
      <div className="flex flex-col items-start p-[12px] md:p-[16px] gap-[2px] md:gap-[4px] w-full h-[112px] md:h-[132px] rounded-b-[12px]">
        
        {/* Book Name */}
        <h3 
          className="w-full font-bold text-[14px] leading-[28px] md:text-[18px] md:leading-[32px] text-[#181D27] truncate"
          title={book.title}
        >
          {book.title}
        </h3>
        
        {/* Author Name */}
        <p 
          className="w-full font-medium text-[14px] leading-[28px] md:text-[16px] text-[#414651] truncate"
          title={authorName || 'Unknown Author'}
        >
          {authorName || "Unknown Author"}
        </p>

        {/* Rating Area */}
        <div className="flex flex-row items-center gap-[2px] w-full mt-auto">
          <div className="flex items-center justify-center w-[24px] h-[24px] md:w-[28px] md:h-[28px]">
             <Star className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] fill-[#FFAB0D] text-[#FFAB0D]" />
          </div>
          <span className="font-semibold text-[14px] md:text-[16px] leading-[28px] text-[#181D27]">
            {bookRating > 0 ? bookRating.toFixed(1) : "0.0"}
          </span>
        </div>
        
      </div>
    </div>
  );
};

export default BookCard;