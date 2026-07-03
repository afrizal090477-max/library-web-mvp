import { BookDetail } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Description } from './Description';

interface BookInfoProps {
  book: BookDetail;
  // PERBAIKAN 1: Tambahkan definisi tipe untuk kedua fungsi
  onAddToCart: () => void;
  onBorrowNow: () => void;
}

// PERBAIKAN 2: Terima props onAddToCart dan onBorrowNow
export const BookInfo = ({ book, onAddToCart, onBorrowNow }: BookInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[337px_1fr] gap-[36px] w-full">
      {/* Kolom Kiri: Gambar */}
      <div className="w-full h-[498px] bg-[#E9EAEB] flex items-center justify-center rounded-lg overflow-hidden">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="object-cover w-full h-full" 
        />
      </div>
      
      {/* Kolom Kanan: Detail & Deskripsi */}
      <div className="flex flex-col gap-[20px]">
        <Badge variant="outline" className="w-fit text-sm font-bold border-[#D5D7DA]">
          {book.category?.name || 'Uncategorized'}
        </Badge>
        
        <h1 className="text-[28px] font-bold text-[#0A0D12] leading-[38px]">{book.title}</h1>
        <p className="text-[16px] font-semibold text-[#414651]">
          {typeof book.author === 'object' ? book.author?.name : book.author}
        </p>
        
        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <span className="text-[#FFAB0D] text-[24px]">★</span>
          <span className="font-bold text-[16px] text-[#181D27]">{book.rating}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-[40px] border-y border-[#D5D7DA] py-[20px]">
          <div className="flex flex-col">
            <span className="font-bold text-[24px] text-[#0A0D12]">{book.availableCopies}</span>
            <span className="text-[16px] text-[#0A0D12]">Stock</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[24px] text-[#0A0D12]">{book.rating}</span>
            <span className="text-[16px] text-[#0A0D12]">Rating</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[24px] text-[#0A0D12]">{book.reviewCount}</span>
            <span className="text-[16px] text-[#0A0D12]">Reviews</span>
          </div>
        </div>

        {/* Description */}
        <Description text={book.description} />

        {/* Buttons */}
        <div className="flex gap-[12px] mt-2">
           {/* PERBAIKAN 3: Pasang onClick ke tombol */}
           <button 
              onClick={onAddToCart}
              className="w-full md:w-[200px] h-[48px] border border-[#D5D7DA] rounded-[100px] font-bold text-[16px] hover:bg-gray-50 transition-colors"
           >
              Add to Cart
           </button>
           <button 
              onClick={onBorrowNow}
              className="w-full md:w-[200px] h-[48px] bg-[#1C65DA] text-white rounded-[100px] font-bold text-[16px] hover:bg-blue-700 transition-colors"
           >
              Borrow Book
           </button>
        </div>
      </div>
    </div>
  );
};