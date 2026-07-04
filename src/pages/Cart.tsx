import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Check } from "lucide-react"; 
import { useAppSelector } from "@/hooks/useAppSelector";

export default function Cart() {
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart?.items || []);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const isAllSelected =
    cartItems.length > 0 && selectedIds.length === cartItems.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]); 
    } else {
      setSelectedIds(cartItems.map((item) => item.id)); 
    }
  };

  const handleSelect = (id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleProceedToCheckout = () => {
    if (selectedIds.length === 0) return;
    navigate("/checkout", { state: { selectedIds } });
  };

  return (
    <div className="w-full min-h-screen pt-[100px] md:pt-[128px] pb-[120px] bg-[#FFFFFF] font-['Quicksand'] relative">
      <div className="mx-auto w-full max-w-[1440px] px-[16px] md:px-[120px] flex flex-col gap-[24px]">
        <h1 className="font-bold text-[24px] md:text-[36px] text-[#0A0D12]">
          My Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-[80px] bg-white rounded-[16px] gap-4">
            <BookOpen className="w-[80px] h-[80px] text-[#D5D7DA]" />
            <h2 className="font-bold text-[20px] text-[#0A0D12]">
              Keranjang kosong
            </h2>
            <Link
              to="/books"
              className="mt-4 px-6 py-3 bg-[#1C65DA] text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
            >
              Cari Buku
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-[40px] items-start w-full">
            <div className="flex-1 w-full flex flex-col gap-[24px]">
              <label
                onClick={handleSelectAll}
                className="flex flex-row items-center gap-[16px] cursor-pointer w-fit group"
              >
                <div
                  className={`flex items-center justify-center w-[20px] h-[20px] rounded-[6px] border ${isAllSelected ? "bg-[#1C65DA] border-[#1C65DA]" : "border-[#A4A7AE] bg-white group-hover:border-[#1C65DA]"} transition-colors`}
                >
                  {isAllSelected && (
                    <Check
                      className="w-[12px] h-[12px] text-white"
                      strokeWidth={3}
                    />
                  )}
                </div>
                <span className="font-semibold text-[16px] leading-[30px] tracking-[-0.02em] text-[#0A0D12]">
                  Select All
                </span>
              </label>

              <div className="flex flex-col w-full gap-[16px]">
                {cartItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-row items-center gap-[16px] w-full border-b border-[#D5D7DA] pb-[16px]"
                    >
                      <label className="p-2 -ml-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isSelected}
                          onChange={() => handleSelect(item.id)}
                        />
                        <div
                          className={`flex items-center justify-center w-[20px] h-[20px] rounded-[6px] border ${isSelected ? "bg-[#1C65DA] border-[#1C65DA]" : "border-[#A4A7AE] bg-white"} transition-colors`}
                        >
                          {isSelected && (
                            <Check
                              className="w-[12px] h-[12px] text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      </label>

                      <div className="w-[70px] h-[106px] md:w-[92px] md:h-[138px] bg-gray-200 rounded-[8px] overflow-hidden flex-shrink-0">
                        <img
                          src={
                            item.coverImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=E0ECFF&color=1C65DA`
                          }
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex flex-col items-start gap-[4px] flex-1">
                        <div className="px-[8px] py-[2px] border border-[#D5D7DA] rounded-[6px]">
                          <span className="font-bold text-[14px] leading-[28px] tracking-[-0.02em] text-[#0A0D12]">
                            Category
                          </span>
                        </div>
                        <h3 className="font-bold text-[16px] md:text-[18px] leading-[30px] md:leading-[32px] tracking-[-0.03em] text-[#0A0D12] line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-medium text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#414651]">
                          {item.author || "Unknown Author"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-start p-[20px] gap-[24px] w-[318px] bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px] sticky top-[120px]">
              <h2 className="font-bold text-[20px] leading-[34px] tracking-[-0.02em] text-[#0A0D12]">
                Loan Summary
              </h2>
              <div className="flex flex-row items-center justify-between w-full">
                <span className="font-medium text-[16px] leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                  Total Book
                </span>
                <span className="font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-[#0A0D12]">
                  {selectedIds.length} Items
                </span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedIds.length === 0}
                className="flex justify-center items-center py-[8px] w-full bg-[#1C65DA] rounded-[100px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                <span className="font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-[#FDFDFD]">
                  Checkout
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-[#FFFFFF] shadow-[0px_-4px_20px_rgba(203,202,202,0.15)] px-[16px] py-[16px] flex flex-row justify-between items-center z-50">
          <div className="flex flex-col items-start">
            <span className="font-medium text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]">
              Total Book
            </span>
            <span className="font-bold text-[14px] leading-[28px] tracking-[-0.02em] text-[#0A0D12]">
              {selectedIds.length} Items
            </span>
          </div>
          <button
            onClick={handleProceedToCheckout}
            disabled={selectedIds.length === 0}
            className="flex justify-center items-center w-[150px] h-[40px] bg-[#1C65DA] rounded-[100px] disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <span className="font-bold text-[14px] leading-[28px] tracking-[-0.02em] text-[#FDFDFD]">
              Checkout
            </span>
          </button>
        </div>
      )}
    </div>
  );
}