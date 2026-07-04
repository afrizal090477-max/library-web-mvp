import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

import iconFiction from "@/assets/icons/Fiksi.png";
import iconNonFiction from "@/assets/icons/Non-Fiction.png";
import iconSelfImprovement from "@/assets/icons/Self-Improvement.png";
import iconFinance from "@/assets/icons/Finance-Business.png";
import iconScience from "@/assets/icons/Science-Technology.png";
import iconEducation from "@/assets/icons/Education-Reference.png";

interface CategoryItem {
  id: string;
  name: string;
  iconSrc: string;
}

interface CategoryAPI {
  id: number;
  name: string;
}

// 🚀 FIX 1: Hapus ID Hardcode! Kita cuma simpan nama UI dan gambar ikonnya aja
const CATEGORIES_UI = [
  { name: "Fiction", iconSrc: iconFiction },
  { name: "Non-Fiction", iconSrc: iconNonFiction }, 
  { name: "Self-Improvement", iconSrc: iconSelfImprovement },
  { name: "Finance", iconSrc: iconFinance }, 
  { name: "Science", iconSrc: iconScience },
  { name: "Education", iconSrc: iconEducation },
];

interface CategorySectionProps {
  activeCategory?: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySection = ({ activeCategory, onSelectCategory }: CategorySectionProps) => {
  const [dynamicCategories, setDynamicCategories] = useState<CategoryItem[]>([]);

  // 🚀 FIX 2: Tarik ID asli dari database, lalu kawinkan dengan gambar ikon lokal
  useEffect(() => {
    const fetchAndMergeCategories = async () => {
      try {
        const res = await fetch("https://library-backend-production-b9cf.up.railway.app/api/categories");
        const json = await res.json();
        const dbCats: CategoryAPI[] = Array.isArray(json.data) ? json.data : json.data?.categories || [];

        const mergedCategories = CATEGORIES_UI.map((uiCat) => {
          // Cari ID asli di database berdasarkan kecocokan nama
          const foundInDb = dbCats.find((dbCat) => 
            dbCat.name.toLowerCase().includes(uiCat.name.toLowerCase())
          );
          
          return {
            id: foundInDb ? foundInDb.id.toString() : "", // Ambil ID asli DB!
            name: uiCat.name,
            iconSrc: uiCat.iconSrc
          };
        });

        setDynamicCategories(mergedCategories);
      } catch (error) {
        console.error("Gagal sinkronisasi kategori:", error);
      }
    };

    fetchAndMergeCategories();
  }, []);

  return (
    <div className="w-full max-w-[361px] md:max-w-[1200px] font-['Quicksand'] select-none mx-auto">
      <div className="hidden md:flex flex-row items-center gap-[16px] w-full h-[130px]">
        {dynamicCategories.map((category, index) => (
          <CategoryCard 
            key={category.id || index} 
            category={category} 
            isActive={activeCategory === category.id && category.id !== ""} 
            onClick={onSelectCategory}
            isDesktop={true}
          />
        ))}
      </div>

      <div className="flex flex-col w-full gap-[12px] mx-auto md:hidden">
        <div className="flex flex-row items-start gap-[12px] w-full">
          {dynamicCategories.slice(0, 3).map((category, index) => (
            <CategoryCard 
              key={category.id || index} 
              category={category} 
              isActive={activeCategory === category.id && category.id !== ""} 
              onClick={onSelectCategory}
              isDesktop={false}
              isRowOne={true}
            />
          ))}
        </div>

        <div className="flex flex-row items-start gap-[12px] w-full">
          {dynamicCategories.slice(3, 6).map((category, index) => (
            <CategoryCard 
              key={category.id || index} 
              category={category} 
              isActive={activeCategory === category.id && category.id !== ""}
              onClick={onSelectCategory}
              isDesktop={false}
              isRowOne={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  category: CategoryItem;
  isActive: boolean;
  isDesktop: boolean;
  isRowOne?: boolean;
  onClick: (id: string) => void;
}

const CategoryCard = ({ category, isActive, isDesktop, isRowOne, onClick }: CategoryCardProps) => {
  return (
    <Card
      // 🚀 FIX 3: Klik hanya jalan kalau ID aslinya berhasil ketarik
      onClick={() => {
        if (category.id) onClick(category.id);
      }} 
      className={`flex flex-col bg-white border-0 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] cursor-pointer transition-all hover:scale-[1.03] overflow-hidden min-w-0 ${
        isDesktop 
          ? "justify-center items-start p-[12px] w-[186.67px] h-[130px] rounded-[16px]" 
          : `items-start flex-1 w-full p-[8px] rounded-[16px] ${isRowOne ? "h-[132px]" : "h-[108px]"}`
      } ${isActive ? "ring-2 ring-[#1C65DA]" : ""}`}
    >
      <div className={`flex flex-row justify-center items-center bg-[#E0ECFF] flex-shrink-0 mx-auto ${
        isDesktop 
          ? "w-[162.67px] h-[64px] p-[6.4px] rounded-[12px]" 
          : "w-full max-w-[96.33px] h-[56px] p-[5.6px] rounded-[10.5px]"
      } ${isActive ? "bg-[#C2DBFF]" : ""}`}>
        <img
          src={category.iconSrc}
          alt={category.name}
          className={`${isDesktop ? "w-[51.2px] h-[51.2px]" : "w-[44.8px] h-[44.8px]"} object-contain`}
          loading="eager"
        />
      </div>
      <span className={`font-semibold text-[#0A0D12] tracking-tight ${
        isDesktop 
          ? "w-[162.67px] text-[16px] leading-[30px] truncate mt-[12px] pl-1" 
          : "w-full text-[12px] leading-[24px] mt-[12px] text-left whitespace-normal break-words"
      }`}>
        {category.name}
      </span>
    </Card>
  );
};

export default CategorySection;