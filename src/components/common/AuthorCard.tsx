import { useState } from "react";
import { Book } from "lucide-react";

export interface Author {
  id: string | number;
  name: string;
  profileImage?: string;
  totalBooks?: number;
}

interface AuthorCardProps {
  author: Author;
}

export const AuthorCard = ({ author }: AuthorCardProps) => {
  const [imageError, setImageError] = useState(false);
  const bookCount = author.totalBooks ?? 5;
  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    // PERBAIKAN: md:w-[285px] dihapus, cukup w-full agar mengikuti grid
    <div className="flex flex-row items-center p-[12px] md:p-[16px] gap-[12px] md:gap-[16px] w-full h-[84px] md:h-[113px] bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[12px] transition-all hover:scale-[1.02] cursor-pointer box-border">
      
      <div className="w-[60px] h-[60px] md:w-[81px] md:h-[81px] bg-[#E0ECFF] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
        {author.profileImage && !imageError ? (
          <img
            src={author.profileImage}
            alt={author.name}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={() => setImageError(true)} 
          />
        ) : (
          <span className="font-['Quicksand'] font-bold text-[#1C65DA] text-[20px] md:text-[28px]">
            {getInitials(author.name)}
          </span>
        )}
      </div>

      {/* PERBAIKAN: w-[108px] diganti jadi flex-1 min-w-0 */}
      <div className="flex flex-col items-start justify-center gap-[2px] flex-1 min-w-0 h-[60px] md:h-[64px]">
        
        <h3 className="w-full font-['Quicksand'] font-bold text-[16px] leading-[30px] tracking-[-0.02em] md:text-[18px] md:leading-[32px] md:tracking-[-0.03em] text-[#181D27] truncate block">
          {author.name}
        </h3>
        
        <div className="flex flex-row items-center gap-[6px] w-full h-[28px] md:h-[30px]">
          <Book className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#1C65DA] flex-shrink-0" />
          <span className="font-['Quicksand'] font-medium text-[14px] leading-[28px] md:text-[16px] md:leading-[30px] tracking-[-0.03em] text-[#0A0D12] truncate block">
            {bookCount} books
          </span>
        </div>

      </div>
    </div>
  );
};

export default AuthorCard;