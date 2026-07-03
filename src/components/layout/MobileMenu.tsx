import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  onClose?: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    // Posisi absolut, lebar penuh (393px di mobile), tinggi persis 72px, menempel di bawah Navbar
    <div className="absolute left-0 right-0 top-[64px] flex flex-col items-start p-[16px] gap-[16px] w-full h-[72px] bg-white border-t border-[#D5D7DA] shadow-[0px_4px_20px_rgba(203,202,202,0.25)] z-50 font-['Quicksand'] animate-in slide-in-from-top-2 duration-200">
      
      {/* Container Tombol */}
      <div className="flex flex-row items-center gap-[12px] w-full h-[40px]">
        
        {/* Tombol Login */}
        <Button
          asChild
          variant="outline"
          className="flex-1 h-[40px] rounded-[100px] border border-[#D5D7DA] text-[#0A0D12] font-bold text-[14px] hover:bg-gray-50 transition-colors shadow-none"
          onClick={onClose}
        >
          <Link to="/login" className="flex items-center justify-center">
            Login
          </Link>
        </Button>

        {/* Tombol Register */}
        <Button
          asChild
          className="flex-1 h-[40px] rounded-[100px] bg-[#1C65DA] hover:bg-[#1652b4] text-[#FDFDFD] font-bold text-[14px] transition-colors shadow-none"
          onClick={onClose}
        >
          <Link to="/register" className="flex items-center justify-center">
            Register
          </Link>
        </Button>
        
      </div>

    </div>
  );
}