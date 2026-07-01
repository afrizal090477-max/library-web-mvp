import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';

export function DesktopNavbarBeforeLogin() {
  return (
    <div className="flex h-[80px] items-center justify-center bg-white">
      <div className="flex w-full max-w-[1440px] items-center justify-between px-6 lg:px-[120px]">
        <Logo size="lg" />

        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="h-12 rounded-full border-[#D5D7DA] px-8 text-base font-bold">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="h-12 rounded-full bg-[#1C65DA] px-8 text-base font-bold hover:bg-[#1C65DA]/90">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}