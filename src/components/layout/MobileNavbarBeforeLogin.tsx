import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/Logo';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

export function MobileNavbarBeforeLogin() {
  const cartCount = 0; 
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="flex h-[64px] items-center justify-between bg-white px-[16px] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] relative z-40 font-['Quicksand']">
      {!isSearchOpen ? (
        <>
          <Logo size="md" withText={false} />

          <div className="flex items-center gap-[16px]">
            <button 
              onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }} 
              className="text-[#0A0D12] hover:text-[#1C65DA] transition-colors outline-none"
            >
              <Search className="w-[24px] h-[24px]" />
            </button>

            <Link to="/cart" className="relative text-[#0A0D12] hover:text-[#1C65DA] transition-colors outline-none">
              <ShoppingBag className="w-[28px] h-[28px]" />
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -right-1.5 -top-1.5 h-[17px] w-[17px] flex items-center justify-center p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Link>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#0A0D12] hover:text-[#1C65DA] transition-colors outline-none"
            >
              {isMenuOpen ? (
                <X className="w-[28px] h-[28px]" />
              ) : (
                <Menu className="w-[28px] h-[28px]" />
              )}
            </button>
          </div>
        </>
      ) : (

        <div className="flex w-full items-center gap-[16px] animate-in fade-in zoom-in-95 duration-200">
          <div className="w-[40px] h-[40px] flex-shrink-0">
            <Logo size="sm" withText={false} />
          </div>
          
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 flex flex-row items-center px-[12px] py-[8px] gap-[6px] h-[40px] bg-white border border-[#D5D7DA] rounded-full focus-within:border-[#1C65DA] transition-colors"
          >
            <Search className="w-[20px] h-[20px] text-[#535862] flex-shrink-0" />
            
            <input 
              type="text"
              placeholder="Search book"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none font-medium text-[14px] leading-[28px] text-[#535862] tracking-[-0.03em]"
              autoFocus
            />

            <button 
              type="button" 
              onClick={handleCloseSearch} 
              className="w-[24px] h-[24px] flex-shrink-0 flex items-center justify-center text-[#0A0D12] outline-none"
            >
              <X className="w-[20px] h-[20px]" strokeWidth={2} />
            </button>
          </form>

        </div>
      )}
      {isMenuOpen && !isSearchOpen && (
        <MobileMenu onClose={() => setIsMenuOpen(false)} />
      )}

    </div>
  );
}