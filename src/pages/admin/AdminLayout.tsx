import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom"; 
import { 
  LayoutDashboard as DashIcon, 
  Users as UsersIcon, 
  BookOpen as BookIcon, 
  ScrollText as LoanIcon, 
  LogOut as LogoutIcon,
  Menu,
  X,
  UserIcon,
  PenTool,
  Tags
} from "lucide-react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/features/auth/authSlice";
import Logo from "@/assets/logo-brand.svg";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && (user.role === 'admin' || user.role === 'ADMIN'); 

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  
  if (!isAdmin) {
    return <Navigate to="/" replace />; 
  }

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: DashIcon, color: "text-[#1C65DA]" },
    { name: "Manage Authors", path: "/admin/authors", icon: PenTool, color: "text-purple-600" },
    { name: "Manage Books", path: "/admin/books", icon: BookIcon, color: "text-indigo-600" },
    { name: "Manage Categories", path: "/admin/categories", icon: Tags, color: "text-pink-600" },
    { name: "Manage Users", path: "/admin/users", icon: UsersIcon, color: "text-emerald-600" },
    { name: "Loan Records", path: "/admin/loans", icon: LoanIcon, color: "text-orange-600" },
    { name: "My Profile", path: "/admin/profile", icon: UserIcon, color: "text-slate-600" },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#F9FAFB]">
      
      {/* 🚀 FIX 1: BACKGROUND GAMBAR DITARUH DI LAYOUT (FULL SCREEN) */}
      <div 
        className="absolute inset-0 z-0 bg-fixed bg-center bg-no-repeat bg-cover" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000')" }} 
      />
      {/* Overlay Global Biar Gambar Gak Terlalu Terang */}
      <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-[6px]" />

      {/* Pembungkus Utama (z-10 agar di atas background) */}
      <div className="relative z-10 flex w-full h-screen">
        
        {/* Sidebar Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 🚀 FIX 2: SIDEBAR GLASSMORPHISM */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/50 backdrop-blur-lg border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex items-center justify-between h-16 px-6 mb-4 border-b border-black/5">
            <Link to="/admin/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex items-center justify-center w-8 h-8 p-1 border rounded-lg shadow-sm bg-white/80 border-white/60">
                <img src={Logo} alt="Booky Logo" className="object-contain w-full h-full" />
              </div>
              <span className="font-quicksand text-xl font-extrabold text-[#0A0D12] drop-shadow-sm">Booky Admin</span>
            </Link>
            <button className="lg:hidden text-[#4B5563]" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[14px] transition-all ${
                    isActive 
                      ? "bg-[#1C65DA]/90 text-white shadow-md backdrop-blur-md border border-white/20" 
                      : "text-[#4B5563] hover:bg-white/60 hover:text-[#0A0D12] hover:shadow-sm border border-transparent"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : item.color} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-black/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-[#EE1D52] rounded-xl hover:bg-white/60 transition-all border border-transparent hover:border-white/50 hover:shadow-sm"
            >
              <LogoutIcon size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Area Konten Utama */}
        <main className="flex flex-col flex-1 h-screen overflow-hidden">
          
          {/* 🚀 FIX 3: NAVBAR GLASSMORPHISM */}
          <header className="relative z-20 flex items-center justify-between flex-shrink-0 h-16 px-4 border-b shadow-sm bg-white/30 backdrop-blur-md border-white/50 lg:justify-end sm:px-8">
            <button 
              className="p-2 rounded-lg lg:hidden text-[#4B5563] hover:bg-white/60 shadow-sm border border-transparent hover:border-white/50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#374151] drop-shadow-sm">
                {user ? user.name : "Admin Library"}
              </span>
              <div className="w-9 h-9 rounded-full bg-white/80 border border-white/60 shadow-sm flex items-center justify-center text-[#1C65DA] font-bold uppercase backdrop-blur-sm">
                {user && user.name ? user.name.substring(0, 2) : "AL"}
              </div>
            </div>
          </header>
          
          {/* Tempat ngerender halaman (Dashboard, Books, dll) */}
          <div className="flex-1 p-4 overflow-auto sm:p-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}