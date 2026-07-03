import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book as BookIcon } from 'lucide-react';
import { BookCard } from '@/components/common/BookCard';
import { Book, Author } from '@/types';
import { getBooks } from '@/lib/api'; 

// 1. Tipe baru biar bebas dari 'any'
type AuthorWithDetails = Author & {
  avatar?: string;
  booksCount?: number;
};

// 2. Interface Response API
interface SearchApiResponse {
  data?: {
    books?: Book[];
  };
  books?: Book[];
}

export default function AuthorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State menggunakan tipe baru
  const [author, setAuthor] = useState<AuthorWithDetails | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchAuthorData = async () => {
      setIsLoading(true);
      try {
        const response = (await getBooks({})) as SearchApiResponse;
        const allBooks = response?.data?.books || response?.books || [];
        
        const authorBooks = allBooks.filter((b: Book) => 
           (typeof b.author === 'object' ? String(b.author.id) === id : String(b.author) === id)
        );

        setBooks(authorBooks);

        if (authorBooks.length > 0) {
          const authorInfo = authorBooks[0].author;
          if (typeof authorInfo === 'object') {
            setAuthor({
              ...authorInfo,
              booksCount: authorBooks.length, 
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorInfo.name)}&background=F6F9FE&color=1C65DA&size=200`
            });
          } else {
            setAuthor({
              id: Number(id),
              name: String(authorInfo),
              booksCount: authorBooks.length,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(String(authorInfo))}&background=F6F9FE&color=1C65DA&size=200`
            });
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data author:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAuthorData();
    }
  }, [id]);

  // 3. Kita HAPUS bungkus <MainLayout> karena routingmu pakai Outlet
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="font-semibold text-[#1C65DA] animate-pulse">Memuat data author...</span>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
        <span className="font-semibold text-[#A4A7AE]">Author tidak ditemukan.</span>
        <button onClick={() => navigate(-1)} className="text-[#1C65DA] font-bold underline">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20 font-['Quicksand']">
      <div className="w-full max-w-[1200px] mx-auto px-[16px] md:px-[0px] flex flex-col items-center md:items-start pt-[24px] md:pt-[48px] gap-[32px] md:gap-[40px]">
        
        {/* Card Author Profile */}
        <div className="flex flex-row items-center p-[12px] md:p-[16px] gap-[12px] md:gap-[16px] w-full max-w-[361px] md:max-w-full bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px]">
          
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-[60px] h-[60px] md:w-[81px] md:h-[81px] rounded-full object-cover flex-shrink-0"
          />

          <div className="flex flex-col items-start gap-[2px]">
            <h1 className="font-bold text-[16px] leading-[30px] md:text-[18px] md:leading-[32px] tracking-[-0.02em] md:tracking-[-0.03em] text-[#181D27]">
              {author.name}
            </h1>

            <div className="flex flex-row items-center gap-[6px] h-[28px] md:h-[30px]">
              <div className="w-[24px] h-[24px] bg-[#1C65DA] rounded flex items-center justify-center flex-shrink-0">
                <BookIcon className="w-[14px] h-[14px] text-white" strokeWidth={2.5} />
              </div>
              <span className="font-medium text-[14px] leading-[28px] md:text-[16px] md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                {author.booksCount || books.length} books
              </span>
            </div>
          </div>
          
        </div>

        {/* Book List Grid */}
        <div className="flex flex-col items-start gap-[16px] md:gap-[32px] w-full max-w-[361px] md:max-w-full">
          
          <h2 className="font-bold text-[24px] leading-[36px] md:text-[36px] md:leading-[44px] md:tracking-[-0.02em] text-[#0A0D12]">
            Book List
          </h2>

          {books.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[16px] md:gap-[20px] w-full">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-10 text-[#A4A7AE] font-medium">
              Belum ada buku yang tersedia untuk author ini.
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}