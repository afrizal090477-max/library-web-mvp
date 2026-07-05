import { Button } from "@/components/ui/button"
import type { NavbarProps } from "@/types/navbar"

export default function DesktopMenu({ onLoginClick, onRegisterClick }: NavbarProps) {
  return (
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
  )
}