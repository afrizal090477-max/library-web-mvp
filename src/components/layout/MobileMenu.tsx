import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";

interface MobileMenuProps {
  onClose?: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo (klik untuk close + ke Home) */}
      <div
        onClick={onClose}
        className="flex items-center h-16 px-4 border-b cursor-pointer"
      >
        <Logo size="md" withText={false} />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <Button
          asChild
          variant="outline"
          className="justify-start w-full h-11"
          onClick={onClose}
        >
          <Link to="/login">Login</Link>
        </Button>

        <Button
          asChild
          className="w-full justify-start h-11 bg-[#1C65DA]"
          onClick={onClose}
        >
          <Link to="/register">Register</Link>
        </Button>
      </div>
    </div>
  );
}
