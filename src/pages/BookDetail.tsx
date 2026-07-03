// src/pages/BookDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookById, getBooksByCategory } from '@/lib/api';
import { BookDetail as BookDetailType, Book } from '@/types';
import { BookInfo } from '@/components/book/BookInfo';
import { ReviewSection } from '@/components/book/ReviewSection';
import { RelatedBooks } from '@/components/book/RelatedBooks'; 
import { ChevronRight } from 'lucide-react'; 
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/features/cart/cartSlice';
import { toast } from 'sonner';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [book, setBook] = useState<BookDetailType | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getBookById(id);
        setBook(data);
        if (data?.category?.id) {
          const relatedData = await getBooksByCategory(data.category.id);
          setRelated(relatedData);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  // LOGIKA REDUX UNTUK ADD TO CART
  const handleAddToCart = () => {
    if (!book) return;
    
    dispatch(addToCart({
      id: book.id,
      title: book.title,
      coverImage: book.coverImage, 
      author: typeof book.author === 'string' ? book.author : "Unknown Author" 
    }));
    
    toast.success(`"${book.title}" berhasil dimasukkan ke keranjang! 🛒`);
  };

  // LOGIKA REDUX UNTUK BORROW NOW
  const handleBorrowNow = () => {
    if (!book) return;

    dispatch(addToCart({
      id: book.id,
      title: book.title,
      coverImage: book.coverImage,
      author: typeof book.author === 'string' ? book.author : "Unknown Author"
    }));
    
    // Bawa ID buku ke halaman checkout
    navigate('/checkout', { state: { selectedIds: [book.id] } });
  };

  if (loading) return <div className="p-10 text-center font-['Quicksand'] font-semibold text-[#1C65DA]">Memuat data buku...</div>;
  if (!book) return <div className="p-10 text-center font-['Quicksand'] font-semibold text-red-500">Buku tidak ditemukan.</div>;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-[16px] md:px-[150px] py-[80px] flex flex-col gap-[64px] font-['Quicksand']">
      
      {/* Wrapper untuk Breadcrumb dan BookInfo dengan gap vertikal 24px */}
      <div className="flex flex-col gap-[24px]">
        
        {/* Frame 101: Breadcrumb Active Folder */}
        <div className="flex flex-row items-center gap-[4px] h-[28px] w-full overflow-hidden">
          {/* Link ke Home */}
          <Link 
            to="/" 
            className="font-semibold text-[14px] leading-[28px] tracking-[-0.02em] text-[#1C65DA] hover:underline flex-shrink-0"
          >
            Home
          </Link>
          
          <ChevronRight className="w-[16px] h-[16px] text-[#0A0D12] flex-shrink-0" />
          
          {/* Link ke Category */}
          <Link 
            to="/books" 
            className="font-semibold text-[14px] leading-[28px] tracking-[-0.02em] text-[#1C65DA] hover:underline flex-shrink-0"
          >
            {book.category?.name || "Category"}
          </Link>
          
          <ChevronRight className="w-[16px] h-[16px] text-[#0A0D12] flex-shrink-0" />
          
          {/* Judul Buku Aktif */}
          <span className="font-semibold text-[14px] leading-[28px] tracking-[-0.02em] text-[#0A0D12] truncate block max-w-[166px] md:max-w-none">
            {book.title}
          </span>
        </div>

        {/* Book Info Section - Menerima fungsi dari parent */}
        <BookInfo 
          book={book} 
          onAddToCart={handleAddToCart} 
          onBorrowNow={handleBorrowNow} 
        />
      </div>
      
      {/* Review Section */}
      <div className="border-t border-[#D5D7DA] pt-[64px]">
        <ReviewSection reviews={book.reviews ?? []} />
      </div>
      
      {/* Related Books Section */}
      {related.length > 0 && (
        <div className="border-t border-[#D5D7DA] pt-[64px]">
          <RelatedBooks books={related} />
        </div>
      )}
    </div>
  );
}