import { useState, useEffect } from "react";

interface HeroSectionProps {
  covers: string[];
}

export const HeroSection = ({ covers = [] }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (!covers || !Array.isArray(covers) || covers.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === covers.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [covers]);

  if (!covers || !Array.isArray(covers) || covers.length === 0) {
    return (
      <section className="flex justify-center w-full px-4 py-4 md:px-0 md:py-8">
        {/* PERBAIKAN: Gunakan w-full dan max-w agar responsif */}
        <div className="h-[132.67px] w-full max-w-[361px] animate-pulse rounded-[24px] bg-gray-200 md:h-[441px] md:max-w-[1200px]" />
      </section>
    );
  }

  return (
    <section className="flex justify-center w-full px-4 py-4 md:px-0 md:py-8">
      {/* PERBAIKAN: Gunakan w-full dan max-w di sini juga */}
      <div className="flex w-full max-w-[361px] flex-col items-center gap-2 md:max-w-[1200px] md:gap-4">
        
        <div className="relative h-[132.67px] w-full overflow-hidden rounded-[24px] bg-gradient-to-b from-[#58B0E8] to-[#E7E9FF] md:h-[441px]">
          <img
            src={covers[currentSlide]}
            alt={`Library Banner ${currentSlide + 1}`}
            className="object-cover object-center w-full h-full select-none"
          />
        </div>

        <div className="flex items-center justify-center gap-1 md:gap-[6px]">
          {covers?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? "h-[6px] w-[6px] bg-[#1C65DA] md:h-[10px] md:w-[10px]" 
                  : "h-[6px] w-[6px] bg-[#D5D7DA] md:h-[10px] md:w-[10px]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};