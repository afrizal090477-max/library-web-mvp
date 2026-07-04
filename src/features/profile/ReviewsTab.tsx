import { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';

// Interface sudah disesuaikan 100% dengan JSON API
interface Review {
  id: number;
  star: number; // API pakai 'star'
  comment: string | null; // API bisa me-return null
  createdAt: string; 
  book: {
    id: number;
    title: string;
    coverImage: string;
    author: {
      id: number;
      name: string;
    };
    category: {
      id: number;
      name: string;
    };
  };
}

export function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMyReviews = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // 🚀 Panggil API beneran ke backend (URL SUDAH DIPERBAIKI)
        const response = await fetch('https://library-backend-production-b9cf.up.railway.app/api/me/reviews?page=1&limit=20', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const json = await response.json();
        
        // Ambil array dari json.data.reviews sesuai struktur API kamu
        if (json.success && json.data && Array.isArray(json.data.reviews)) {
          setReviews(json.data.reviews);
        } else {
          setReviews([]);
        }
        
      } catch (error) {
        console.error("Gagal mengambil data review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, []);

  // Fitur Filter Search lokal
  const filteredReviews = reviews.filter(review => 
    review.book?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format tanggal (contoh: "2026-07-02T09:19:11.699Z" -> "2 July 2026, 09:19")
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col items-start gap-[16px] md:gap-[24px] w-full animate-in fade-in duration-300">
      
      <h2 className="font-bold text-[24px] md:text-[28px] text-[#0A0D12]">Reviews</h2>
      
      <div className="flex flex-row items-center px-[16px] py-[8px] gap-[6px] w-full md:max-w-[544px] h-[44px] bg-white border border-[#D5D7DA] rounded-[9999px] focus-within:border-[#1C65DA] transition-colors">
        <Search className="w-[20px] h-[20px] text-[#535862] flex-shrink-0" />
        <input 
          type="text" 
          placeholder="Search book" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none font-medium text-[14px] text-[#535862]" 
        />
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-[16px] w-full mt-2">
        {loading ? (
          <div className="w-full text-center py-10 font-bold text-[#1C65DA] animate-pulse">
            Memuat riwayat review...
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="flex flex-col p-[16px] md:p-[20px] gap-[16px] w-full bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px] hover:scale-[1.01] transition-transform">
              
              {/* Tanggal */}
              <div className="font-semibold text-[14px] md:text-[16px] text-[#0A0D12]">
                {formatDate(review.createdAt)}
              </div>
              
              <div className="w-full border-t border-[#D5D7DA]"></div>
              
              {/* Info Buku */}
              <div className="flex flex-row items-center gap-[12px] md:gap-[16px] w-full">
                <img 
                  src={review.book?.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200"} 
                  alt={review.book?.title} 
                  className="w-[70px] h-[106px] md:w-[92px] md:h-[138px] object-cover rounded-sm flex-shrink-0" 
                />
                <div className="flex flex-col items-start gap-[4px] flex-1">
                  <div className="border border-[#D5D7DA] rounded-[6px] px-[8px] h-[28px] flex items-center justify-center">
                    <span className="font-bold text-[14px] text-[#0A0D12] line-clamp-1">
                      {review.book?.category?.name || 'Category'}
                    </span>
                  </div>
                  <h3 className="font-bold text-[16px] md:text-[20px] text-[#0A0D12] line-clamp-1">
                    {review.book?.title}
                  </h3>
                  <p className="font-medium text-[14px] text-[#414651] line-clamp-1">
                    {review.book?.author?.name || 'Unknown Author'}
                  </p>
                </div>
              </div>

              <div className="w-full border-t border-[#D5D7DA]"></div>
              
              {/* Bintang & Komentar */}
              <div className="flex flex-col items-start gap-[8px] w-full">
                <div className="flex flex-row items-center gap-[2px]">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <Star 
                      key={starNum} 
                      className={`w-[20px] h-[20px] md:w-[24px] md:h-[24px] ${
                        starNum <= review.star 
                          ? 'fill-[#FFAB0D] text-[#FFAB0D]' 
                          : 'fill-[#E9EAEB] text-[#E9EAEB]'
                      }`} 
                    />
                  ))}
                </div>
                {/* Handle komentar null */}
                <p className={`font-semibold text-[14px] md:text-[16px] leading-[28px] ${review.comment ? 'text-[#0A0D12]' : 'text-[#A4A7AE] italic'}`}>
                  {review.comment ? review.comment : "Tidak ada teks ulasan."}
                </p>
              </div>
              
            </div>
          ))
        ) : (
          <div className="w-full text-center py-10 font-medium text-[#A4A7AE]">
            {searchQuery ? "Ulasan tidak ditemukan." : "Belum ada riwayat ulasan."}
          </div>
        )}
      </div>

    </div>
  );
}