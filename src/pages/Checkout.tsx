import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, Calendar, ArrowLeft } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearCart } from '@/features/cart/cartSlice';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart?.items || []);

  const selectedIds: Array<string | number> = location.state?.selectedIds || [];
  const checkoutItems = cartItems.filter(item => selectedIds.includes(item.id));

  const [duration, setDuration] = useState<number>(3); 
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  // Kalkulasi Tanggal Kembali Otomatis
  const returnDateString = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + duration);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [duration]);

  const handleBorrow = () => {
    if (!agree1 || !agree2) return;
    dispatch(clearCart()); 
    navigate('/success'); 
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen pt-[120px] flex justify-center">
        <Link to="/cart" className="flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800">
          <ArrowLeft/> Kembali ke Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-[100px] md:pt-[128px] pb-[80px] bg-[#FFFFFF] font-['Quicksand'] overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-[16px] md:px-[120px] flex flex-col gap-[32px]">
        
        <h1 className="font-bold text-[24px] md:text-[36px] text-[#0A0D12]">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[58px] items-start w-full">
          
          {/* Kolom Kiri: Info User & List Buku */}
          <div className="flex-1 w-full flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[16px] w-full border-b border-[#D5D7DA] pb-[24px]">
              <h2 className="font-bold text-[18px] md:text-[24px] text-[#0A0D12]">User Information</h2>
              <div className="flex flex-row items-center justify-between">
                <span className="font-medium text-[14px] md:text-[16px] text-[#0A0D12]">Name</span>
                <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">{user?.name || "John Doe"}</span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-medium text-[14px] md:text-[16px] text-[#0A0D12]">Email</span>
                <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">{user?.email || "johndoe@email.com"}</span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-medium text-[14px] md:text-[16px] text-[#0A0D12]">Nomor Handphone</span>
                <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">{"081234567890"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-[16px] w-full">
              <h2 className="font-bold text-[18px] text-[#0A0D12]">Book List</h2>
              <div className="flex flex-col gap-[16px]">
                {checkoutItems.map(item => (
                  <div key={item.id} className="flex flex-row items-center gap-[12px] md:gap-[16px]">
                    <div className="w-[70px] h-[106px] md:w-[92px] md:h-[138px] bg-gray-200 rounded-[8px] overflow-hidden flex-shrink-0">
                      <img src={item.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=E0ECFF&color=1C65DA`} className="object-cover w-full h-full" alt={item.title} />
                    </div>
                    <div className="flex flex-col items-start gap-[4px] flex-1">
                      <div className="px-[8px] py-[2px] border border-[#D5D7DA] rounded-[6px]">
                        <span className="font-bold text-[14px] text-[#0A0D12]">Category</span>
                      </div>
                      <h3 className="font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.02em] text-[#0A0D12] line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="font-medium text-[14px] md:text-[16px] text-[#414651]">
                        {item.author || "Unknown Author"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Borrow Request Form */}
          <div className="w-full lg:w-[478px] flex flex-col items-start p-[20px] md:p-[24px] gap-[24px] bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[20px]">
            <h2 className="font-bold text-[20px] md:text-[28px] leading-[34px] md:leading-[38px] text-[#0A0D12]">
              Complete Your Borrow Request
            </h2>

            {/* Input Kalender (Read-Only) */}
            <div className="flex flex-col gap-[8px] w-full">
               <label className="font-bold text-[14px] text-[#0A0D12]">Return Date Plan</label>
               <div className="flex flex-row items-center justify-between px-[16px] py-[8px] w-full h-[48px] bg-[#F5F5F5] border border-[#D5D7DA] rounded-[12px] cursor-not-allowed opacity-90" title="Tanggal dihitung otomatis berdasarkan durasi pinjam">
                <span className="font-semibold text-[16px] text-[#0A0D12]">
                  {returnDateString}
                </span>
                <Calendar className="w-[20px] h-[20px] text-[#A4A7AE]" />
              </div>
            </div>

            {/* Input Durasi */}
            <div className="flex flex-col gap-[12px] w-full mt-2">
              <label className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">Borrow Duration</label>
              <div className="flex flex-col gap-[12px]">
                {[3, 5, 10].map((days) => (
                  <label 
                    key={days} 
                    onClick={() => setDuration(days)}
                    className="flex items-center gap-[12px] cursor-pointer w-fit group"
                  >
                    <div className={`flex justify-center items-center w-[24px] h-[24px] rounded-full border transition-colors ${duration === days ? 'bg-[#1C65DA] border-[#1C65DA]' : 'border-[#A4A7AE] group-hover:border-[#1C65DA]'}`}>
                      {duration === days && <div className="w-[10px] h-[10px] bg-white rounded-full"></div>}
                    </div>
                    <span className="font-semibold text-[14px] md:text-[16px] text-[#0A0D12]">{days} Days</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Return Date Info Box */}
            <div className="flex flex-col p-[12px] md:p-[16px] bg-[#F6F9FE] rounded-[12px] w-full">
              <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">Return Date</span>
              <span className="font-medium text-[14px] md:text-[16px] text-[#0A0D12] leading-[28px]">
                Please return the book no later than <br className="md:hidden" />
                <span className="font-bold text-[#1C65DA]">{returnDateString}</span>
              </span>
            </div>

            {/* Agreements */}
            <div className="flex flex-col gap-[12px] w-full">
              <label 
                onClick={() => setAgree1(!agree1)}
                className="flex items-start gap-[12px] cursor-pointer"
              >
                <div className={`mt-1 flex items-center justify-center w-[20px] h-[20px] flex-shrink-0 rounded-[6px] border transition-colors ${agree1 ? 'bg-[#1C65DA] border-[#1C65DA]' : 'border-[#A4A7AE]'}`}>
                  {agree1 && <Check className="w-[12px] h-[12px] text-white" strokeWidth={3} />}
                </div>
                <span className="font-semibold text-[14px] md:text-[16px] text-[#0A0D12] leading-[28px]">I agree to return the book(s) before the due date.</span>
              </label>

              <label 
                onClick={() => setAgree2(!agree2)}
                className="flex items-start gap-[12px] cursor-pointer"
              >
                <div className={`mt-1 flex items-center justify-center w-[20px] h-[20px] flex-shrink-0 rounded-[6px] border transition-colors ${agree2 ? 'bg-[#1C65DA] border-[#1C65DA]' : 'border-[#A4A7AE]'}`}>
                  {agree2 && <Check className="w-[12px] h-[12px] text-white" strokeWidth={3} />}
                </div>
                <span className="font-semibold text-[14px] md:text-[16px] text-[#0A0D12] leading-[28px]">I accept the library borrowing policy.</span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleBorrow} 
              disabled={!agree1 || !agree2}
              className="w-full h-[48px] bg-[#1C65DA] rounded-[100px] flex justify-center items-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              <span className="font-bold text-[16px] text-white">Borrow</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}