import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/common/Footer'; 

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <Navbar />
      </header>
      <main className="flex-grow pt-[80px]">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}