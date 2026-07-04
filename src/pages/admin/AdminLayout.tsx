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
  UserIcon
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
    { name: "Dashboard", path: "/admin/dashboard", icon: DashIcon },
    { name: "Manage Books", path: "/admin/books", icon: BookIcon },
    { name: "Manage Users", path: "/admin/users", icon: UsersIcon },
    { name: "Loan Records", path: "/admin/loans", icon: LoanIcon },
    { name: "My Profile", path: "/admin/profile", icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E7EB] mb-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-[#D5D7DA] bg-white p-1 shadow-sm">
              <img src={Logo} alt="Booky Logo" className="object-contain w-full h-full" />
            </div>
            <span className="font-quicksand text-xl font-bold text-[#0A0D12]">Booky Admin</span>
          </Link>
          
          <button className="lg:hidden text-[#6B7280]" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive 
                    ? "bg-[#1C65DA] text-white" 
                    : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-[#6B7280]"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-[#EE1D52] rounded-lg hover:bg-[#FEF2F2] transition-colors"
          >
            <LogoutIcon size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex flex-col flex-1 h-screen overflow-hidden">
        <header className="h-16 flex-shrink-0 bg-white border-b border-[#E5E7EB] flex items-center justify-between lg:justify-end px-4 sm:px-8">
          <button 
            className="lg:hidden p-2 text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#374151]">
              {user ? user.name : "Admin Library"}
            </span>
            <div className="w-9 h-9 rounded-full bg-[#E0ECFF] flex items-center justify-center text-[#1C65DA] font-bold uppercase">
              {user && user.name ? user.name.substring(0, 2) : "AL"}
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 overflow-auto sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}