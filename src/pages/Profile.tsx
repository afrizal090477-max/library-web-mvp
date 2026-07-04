// src/pages/Profile.tsx
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { BorrowedListTab } from '@/features/profile/BorrowedListTab';
import { ReviewsTab } from '@/features/profile/ReviewsTab';

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'borrowed' | 'reviews'>('profile');
  const userName = user?.name || "John Doe";
  const userEmail = user?.email || "johndoe@email.com";
  const userAvatar = user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 1}`;
  const userPhone = "081234567890"; 

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] pt-[24px] md:pt-[40px] pb-[80px] font-['Quicksand']">
      
      <div className="mx-auto w-full max-w-[1440px] px-[16px] md:px-[220px] flex flex-col gap-[24px]">
        <div className="flex flex-row items-center p-[8px] gap-[8px] w-full max-w-[557px] h-[56px] bg-[#F5F5F5] rounded-[16px]">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex justify-center items-center py-[8px] px-[12px] h-[40px] rounded-[12px] transition-all outline-none ${
              activeTab === 'profile' 
                ? 'bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] text-[#0A0D12] font-bold' 
                : 'text-[#535862] font-medium hover:bg-gray-200'
            } text-[14px] md:text-[16px] leading-[30px] tracking-[-0.02em]`}
          >
            Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('borrowed')}
            className={`flex-1 flex justify-center items-center py-[8px] px-[12px] h-[40px] rounded-[12px] transition-all outline-none ${
              activeTab === 'borrowed' 
                ? 'bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] text-[#0A0D12] font-bold' 
                : 'text-[#535862] font-medium hover:bg-gray-200'
            } text-[14px] md:text-[16px] leading-[30px] tracking-[-0.03em]`}
          >
            Borrowed List
          </button>
          
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 flex justify-center items-center py-[8px] px-[12px] h-[40px] rounded-[12px] transition-all outline-none ${
              activeTab === 'reviews' 
                ? 'bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] text-[#0A0D12] font-bold' 
                : 'text-[#535862] font-medium hover:bg-gray-200'
            } text-[14px] md:text-[16px] leading-[30px] tracking-[-0.03em]`}
          >
            Reviews
          </button>
        </div>
            
        {activeTab === 'profile' && (
          <div className="flex flex-col items-start gap-[24px] w-full max-w-[557px] animate-in fade-in duration-300">
            <h1 className="font-bold text-[24px] md:text-[28px] leading-[36px] md:leading-[38px] tracking-[-0.03em] text-[#0A0D12]">
              Profile
            </h1>

            <div className="flex flex-col items-start p-[16px] md:p-[20px] gap-[24px] w-full bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px]">
              <div className="flex flex-col items-start gap-[12px] w-full">
                <img 
                  src={userAvatar} 
                  alt="Profile Avatar" 
                  className="w-[64px] h-[64px] rounded-full object-cover mb-[4px]"
                />

                <div className="flex flex-row justify-between items-center w-full h-[28px] md:h-[30px]">
                  <span className="font-medium text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                    Name
                  </span>
                  <span className="font-bold text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]">
                    {userName}
                  </span>
                </div>

                <div className="flex flex-row justify-between items-center w-full h-[28px] md:h-[30px]">
                  <span className="font-medium text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                    Email
                  </span>
                  <span className="font-bold text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]">
                    {userEmail}
                  </span>
                </div>

                <div className="flex flex-row justify-between items-center w-full h-[28px] md:h-[30px]">
                  <span className="font-medium text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                    Nomor Handphone
                  </span>
                  <span className="font-bold text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]">
                    {userPhone}
                  </span>
                </div>
              </div>

              <button className="flex flex-row justify-center items-center p-[8px] gap-[8px] w-full h-[44px] bg-[#1C65DA] hover:bg-blue-700 transition-colors rounded-[100px] outline-none">
                <span className="font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-[#FDFDFD]">
                  Update Profile
                </span>
              </button>

            </div>
          </div>
        )}

        {activeTab === 'borrowed' && (
          <div className="w-full">
            <BorrowedListTab />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="w-full">
            <ReviewsTab />
          </div>
        )}

      </div>
    </div>
  );
}