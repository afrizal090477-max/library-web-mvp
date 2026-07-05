import { Search, ShoppingBag, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MobileMenuProps {
  onSearchOpen: () => void
  onMenuToggle: () => void
  cartCount: number // Mengikat data dinamis asli dari API
}

export default function MobileMenu({ onSearchOpen, onMenuToggle, cartCount }: MobileMenuProps) {
  return (
    <div className="flex flex-row items-center justify-end gap-4 w-[108px] h-7 md:hidden">
      <button onClick={onSearchOpen} className="text-[#0A0D12] focus:outline-none cursor-pointer" aria-label="Search">
        <Search className="h-6 w-6 stroke-[2]" />
      </button>
      
      <button className="relative text-[#0A0D12] focus:outline-none cursor-pointer" aria-label="Cart">
        <ShoppingBag className="h-7 w-7 stroke-[2]" />
        {/* Badge hanya dirender jika ada item di dalam keranjang dari data API */}
        {cartCount > 0 && (
          <Badge 
            className="absolute -top-[3px] left-[14px] flex h-5 w-5 items-center justify-center p-0 rounded-full bg-[#EE1D52] hover:bg-[#EE1D52] text-white font-heading text-[12px] font-bold border-none shadow-none"
          >
            {cartCount}
          </Badge>
        )}
      </button>

      <button onClick={onMenuToggle} className="text-[#0A0D12] focus:outline-none cursor-pointer" aria-label="Navigation Menu">
        <Menu className="h-6 w-6 stroke-[2]" />
      </button>
    </div>
  )
}