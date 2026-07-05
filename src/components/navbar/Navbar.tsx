import { useState } from "react"
import { Button } from "@/components/ui/button" // Menggunakan shadcn button resmi
import { Search, ShoppingBag, Menu, X } from "lucide-react"
import type { NavbarProps } from "@/types/navbar"
import logoBrand from "@/assets/logo-brand.svg" // Logo resmi dari assets

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [isMobileSearchActive, setIsMobileMenuSearchActive] = useState<boolean>(false)

  // 1. LAYOUT MOBILE: MODE SEARCH AKTIF (Width: 393px, Height: 64px)
  if (isMobileSearchActive) {
    return (
      <nav className="sticky top-0 z-50 w-full h-16 bg-white px-4 flex flex-row items-center gap-4 shadow-[0_0_20px_rgba(203,202,202,0.25)] md:hidden">
        {/* Logo Brand Asli Mobile (40px x 40px) */}
        <img src={logoBrand} alt="Booky Logo" className="h-10 w-10 shrink-0 object-contain" />

        {/* Search Large Wrapper (Width: 265px, Height: 40px) */}
        <div className="flex flex-row items-center gap-1.5 flex-1 h-10 px-3 bg-white border border-[#D5D7DA] rounded-full">
          <Search className="h-5 w-5 text-[#535862] shrink-0" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full font-sans text-sm font-medium text-[#535862] tracking-tight bg-transparent focus:outline-none"
            autoFocus
          />
          <button 
            onClick={() => setIsMobileMenuSearchActive(false)} 
            className="text-[#0A0D12] focus:outline-none p-0.5"
            aria-label="Close search"
          >
            <X className="h-6 w-6 stroke-[2]" />
          </button>
        </div>
      </nav>
    )
  }

  // 2. LAYOUT DEFAULT: DESKTOP (1440px) & MOBILE STANDARD (393px)
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#D5D7DA] shadow-[0_0_20px_rgba(203,202,202,0.25)]">
      <div className="mx-auto flex items-center justify-between h-20 max-w-7xl px-4 md:px-[120px]">
        
        {/* LOGO CONTAINER (Frame 37) - Width: 155px, Height: 42px */}
        <div className="flex items-center gap-[15px] h-[42px] w-[155px]">
          {/* Logo Brand Asli Desktop (42px x 42px) */}
          <img src={logoBrand} alt="Booky Logo" className="h-[42px] w-[42px] shrink-0 object-contain" />
          
          {/* Brand Name Text (Booky) */}
          <span className="font-sans text-[32px] font-bold leading-[42px] text-[#0A0D12]">
            Booky
          </span>
        </div>

        {/* DESKTOP ACTIONS (Frame 88) - Menggunakan Shadcn Button */}
        <div className="hidden items-center justify-end gap-4 md:flex flex-1 max-w-[688.5px] h-12">
          <Button 
            variant="outline" 
            onClick={onLoginClick}
            className="h-12 w-[163px] rounded-full border-[#D5D7DA] font-sans text-base font-bold text-[#0A0D12] tracking-tight hover:bg-slate-50"
          >
            Login
          </Button>
          <Button 
            onClick={onRegisterClick}
            className="h-12 w-[163px] rounded-full bg-[#1C65DA] font-sans text-base font-bold text-[#FDFDFD] tracking-tight hover:bg-[#1C65DA]/90"
          >
            Register
          </Button>
        </div>

        {/* MOBILE ACTIONS STANDARD (Frame 38) */}
        <div className="flex items-center gap-4 h-7 md:hidden">
          <button 
            onClick={() => setIsMobileMenuSearchActive(true)}
            className="text-[#0A0D12] hover:opacity-80 p-0.5 focus:outline-none" 
            aria-label="Open search menu"
          >
            <Search className="h-6 w-6 stroke-[2]" />
          </button>
          
          {/* Bag Container with Counter Badge (Frame 92) */}
          <button className="relative p-0.5 text-[#0A0D12] hover:opacity-80 focus:outline-none" aria-label="Cart">
            <ShoppingBag className="h-7 w-7 stroke-[2]" />
            <span className="absolute -top-[3px] -right-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-[#EE1D52] font-sans text-[12px] font-bold text-white tracking-tight">
              1
            </span>
          </button>

          <button className="text-[#0A0D12] hover:opacity-80 p-0.5 focus:outline-none" aria-label="Navigation Menu">
            <Menu className="h-6 w-6 stroke-[2]" />
          </button>
        </div>

      </div>
    </nav>
  )
}