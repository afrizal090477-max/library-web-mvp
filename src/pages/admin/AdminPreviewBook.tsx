import { useState, useEffect } from "react";
import { ArrowLeft, Star, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export interface BookDetail {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  totalPages: number;
  rating: number;
  reviewCount?: number;
  author?: { name: string };
  category?: { name: string };
}

export function AdminPreviewBook() {
  const { id } = useParams();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/books/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data buku");
        const json = await res.json();
        const bookData = json.data?.book || json.data;
        setBook(bookData);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan sistem");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchBookDetail();
  }, [id]);
  if (isLoading) {
    return <div className="p-12 text-center text-[#535862] font-quicksand animate-pulse text-lg">Memuat detail buku...</div>;
  }
  if (error || !book) {
    return <div className="p-12 text-center font-bold text-[#EE1D52] font-quicksand text-lg">{error || "Buku tidak ditemukan"}</div>;
  }

  const MAX_LENGTH = 75;
  const descriptionText = book.description || "Tidak ada deskripsi untuk buku ini.";
  const shouldTruncate = descriptionText.length > MAX_LENGTH;

  return (
    <div className="w-full bg-white relative pb-28 md:pb-12 min-h-[calc(100vh-80px)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-0 pt-6 sm:pt-[48px]">
        <div className="flex items-center gap-3 w-full mb-6 sm:mb-[32px]">
          <Link to="/admin/books" className="text-[#1E1E1E] hover:opacity-70 transition-opacity">
            <ArrowLeft size={32} />
          </Link>
          <h1 className="text-[20px] sm:text-[28px] font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em] sm:tracking-[-0.03em] leading-[34px] sm:leading-[38px]">
            Preview Book
          </h1>
        </div>


        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-[36px] w-full">
          <div className="bg-[#E9EAEB] p-[5.29px] sm:p-[8px] flex shrink-0 justify-center items-center w-[222.75px] h-[328.83px] sm:w-[337px] sm:h-[498px] mx-auto md:mx-0">
            <img 
              src={book.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=1C65DA&color=fff`} 
              alt={book.title}
              className="w-[212.18px] h-[318.26px] sm:w-[321px] sm:h-[482px] object-cover shadow-sm"
            />
          </div>

          <div className="flex flex-col flex-1 w-full max-w-[827px] gap-[16px] sm:gap-[20px]">
            
            <div className="flex flex-col gap-3 sm:gap-[22px]">
              <div className="flex flex-col gap-1 sm:gap-1">
                <div className="border border-[#D5D7DA] rounded-[6px] px-2 h-[28px] flex items-center justify-center w-fit mb-1">
                  <span className="text-[14px] font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">
                    {book.category?.name || "Uncategorized"}
                  </span>
                </div>
                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em] leading-[36px] sm:leading-[38px]">
                  {book.title}
                </h2>
                <p className="text-[14px] sm:text-[16px] font-semibold text-[#414651] font-quicksand tracking-[-0.02em] sm:tracking-[-0.03em] leading-[28px] sm:leading-[30px]">
                  {book.author?.name || "Unknown Author"}
                </p>
                <div className="flex items-center gap-[2px] mt-1 sm:mt-[2px]">
                  <Star size={24} className="text-[#FFAB0D] fill-[#FFAB0D]" />
                  <span className="text-[16px] font-bold text-[#181D27] font-quicksand tracking-[-0.02em] leading-[30px]">
                    {book.rating || "0.0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[20px] h-[60px] sm:h-[66px] mt-2 sm:mt-0">
              <div className="flex flex-col w-[94px] sm:w-[102px]">
                <span className="text-[18px] sm:text-[24px] font-bold text-[#0A0D12] font-quicksand tracking-[-0.03em] leading-[32px] sm:leading-[36px]">
                  {book.totalPages || 0}
                </span>
                <span className="text-[14px] sm:text-[16px] font-medium text-[#0A0D12] font-quicksand tracking-[-0.03em] leading-[28px] sm:leading-[30px]">
                  Page
                </span>
              </div>
              <div className="h-[60px] sm:h-[66px] w-px bg-[#D5D7DA]"></div>
              <div className="flex flex-col w-[94px] sm:w-[102px]">
                <span className="text-[18px] sm:text-[24px] font-bold text-[#0A0D12] font-quicksand tracking-[-0.03em] leading-[32px] sm:leading-[36px]">
                  {book.rating || "0.0"}
                </span>
                <span className="text-[14px] sm:text-[16px] font-medium text-[#0A0D12] font-quicksand tracking-[-0.03em] leading-[28px] sm:leading-[30px]">
                  Rating
                </span>
              </div>
              <div className="h-[60px] sm:h-[66px] w-px bg-[#D5D7DA]"></div>
              <div className="flex flex-col w-[94px] sm:w-[102px]">
                <span className="text-[18px] sm:text-[24px] font-bold text-[#0A0D12] font-quicksand tracking-[-0.03em] leading-[32px] sm:leading-[36px]">
                  {book.reviewCount || 0}
                </span>
                <span className="text-[14px] sm:text-[16px] font-medium text-[#0A0D12] font-quicksand tracking-[-0.03em] leading-[28px] sm:leading-[30px]">
                  Reviews
                </span>
              </div>
            </div>

            <div className="w-full max-w-[559px] h-px bg-[#D5D7DA] my-1 sm:my-0"></div>
            <div className="flex flex-col gap-1 sm:gap-[4px]">
              <h3 className="text-[20px] font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em] leading-[34px]">
                Description
              </h3>
              <p className="text-[14px] sm:text-[16px] font-medium text-[#0A0D12] font-quicksand tracking-[-0.03em] leading-[28px] sm:leading-[30px] max-w-[827px]">
                {isExpanded || !shouldTruncate 
                  ? descriptionText 
                  : `${descriptionText.substring(0, MAX_LENGTH)}...`}
                
                {shouldTruncate && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="text-[#1C65DA] font-bold ml-1 hover:underline outline-none"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            </div>

            <div className="hidden md:flex flex-row gap-[12px] mt-4">
              <button 
                onClick={() => alert("Masuk keranjang bos!")}
                className="w-[200px] h-[48px] border border-[#D5D7DA] rounded-[100px] flex justify-center items-center font-bold text-[16px] text-[#0A0D12] font-quicksand tracking-[-0.02em] hover:bg-gray-50 transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => alert("Buku langsung dipinjam!")}
                className="w-[200px] h-[48px] bg-[#1C65DA] rounded-[100px] flex justify-center items-center font-bold text-[16px] text-white font-quicksand tracking-[-0.02em] hover:bg-[#1C65DA]/90 transition-colors"
              >
                Borrow Book
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)] flex items-center justify-between px-[16px] gap-[12px] z-50">
        <button 
          onClick={() => alert("Masuk keranjang!")}
          className="flex-1 h-[40px] border border-[#D5D7DA] rounded-[100px] flex justify-center items-center font-bold text-[14px] text-[#0A0D12] font-quicksand tracking-[-0.02em] active:bg-gray-50 transition-colors"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => alert("Pinjam!")}
          className="flex-1 h-[40px] bg-[#1C65DA] rounded-[100px] flex justify-center items-center font-bold text-[14px] text-white font-quicksand tracking-[-0.02em] active:bg-[#1C65DA]/90 transition-colors"
        >
          Borrow Book
        </button>
        <button className="w-[40px] h-[40px] border border-[#D5D7DA] rounded-[100px] flex justify-center items-center shrink-0 active:bg-gray-50 transition-colors">
          <Share2 size={20} className="text-[#0A0D12]" />
        </button>
      </div>

    </div>
  );
}