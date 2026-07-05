import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
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
  const location = useLocation(); 
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient(); 
  
  const token = localStorage.getItem('token');
  const { data: book, isLoading: loadingBook } = useQuery<BookDetailType>({
    queryKey: ['book', id],
    queryFn: () => getBookById(id!),
    enabled: !!id, 
  });

  const { data: related = [] } = useQuery<Book[]>({
    queryKey: ['relatedBooks', book?.category?.id],
    queryFn: () => getBooksByCategory(book!.category!.id),
    enabled: !!book?.category?.id,
  });

  const borrowMutation = useMutation({
    mutationFn: async (bookId: number | string) => {
      const res = await fetch(`https://library-backend-production-b9cf.up.railway.app/api/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) throw new Error('Gagal meminjam buku');
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['book', id] });
      const previousBook = queryClient.getQueryData<BookDetailType>(['book', id]);
      if (previousBook) {
        queryClient.setQueryData<BookDetailType>(['book', id], {
          ...previousBook,
          stock: Math.max(0, (previousBook.stock || 0) - 1) 
        });
      }
      return { previousBook };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousBook) {
        queryClient.setQueryData(['book', id], context.previousBook);
      }
      toast.error('Gagal meminjam buku. Stok dikembalikan.');
    },
    onSuccess: () => {
      toast.success('Buku berhasil dipinjam! Cek menu My Loans.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    }
  });

  const handleAddToCart = () => {
    if (!token) {
      toast.error('Silakan login terlebih dahulu.');
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!book) return;
    
    dispatch(addToCart({
      id: book.id,
      title: book.title,
      coverImage: book.coverImage, 
      author: typeof book.author === 'string' ? book.author : "Unknown Author" 
    }));
    toast.success(`"${book.title}" berhasil dimasukkan ke keranjang! 🛒`);
  };

  const handleBorrowNow = () => {
    if (!token) {
      toast.error('Silakan login terlebih dahulu untuk meminjam buku.');
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!book) return;
    borrowMutation.mutate(book.id);
  };

  if (loadingBook) return <div className="p-10 text-center font-['Quicksand'] font-semibold text-[#1C65DA] animate-pulse">Memuat data buku...</div>;
  if (!book) return <div className="p-10 text-center font-['Quicksand'] font-semibold text-red-500">Buku tidak ditemukan.</div>;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-[16px] md:px-[150px] py-[80px] flex flex-col gap-[64px] font-['Quicksand']">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-row items-center gap-[4px] h-[28px] w-full overflow-hidden">
          <Link 
            to="/" 
            className="font-semibold text-[14px] leading-[28px] tracking-[-0.02em] text-[#1C65DA] hover:underline flex-shrink-0"
          >
            Home
          </Link>
          <ChevronRight className="w-[16px] h-[16px] text-[#0A0D12] flex-shrink-0" />
          <Link 
            to="/books" 
            className="font-semibold text-[14px] leading-[28px] tracking-[-0.02em] text-[#1C65DA] hover:underline flex-shrink-0"
          >
            {book.category?.name || "Category"}
          </Link>
          
          <ChevronRight className="w-[16px] h-[16px] text-[#0A0D12] flex-shrink-0" />
          <span className="font-semibold text-[14px] leading-[28px] tracking-[-0.02em] text-[#0A0D12] truncate block max-w-[166px] md:max-w-none">
            {book.title}
          </span>
        </div>

        <BookInfo 
          book={book} 
          onAddToCart={handleAddToCart} 
          onBorrowNow={handleBorrowNow} 
        />
      </div>
      <div className="border-t border-[#D5D7DA] pt-[64px]">
        <ReviewSection reviews={book.reviews ?? []} />
      </div>
      {related.length > 0 && (
        <div className="border-t border-[#D5D7DA] pt-[64px]">
          <RelatedBooks books={related} />
        </div>
      )}
    </div>
  );
}