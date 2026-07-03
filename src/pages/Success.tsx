import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  // Tangkap tanggal pengembalian dari halaman Checkout (opsional)
  const returnDate = location.state?.returnDate || "31 August 2025"; 

  return (
    <div className="w-full min-h-screen pt-[120px] pb-[80px] bg-[#FFFFFF] font-['Quicksand'] flex flex-col items-center justify-center overflow-x-hidden">
      
      {/* Container Konten (Sesuai width Figma) */}
      <div className="flex flex-col items-center px-[16px] max-w-[638px] w-full gap-[32px]">
        
        {/* Ikon Sukses (3 Lapis Border) */}
        <div className="flex items-center justify-center w-[142px] h-[142px] border-[0.8px] border-[#E9EAEB] rounded-full">
          <div className="flex items-center justify-center w-[129px] h-[129px] border-[0.8px] border-[#E9EAEB] rounded-full">
            <div className="flex items-center justify-center w-[117px] h-[117px] border-[0.8px] border-[#E9EAEB] rounded-full bg-[#1C65DA] shadow-md">
              <Check className="w-[50px] h-[50px] text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Teks */}
        <div className="flex flex-col items-center gap-[8px] w-full">
          <h1 className="font-bold text-[24px] md:text-[28px] leading-[38px] tracking-[-0.02em] text-[#0A0D12] text-center">
            Borrowing Successful!
          </h1>
          <p className="font-semibold text-[16px] md:text-[18px] leading-[32px] tracking-[-0.02em] text-[#0A0D12] text-center">
            Your book has been successfully borrowed. Please return it by <span className="font-bold text-[#1C65DA]">{returnDate}</span>
          </p>
        </div>

        {/* Tombol Action */}
        <Link 
          to="/profile" 
          className="flex justify-center items-center w-full max-w-[286px] h-[48px] bg-[#1C65DA] rounded-[100px] hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="font-bold text-[16px] text-[#FDFDFD] tracking-[-0.02em]">
            View Borrowed List
          </span>
        </Link>
        
      </div>
      
    </div>
  );
}