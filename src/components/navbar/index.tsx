import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, Menu, X } from "lucide-react"
import type { NavbarProps } from "@/types/navbar"
import logoBrand from "@/assets/logo-brand.svg"

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [isMobileSearchActive, setIsMobileMenuSearchActive] = useState<boolean>(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false)

  // 1. DATA VALUE REUSABLE (Dinamis murni dari data contract API, default 0 agar dummy hilang)
  const cartCount = 0 

  // 2. LAYOUT MOBILE: SEARCH ACTIVE MODE (Width: 393px, Height: 64px)
  if (isMobileSearchActive) {
    return (
      <nav className="sticky top-0 z-50 w-full h-16 bg-white flex flex-row items-center justify-between px-4 border-b border-[#D5D7DA] shadow-[0_0_20px_rgba(203,202,202,0.25)] md:hidden">
        {/* Logo dengan border kotak hijau figma */}
        <div className="h-10 w-10 shrink-0 border border-[#079455] p-1 flex items-center justify-center bg-white box-border">
          <img src={logoBrand} alt="Booky Logo" className="h-full w-full object-contain" />
        </div>

        {/* Container Box Input Search (Width: 265px, Height: 40px) */}
        <div className="flex flex-row items-center gap-[6px] w-[265px] h-10 px-3 bg-white border border-[#D5D7DA] rounded-full box-border">
          <Search className="h-5 w-5 text-[#535862] shrink-0" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full h-7 font-heading text-sm font-medium text-[#535862] tracking-[-0.03em] bg-transparent focus:outline-none"
            autoFocus
          />
        </div>

        {/* Tombol X BERADA DI LUAR container box input search */}
        <button 
          onClick={() => setIsMobileMenuSearchActive(false)} 
          className="text-[#0A0D12] hover:opacity-70 p-1 focus:outline-none shrink-0 cursor-pointer"
          aria-label="Exit search"
        >
          <X className="h-6 w-6 stroke-[2]" />
        </button>
      </nav>
    )
  }

  // 3. LAYOUT STANDAR: DESKTOP (Height: 80px) & MOBILE STANDARD (Height: 64px)
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#D5D7DA] shadow-[0_0_20px_rgba(203,202,202,0.25)]">
      {/* Container utama penyeimbang parent max-width figma */}
      <div className="mx-auto flex flex-row items-center justify-between h-16 max-w-[1440px] px-4 md:h-20 md:px-[120px]">
        
        {/* LOGO CONTAINER (Frame 37) - Logo 42px dengan Border Kotak Hijau Figma */}
        <div className="flex flex-row items-center gap-[15px] h-[42px] w-[155px]">
          <div className="h-10 w-10 md:h-[42px] md:w-[42px] shrink-0 border border-[#079455] p-1 flex items-center justify-center bg-white box-border rounded-none">
            <img src={logoBrand} alt="Booky Logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-heading text-2xl md:text-[32px] font-bold leading-[42px] text-[#0A0D12]">
            Booky
          </span>
        </div>

        {/* DESKTOP ACTIONS LAYER (Frame 88) - Menggunakan Button Shadcn */}
        <div className="hidden md:flex flex-row items-center justify-end gap-4 w-[688.5px] h-12">
          <Button 
            variant="outline" 
            onClick={onLoginClick}
            className="h-12 w-[163px] rounded-[100px] border border-[#D5D7DA] bg-white font-heading text-base font-bold text-[#0A0D12] tracking-[-0.02em] hover:bg-slate-50 cursor-pointer"
          >
            Login
          </Button>
          <Button 
            onClick={onRegisterClick}
            className="h-12 w-[163px] rounded-[100px] bg-[#1C65DA] font-heading text-base font-bold text-[#FDFDFD] tracking-[-0.02em] hover:bg-[#1C65DA]/90 shadow-none cursor-pointer"
          >
            Register
          </Button>
        </div>

        {/* MOBILE ACTIONS STANDARD (Frame 38) - Badge dinamis bebas dummy */}
        <div className="flex flex-row items-center justify-end gap-4 w-[108px] h-7 md:hidden">
          <button 
            onClick={() => setIsMobileMenuSearchActive(true)} 
            className="text-[#0A0D12] focus:outline-none cursor-pointer" 
            aria-label="Open Search"
          >
            <Search className="h-6 w-6 stroke-[2]" />
          </button>
          
          <button className="relative text-[#0A0D12] focus:outline-none cursor-pointer" aria-label="Cart">
            <ShoppingBag className="h-7 w-7 stroke-[2]" />
            {/* BADGE DI-RENDER JIKA COUTER > 0 (Dinamis dari data API) */}
            {cartCount > 0 && (
              <Badge 
                className="absolute -top-[3px] left-[14px] flex h-5 w-5 items-center justify-center p-0 rounded-full bg-[#EE1D52] hover:bg-[#EE1D52] text-white font-heading text-[12px] font-bold border-none shadow-none"
              >
                {cartCount}
              </Badge>
            )}
          </button>

          <button 
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)} 
            className="text-[#0A0D12] focus:outline-none cursor-pointer" 
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6 stroke-[2]" />
          </button>
        </div>

      </div>

      {/* MOBILE INTERACTIVE DRAWER MENU - Ketika burger diklik */}
      {isMobileDrawerOpen && (
        <div className="w-full bg-white border-t border-[#D5D7DA] px-6 py-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-150">
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={() => { setIsMobileDrawerOpen(false); onLoginClick?.(); }}
              className="h-11 w-full rounded-full border-[#D5D7DA] font-heading text-sm font-bold text-[#0A0D12]"
            >
              Login
            </Button>
            <Button 
              onClick={() => { setIsMobileDrawerOpen(false); onRegisterClick?.(); }}
              className="h-11 w-full rounded-full bg-[#1C65DA] font-heading text-sm font-bold text-white"
            >
              Register
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}