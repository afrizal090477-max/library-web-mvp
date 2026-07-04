import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/common/HeroSection";
import CategorySection from "@/components/common/CategorySection";
import RecommendationSection from "@/components/common/RecommendationSection"; 
import { PopularAuthorsSection } from "@/components/common";

// 🚀 FIX 1: Perbarui interface Book untuk antisipasi properti cover atau coverImage
interface Book {
  id: string | number;
  title: string;
  coverImage?: string;
  cover?: string;
  category?: string | { id?: number | string; name?: string }; 
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    books: Book[];
    pagination: {
      page: number;
      totalPages: number;
    };
  };
}

export const Home = () => {
  const [activeCategory, setActiveCategory] = useState<string>("");

  const { data: apiResponse } = useQuery<ApiResponse>({
    queryKey: ["recommendedBooksBanner"],
    queryFn: async () => {
      // 🚀 FIX 2: Paksa kasih parameter page=1 & limit=5 biar API Henry ngasih data!
      const response = await fetch("https://library-backend-production-b9cf.up.railway.app/api/books/recommend?page=1&limit=5");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const recommendedBooks = apiResponse?.data?.books || [];
  
  // 🚀 FIX 3: Ambil URL gambar dengan aman dan saring (filter) buku yang gak ada gambarnya
  const bannerCovers = Array.isArray(recommendedBooks) 
    ? recommendedBooks
        .map((book) => book.coverImage || book.cover)
        .filter(Boolean) as string[] // Buang yang isinya undefined/kosong biar banner gak error
    : [];

  const handleSelectCategory = (categoryName: string) => {
    setActiveCategory((prev) => prev === categoryName ? "" : categoryName);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto min-h-screen bg-[#FFFFFF] relative pt-[24px] md:pt-[40px] pb-[80px] overflow-x-hidden">
      <div className="mx-auto w-full md:max-w-[1200px] flex flex-col items-center md:items-start gap-[24px] md:gap-[48px] px-4 md:px-0">
        
        {/* Banner sekarang hanya menerima array string URL gambar yang valid */}
        <HeroSection covers={bannerCovers} />
        
        <CategorySection activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
        <RecommendationSection selectedCategory={activeCategory} />
        <PopularAuthorsSection />
        
      </div>
    </div>
  );
};

export default Home;