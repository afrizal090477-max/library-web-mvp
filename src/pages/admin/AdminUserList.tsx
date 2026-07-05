import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminUsers } from "@/lib/api";


interface UserItem {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

interface AdminUserResponse {
  data: {
    users: UserItem[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
  };
}


export function AdminUserList() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = (await getAdminUsers(currentPage, limit, search)) as AdminUserResponse;
        
        setUsers(response.data?.users || []);
        setTotalPages(response.data?.pagination?.totalPages || 1);
        setTotalEntries(response.data?.pagination?.total || 0);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, search]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); 
  };

  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalEntries);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const range = 1; 

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-2xl font-quicksand">
      <div className="p-6 border-b border-[#E5E7EB]">
        <h1 className="text-[24px] font-extrabold text-[#0A0D12] mb-4">User</h1>
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-[#6B7280]" />
          </div>
          <input
            type="text"
            placeholder="Search user by name or email..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D5D7DA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C65DA]/20 focus:border-[#1C65DA] transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[13px] text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]/50">
              <th className="px-6 py-4 font-bold">No</th>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Nomor Handphone</th>
              <th className="px-6 py-4 font-bold">Created at</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[#6B7280] font-bold animate-pulse">
                  Loading users data...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4 text-[14px] font-bold text-[#0A0D12]">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#0A0D12]">{user.name}</td>
                  <td className="px-6 py-4 text-[14px] text-[#4B5563]">{user.email}</td>
                  <td className="px-6 py-4 text-[14px] text-[#4B5563]">{user.phone || "-"}</td>
                  <td className="px-6 py-4 text-[14px] text-[#6B7280]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[#6B7280] font-semibold">
                  Tidak ada user yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-white rounded-b-2xl">
        <p className="text-[14px] font-medium text-[#4B5563]">
          Showing <span className="font-bold text-[#0A0D12]">{startEntry}</span> to <span className="font-bold text-[#0A0D12]">{endEntry}</span> of <span className="font-bold text-[#0A0D12]">{totalEntries}</span> entries
        </p>
        
        <div className="flex items-center gap-1 bg-white border border-[#D5D7DA] rounded-lg p-0.5 shadow-sm">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-semibold text-[#4B5563] hover:bg-[#F3F4F6] disabled:opacity-50 disabled:hover:bg-white rounded-md transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return (
                <span key={idx} className="px-2 py-1.5 text-[13px] font-bold text-[#6B7280] cursor-default select-none">
                  ...
                </span>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => setCurrentPage(Number(page))}
                className={`px-3 py-1.5 text-[13px] font-bold rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-[#E0ECFF] text-[#1C65DA]" 
                    : "text-[#4B5563] hover:bg-[#F3F4F6]" 
                }`}
              >
                {page}
              </button>
            );
          })}

          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-semibold text-[#4B5563] hover:bg-[#F3F4F6] disabled:opacity-50 disabled:hover:bg-white rounded-md transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}