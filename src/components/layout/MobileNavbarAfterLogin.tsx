import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/Logo';
import { Search, ShoppingBag } from 'lucide-react';
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

export function MobileNavbarAfterLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);
  
  // MENGAMBIL DATA CART DARI REDUX (Tidak hardcode lagi)
  const cartItems = useAppSelector((state) => state.cart?.items || []);
  const cartCount = cartItems.length;

  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=E0ECFF&color=1C65DA`;

  // STATE UNTUK LIVE SEARCH
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
      } else if (searchQuery === "" && location.pathname === '/books') {
        navigate(`/books`, { replace: true });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, navigate, location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Berhasil logout");
  };

  return (
    <div className="flex h-[64px] w-full items-center justify-between bg-[#FFFFFF] px-[16px] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] gap-[12px]">
      
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo size="md" withText={false} />
      </div>

      {/* SEARCH BAR MOBILE: Lebar otomatis menyesuaikan layar (flex-1) */}
      <div className="flex flex-1 min-w-0 items-center h-[40px] px-[12px] py-[8px] gap-[6px] bg-[#FFFFFF] border border-[#D5D7DA] rounded-full focus-within:border-[#1C65DA] focus-within:ring-1 focus-within:ring-[#1C65DA] transition-all box-border">
        <Search className="w-[20px] h-[20px] text-[#535862] flex-shrink-0" />
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 w-full bg-transparent outline-none font-['Quicksand'] font-medium text-[14px] leading-[28px] tracking-[-0.03em] text-[#535862] placeholder:text-[#535862]" 
        />
      </div>

      {/* Bagian Kanan (Cart & Dropdown User buatanmu) */}
      <div className="flex items-center gap-[12px] flex-shrink-0">
        
        {/* Shopping Cart */}
        <Link to="/cart" className="relative text-[#0A0D12] hover:text-[#1C65DA] transition-colors">
          <ShoppingBag className="w-[24px] h-[24px]" />
          {cartCount > 0 && (
            <Badge variant="destructive" className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center p-0 text-[10px] bg-[#EE1D52] rounded-full border-2 border-white">
              {cartCount}
            </Badge>
          )}
        </Link>

        {/* Dropdown Menu Mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none focus:ring-2 focus:ring-[#1C65DA] rounded-full flex-shrink-0">
              <img src={userAvatar} alt="Avatar" className="object-cover rounded-full w-[36px] h-[36px]" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="end" 
            className="w-[361px] max-w-[calc(100vw-32px)] p-[16px] mt-4 flex flex-col gap-[16px] bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px] border-0"
          >
            <DropdownMenuItem asChild className="p-0 cursor-pointer focus:bg-transparent">
              <Link to="/profile" className="font-['Quicksand'] font-semibold text-[14px] leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:text-[#1C65DA] w-full block">
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="p-0 cursor-pointer focus:bg-transparent">
              <Link to="/profile" className="font-['Quicksand'] font-semibold text-[14px] leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:text-[#1C65DA] w-full block">
                Borrowed List
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="p-0 cursor-pointer focus:bg-transparent">
              <Link to="/profile" className="font-['Quicksand'] font-semibold text-[14px] leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:text-[#1C65DA] w-full block">
                Reviews
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="p-0 focus:bg-transparent cursor-pointer font-['Quicksand'] font-semibold text-[14px] leading-[30px] tracking-[-0.02em] text-[#EE1D52] hover:text-red-700 w-full block"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
}