import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { Search, Star } from 'lucide-react';

interface Review {
  id: number;
  star: number; 
  comment: string | null; 
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
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem('token');
  const { data: reviews = [], isLoading: loading } = useQuery<Review[]>({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      if (!token) return [];
      const response = await fetch('https://library-backend-production-b9cf.up.railway.app/api/me/reviews?page=1&limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const json = await response.json();
      if (json.success && json.data && Array.isArray(json.data.reviews)) {
        return json.data.reviews;
      }
      return [];
    },
    enabled: !!token, 
  });

  const filteredReviews = reviews.filter(review => 
    review.book?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="flex flex-col gap-[16px] w-full mt-2">
        {loading ? (
          <div className="w-full text-center py-10 font-bold text-[#1C65DA] animate-pulse">
            Memuat riwayat review...
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="flex flex-col p-[16px] md:p-[20px] gap-[16px] w-full bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px] hover:scale-[1.01] transition-transform">
              
              <div className="font-semibold text-[14px] md:text-[16px] text-[#0A0D12]">
                {formatDate(review.createdAt)}
              </div>
              
              <div className="w-full border-t border-[#D5D7DA]"></div>
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