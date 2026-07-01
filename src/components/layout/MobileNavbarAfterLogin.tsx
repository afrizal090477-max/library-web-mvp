import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/Logo';
import { Search, ShoppingBag } from 'lucide-react';

export function MobileNavbarAfterLogin() {
  const cartCount = 2;
  const userAvatar = "https://i.pravatar.cc/40";

  return (
    <div className="flex h-16 items-center justify-between bg-white px-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      <Logo size="md" withText={false} />

      <div className="flex items-center gap-4">
        <button className="text-[#0A0D12]"><Search className="w-5 h-5" /></button>

        <Link to="/cart" className="relative text-[#0A0D12]">
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && <Badge variant="destructive" className="absolute -right-1.5 -top-1.5 h-[17px] w-[17px] p-0 text-[10px]">{cartCount}</Badge>}
        </Link>

        <Link to="/profile">
          <img src={userAvatar} alt="Avatar" className="object-cover rounded-full w-9 h-9" />
        </Link>
      </div>
    </div>
  );
}