import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { Search, ShoppingBag, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { logout } from '@/features/auth/authSlice';
import { toast } from 'sonner';

export function DesktopNavbarAfterLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // <-- Untuk cek kita lagi di halaman mana
  const { user } = useAppSelector((state) => state.auth); 
  
  const cartItems = useAppSelector((state) => state.cart?.items || []);
  const cartCount = cartItems.length; 

  const [searchQuery, setSearchQuery] = useState("");

  // FITUR LIVE SEARCH DENGAN DEBOUNCE
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        // Otomatis navigasi ke /books saat mengetik, replace: true agar history back tidak menumpuk
        navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
      } else if (searchQuery === "" && location.pathname === '/books') {
        // Jika input dikosongkan dan user sedang di halaman books, tampilkan semua buku
        navigate(`/books`, { replace: true });
      }
    }, 500); // 500ms delay setelah user berhenti ngetik

    return () => clearTimeout(delayDebounceFn); // Cleanup fungsi kalau user lanjut ngetik
  }, [searchQuery, navigate, location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Berhasil logout");
  };

  const userName = user?.name || "User";
  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=E0ECFF&color=1C65DA`;

  return (
    <div className="flex h-[80px] items-center justify-center bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      <div className="flex w-full max-w-[1440px] items-center justify-between px-6 lg:px-[120px]">
          <Logo size="lg" />
        {/* Search Bar - Live Search Active */}
        <div className="hidden md:flex items-center w-[500px] h-11 px-5 border border-[#D5D7DA] rounded-full focus-within:ring-2 focus-within:ring-[#1C65DA] transition-all">
          <Search className="w-5 h-5 text-[#535862] mr-3" />
          <input 
            type="text" 
            placeholder="Search book..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // onKeyDown={handleSearch} <-- Dihapus karena sudah otomatis pakai useEffect
            className="flex-1 bg-transparent outline-none font-['Quicksand'] font-medium text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12] placeholder:text-[#535862]" 
          />
        </div>

        <div className="flex items-center gap-6">
          {/* Bag */}
          <Link to="/cart" className="relative text-[#0A0D12] hover:text-[#1C65DA] transition-colors">
            <ShoppingBag className="w-[32px] h-[32px]" />
            {cartCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-[#EE1D52] border border-white">
                {cartCount}
              </Badge>
            )}
          </Link>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-[16px] px-2 py-1 rounded-lg outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors w-[184px]">
                <img src={userAvatar} alt="Avatar" className="object-cover rounded-full w-[48px] h-[48px]" />
                <span className="font-['Quicksand'] font-semibold text-[18px] leading-[32px] tracking-[-0.02em] text-[#0A0D12] hidden lg:block truncate text-left w-[80px]">
                  {userName}
                </span>
                <ChevronDown className="w-[24px] h-[24px] text-[#0A0D12]" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[184px] p-[16px] mt-2 flex flex-col gap-[16px] bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px] border-0">
              <DropdownMenuItem asChild className="p-0 cursor-pointer focus:bg-transparent">
                <Link to="/profile" className="font-['Quicksand'] font-semibold text-[16px] leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:text-[#1C65DA] w-full block">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-0 cursor-pointer focus:bg-transparent">
                <Link to="/profile" className="font-['Quicksand'] font-semibold text-[16px] leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:text-[#1C65DA] w-full block">
                  Borrowed List
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-0 cursor-pointer focus:bg-transparent">
                <Link to="/profile" className="font-['Quicksand'] font-semibold text-[16px] leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:text-[#1C65DA] w-full block">
                  Reviews
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="p-0 focus:bg-transparent cursor-pointer font-['Quicksand'] font-semibold text-[16px] leading-[30px] tracking-[-0.02em] text-[#EE1D52] hover:text-red-700 w-full block">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}