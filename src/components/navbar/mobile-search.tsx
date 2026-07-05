import { Search, X } from "lucide-react"

interface MobileSearchProps {
  onClose: () => void
  logoBrand: string
}

export default function MobileSearch({ onClose, logoBrand }: MobileSearchProps) {
  return (
    <nav className="sticky top-0 z-50 w-full max-w-[393px] h-16 bg-white px-4 flex flex-row items-center justify-between shadow-[0_0_20px_rgba(203,202,202,0.25)] md:hidden mx-auto border-b border-[#D5D7DA]">
      {/* 1. LOGO DENGAN KOTAK BORDER HIJAU FIGMA */}
      <div className="h-10 w-10 shrink-0 border border-[#079455] p-1 flex items-center justify-center bg-white box-border rounded-none">
        <img src={logoBrand} alt="Booky Logo" className="h-full w-full object-contain" />
      </div>

      {/* 2. CONTAINER BOX INPUT UTAMA (Width: 265px) */}
      <div className="flex flex-row items-center gap-[6px] w-[265px] h-10 px-3 bg-white border border-[#D5D7DA] rounded-full box-border">
        <Search className="h-5 w-5 text-[#535862] shrink-0" />
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full h-7 font-heading text-sm font-medium text-[#535862] tracking-[-0.03em] bg-transparent focus:outline-none"
          autoFocus
        />
      </div>

      {/* 3. TOMBOL X BENAR-BENAR BERADA DI LUAR CONTAINER BOX INPUT */}
      <button 
        onClick={onClose} 
        className="text-[#0A0D12] hover:opacity-70 p-1 focus:outline-none shrink-0 cursor-pointer"
        aria-label="Close search layout"
      >
        <X className="h-6 w-6 stroke-[2]" />
      </button>
    </nav>
  )
}