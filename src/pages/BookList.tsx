import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';
import { SlidersHorizontal, Star, Check } from 'lucide-react';
import BookListSection from '@/components/common/BookListSection';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const RATINGS = [5, 4, 3, 2, 1];

interface CategoryAPI {
  id: number;
  name: string;
}

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dbCategories = [], isLoading } = useQuery<CategoryAPI[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  
  const searchQuery = searchParams.get('q') || undefined;
  const categoryQuery = searchParams.get('category') || undefined; 
  const ratingQuery = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined; 

  const handleCategoryToggle = (categoryName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryQuery === categoryName) {
      newParams.delete('category'); 
    } else {
      newParams.set('category', categoryName); 
    }
    setSearchParams(newParams);
  };

  const handleRatingToggle = (rating: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (ratingQuery === rating) {
      newParams.delete('rating');
    } else {
      newParams.set('rating', rating.toString());
    }
    setSearchParams(newParams);
  };

  const filterContent = (
    <>
      <div className="flex flex-col items-start px-[16px] gap-[10px] w-full">
        <h3 className="hidden md:block w-full font-bold text-[16px] leading-[30px] text-[#0A0D12]">
          Filter
        </h3>
        <h4 className="w-full font-bold text-[18px] leading-[32px] tracking-[-0.02em] text-[#0A0D12]">
          Categories
        </h4>
        
        <div className="flex flex-col w-full gap-[8px] mt-2">
          {isLoading ? (
            <span className="text-sm text-gray-500 font-quicksand animate-pulse">Memuat kategori...</span>
          ) : (
            dbCategories.map((category) => {
              const isChecked = categoryQuery === category.name;
              
              return (
                <div 
                  key={category.id} 
                  onClick={() => handleCategoryToggle(category.name)} 
                  className="flex flex-row items-center gap-[8px] w-full cursor-pointer group select-none"
                >
                  <div className={`flex items-center justify-center w-[20px] h-[20px] rounded-[6px] border ${isChecked ? 'bg-[#1C65DA] border-[#1C65DA]' : 'border-[#A4A7AE] bg-white group-hover:border-[#1C65DA]'} transition-colors`}>
                    {isChecked && <Check className="w-[12px] h-[12px] text-white" strokeWidth={3} />}
                  </div>
                  <span className="flex-1 font-medium text-[16px] leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                    {category.name}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full border-t border-[#D5D7DA] my-2 md:my-0"></div>
      
      <div className="flex flex-col items-start px-[16px] gap-[10px] w-full pb-[20px] md:pb-0">
        <h4 className="w-full font-bold text-[18px] leading-[32px] tracking-[-0.02em] text-[#0A0D12]">
          Rating
        </h4>
        
        <div className="flex flex-col w-full gap-[8px] mt-2">
          {RATINGS.map((rating) => {
            const isChecked = ratingQuery === rating;
            return (
              <div 
                key={rating} 
                onClick={() => handleRatingToggle(rating)}
                className="flex flex-row items-center gap-[8px] w-full cursor-pointer group select-none" 
              >
                <div className={`flex items-center justify-center w-[20px] h-[20px] rounded-[6px] border ${isChecked ? 'bg-[#1C65DA] border-[#1C65DA]' : 'border-[#A4A7AE] bg-white group-hover:border-[#1C65DA]'} transition-colors`}>
                  {isChecked && <Check className="w-[12px] h-[12px] text-white" strokeWidth={3} />}
                </div>
                <div className="flex flex-row items-center gap-[2px]">
                  <Star className="w-[24px] h-[24px] text-[#FFAB0D] fill-[#FFAB0D]" />
                  <span className="font-normal text-[16px] leading-[30px] tracking-[-0.02em] text-[#0A0D12] ml-1">
                    {rating}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full min-h-screen pt-[100px] md:pt-[128px] pb-[80px] bg-[#FFFFFF] font-['Quicksand'] overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-[16px] md:px-[120px] flex flex-col items-start gap-[16px] md:gap-[32px]">
        
        <div className="w-full">
          <h1 className="font-bold text-[24px] md:text-[36px] leading-[36px] md:leading-[44px] text-[#0A0D12]">
            Book List
          </h1>
          {(searchQuery || categoryQuery || ratingQuery) && (
            <p className="mt-2 text-[14px] md:text-[16px] text-[#535862] font-medium">
              Menampilkan hasil untuk filter aktif
            </p>
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden flex flex-row justify-between items-center p-[12px] w-full bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[12px] active:scale-[0.99] transition-transform outline-none">
              <span className="font-['Nunito'] font-extrabold text-[14px] leading-[28px] text-[#0A0D12]">
                Filter
              </span>
              <SlidersHorizontal className="w-[20px] h-[20px] text-[#0A0D12]" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-[24px] p-0 flex flex-col font-['Quicksand'] bg-white border-0">
            <SheetHeader className="p-[20px] border-b border-[#D5D7DA] text-left">
              <SheetTitle className="font-bold text-[20px] text-[#0A0D12]">Filter Koleksi</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-[20px] flex-1">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-col md:flex-row items-start gap-[40px] w-full">
          <div className="hidden md:flex flex-col items-start py-[16px] gap-[24px] w-[266px] bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[12px] flex-shrink-0">
            {filterContent}
          </div>
          <div className="flex-1 w-full min-w-0">
            <BookListSection 
              searchQuery={searchQuery} 
              selectedCategory={categoryQuery} 
              selectedRating={ratingQuery} 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}