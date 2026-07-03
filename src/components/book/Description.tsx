import { useState } from 'react';

interface DescriptionProps {
  text: string;
}

export const Description = ({ text }: DescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 75; 
  const isLong = text.length > maxLength;

  return (
    <div className="flex flex-col gap-[8px]">
      <h2 className="text-[20px] font-bold text-[#0A0D12]">Description</h2>
      <p className="text-[16px] leading-[30px] text-[#414651]">
        {isExpanded ? text : `${text.substring(0, maxLength)}${isLong ? '...' : ''}`}
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="ml-2 font-bold text-[#1C65DA] hover:underline focus:outline-none"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
};