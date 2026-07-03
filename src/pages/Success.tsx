import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  const returnDate = location.state?.returnDate || "31 August 2025"; 

  return (
    <div className="w-full min-h-screen pt-[120px] pb-[80px] bg-[#FFFFFF] font-['Quicksand'] flex flex-col items-center justify-center overflow-x-hidden">
      
      <div className="flex flex-col items-center px-[16px] max-w-[345px] md:max-w-[638px] w-full gap-[24px] md:gap-[32px] animate-in zoom-in-95 duration-500">
        
        {/* Lingkaran Bertumpuk */}
        <div className="flex items-center justify-center w-[142px] h-[142px] border-[0.8px] border-[#E9EAEB] rounded-full">
          <div className="flex items-center justify-center w-[130px] h-[130px] border-[0.8px] border-[#E9EAEB] rounded-full">
            <div className="flex items-center justify-center w-[117px] h-[117px] border-[0.8px] border-[#E9EAEB] rounded-full bg-[#1C65DA] shadow-md">
              <Check className="w-[50px] h-[50px] text-white" strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* Teks */}
        <div className="flex flex-col items-center gap-[8px] w-full">
          <h1 className="font-bold text-[20px] md:text-[28px] leading-[34px] md:leading-[38px] tracking-[-0.02em] text-[#0A0D12] text-center">
            Borrowing Successful!
          </h1>
          <p className="font-semibold text-[16px] md:text-[18px] leading-[32px] tracking-[-0.02em] text-[#0A0D12] text-center">
            Your book has been successfully borrowed. <br className="hidden md:block" /> Please return it by <span className="text-[#EE1D52]">{returnDate}</span>
          </p>
        </div>

        {/* Tombol Action */}
        <Link 
          to="/profile" 
          className="flex justify-center items-center w-full max-w-[286px] h-[48px] bg-[#1C65DA] rounded-[100px] hover:bg-[#1652b4] transition-colors shadow-sm mt-[8px]"
        >
          <span className="font-bold text-[16px] text-[#FDFDFD] tracking-[-0.02em]">
            See Borrowed List
          </span>
        </Link>
        
      </div>
      
    </div>
  );
}