import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/common/HeroSection";
import CategorySection from "@/components/common/CategorySection";
import RecommendationSection from "@/components/common/RecommendationSection"; 
import { PopularAuthorsSection } from "@/components/common";

interface Book {
  id: string;
  title: string;
  coverImage: string;
  category: string;
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
    queryKey: ["recommendedBooks"],
    queryFn: async () => {
      const response = await fetch("/api/books/recommend");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const recommendedBooks = apiResponse?.data?.books || [];
  const bannerCovers = Array.isArray(recommendedBooks) 
    ? recommendedBooks.map((book) => book.coverImage) 
    : [];

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    console.log("Kategori Aktif Sekarang:", slug);
  };

  return (
  // PERBAIKAN: Tambahkan overflow-x-hidden di sini
  <div className="w-full max-w-[1440px] mx-auto min-h-screen bg-[#FFFFFF] relative pt-[24px] md:pt-[40px] pb-[80px] overflow-x-hidden">
    <div className="mx-auto w-full md:max-w-[1200px] flex flex-col items-center md:items-start gap-[24px] md:gap-[48px] px-4 md:px-0">
      
      <HeroSection covers={bannerCovers} />
      <CategorySection activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
      <RecommendationSection selectedCategory={activeCategory} />
      <PopularAuthorsSection />
      
    </div>
  </div>
);
};

export default Home;