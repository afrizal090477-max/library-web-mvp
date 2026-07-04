import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/lib/api"; 

export interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profilePhoto?: string;
  createdAt?: string;
}

export function AdminUserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/admin/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) throw new Error("Gagal mengambil data pengguna");
        const json = await res.json();
        const userData = Array.isArray(json.data) ? json.data : json.data?.users || [];
        setUsers(userData);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan sistem");
      } finally {
        setIsLoading(false); 
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12">
      <div className="flex items-center p-2 gap-2 bg-[#F5F5F5] rounded-2xl w-full max-w-[600px] overflow-x-auto hide-scrollbar">
        <button
          onClick={() => navigate("/admin/loans")}
          className="flex-1 min-w-fit whitespace-nowrap py-2 px-3 text-sm sm:text-base rounded-xl transition-all duration-300 font-quicksand text-[#535862] font-medium hover:bg-gray-200"
        >
          Borrowed List
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="flex-1 min-w-fit whitespace-nowrap py-2 px-3 text-sm sm:text-base rounded-xl transition-all duration-300 font-quicksand text-[#535862] font-medium hover:bg-white shadow-sm"
        >
          User
        </button>
        <button
          onClick={() => navigate("/admin/books")}
          className="flex-1 min-w-fit whitespace-nowrap py-2 px-3 text-sm sm:text-base rounded-xl transition-all duration-300 font-quicksand text-[#535862] font-medium hover:bg-gray-200"
        >
          Book List
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#0A0D12] tracking-[-0.02em] font-quicksand">User</h1>
        <div className="relative w-full max-w-[600px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535862]" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 sm:h-12 pl-12 pr-4 bg-white border border-[#D5D7DA] rounded-full font-quicksand text-sm font-medium text-[#535862] focus:outline-none focus:border-[#1C65DA]"
          />
        </div>
      </div>

      <div className="hidden md:block bg-white border border-[#D5D7DA] rounded-xl shadow-[0_0_24px_rgba(203,202,202,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#D5D7DA]">
              <th className="px-4 py-4 text-sm font-bold text-[#0A0D12] w-16 text-center">No</th>
              <th className="px-4 py-4 text-sm font-bold text-[#0A0D12]">Name</th>
              <th className="px-4 py-4 text-sm font-bold text-[#0A0D12]">Email</th>
              <th className="px-4 py-4 text-sm font-bold text-[#0A0D12]">Nomor Handphone</th>
              <th className="px-4 py-4 text-sm font-bold text-[#0A0D12]">Created at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D5D7DA]">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#535862] animate-pulse">Memuat data...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="p-8 font-bold text-center text-[#EE1D52]">{error}</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#535862]">Data tidak ditemukan</td></tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-4 text-base font-semibold text-[#0A0D12] text-center">{index + 1}</td>
                  <td className="px-4 py-4 text-base font-semibold text-[#0A0D12]">{user.name}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#0A0D12]">{user.email}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#0A0D12]">{user.phone || "-"}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#0A0D12]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#535862] animate-pulse">Memuat data...</div>
        ) : error ? (
          <div className="p-8 font-bold text-center text-[#EE1D52]">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-[#535862]">Data tidak ditemukan</div>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={user.id} className="bg-white rounded-xl p-3 border border-[#D5D7DA] shadow-[0_0_20px_rgba(203,202,202,0.25)] space-y-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-semibold text-[#0A0D12]">No</span>
                <span className="text-sm font-semibold text-[#0A0D12]">{index + 1}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-semibold text-[#0A0D12]">Name</span>
                <span className="text-sm font-semibold text-[#0A0D12]">{user.name}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-semibold text-[#0A0D12]">Email</span>
                <span className="text-sm font-bold text-[#0A0D12] truncate max-w-[150px]">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-semibold text-[#0A0D12]">Nomor Handphone</span>
                <span className="text-sm font-bold text-[#0A0D12]">{user.phone || "-"}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-semibold text-[#0A0D12]">Created at</span>
                <span className="text-sm font-bold text-[#0A0D12]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "-"}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 pb-12 border-t border-[#D5D7DA] gap-4">
          <p className="text-base font-medium text-[#0A0D12] font-quicksand">Showing 1 to {Math.min(10, filteredUsers.length)} of {filteredUsers.length} entries</p>
          <div className="flex items-center gap-2 bg-white sm:gap-4 font-quicksand">
            <button className="flex items-center gap-1.5 text-base font-medium text-[#0A0D12] hover:opacity-70">
              <ChevronLeft size={20} /> Previous
            </button>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="w-10 h-10 flex items-center justify-center text-base font-medium text-[#0A0D12] border border-[#D5D7DA] rounded-[10px]">1</button>
            </div>
            <button className="flex items-center gap-1.5 text-base font-medium text-[#0A0D12] hover:opacity-70">
              Next <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}