
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { Search, ShoppingBag, ChevronDown, User, BookOpen, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/features/auth/authSlice';
import { toast } from 'sonner';

export function DesktopNavbarAfterLogin() {
  const dispatch = useAppDispatch();
  const cartCount = 2; // nanti dari state
  const user = { 
    name: "John Doe", 
    avatar: "https://i.pravatar.cc/40",
    email: "john@example.com"
  }; // nanti dari Redux

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Berhasil logout");
  };

  return (
    <div className="flex h-[80px] items-center justify-center bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      <div className="flex w-full max-w-[1440px] items-center justify-between px-6 lg:px-[120px]">
        
        <Logo size="lg" />

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-[500px] h-11 px-5 border border-[#D5D7DA] rounded-full">
          <Search className="w-5 h-5 text-[#535862] mr-3" />
          <input 
            type="text" 
            placeholder="Search book..." 
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#535862]" 
          />
        </div>

        <div className="flex items-center gap-6">
          {/* Bag */}
          <Link to="/cart" className="relative text-[#0A0D12]">
            <ShoppingBag className="w-7 h-7" />
            {cartCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Link>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-50">
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  className="object-cover border rounded-full w-9 h-9" 
                />
                <span className="font-semibold text-[#0A0D12] hidden lg:block">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-[#0A0D12]" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 text-sm">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/my-loans" className="flex items-center gap-2 cursor-pointer">
                  <BookOpen className="w-4 h-4" /> My Loans
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 cursor-pointer focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}