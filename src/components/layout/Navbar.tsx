import { useAppSelector } from '@/hooks/useAppSelector';
import { DesktopNavbarBeforeLogin } from './DesktopNavbarBeforeLogin';
import { DesktopNavbarAfterLogin } from './DesktopNavbarAfterLogin';
import { MobileNavbarBeforeLogin } from './MobileNavbarBeforeLogin';
import { MobileNavbarAfterLogin } from './MobileNavbarAfterLogin';

export function Navbar() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="absolute top-0 left-0 z-50 w-full bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      <div className="hidden md:block">
        {user ? <DesktopNavbarAfterLogin /> : <DesktopNavbarBeforeLogin />}
      </div>
      <div className="md:hidden">
        {user ? <MobileNavbarAfterLogin /> : <MobileNavbarBeforeLogin />}
      </div>
    </nav>
  );
}