import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/lib/api"; 

export interface LoanItem {
  id: number;
  status: string; // "BORROWED" atau "RETURNED"
  displayStatus?: string;
  borrowedAt?: string; // Sesuai respons API
  borrowDate?: string; 
  dueAt?: string;      // Sesuai respons API
  dueDate?: string; 
  durationDays?: number; // Sesuai respons API
  borrower?: { name: string }; // Sesuai respons API
  user?: { name: string };
  User?: { name: string }; 
  book?: {
    title: string;
    coverImage?: string;
    category?: { name: string };
    author?: { name: string };
  };
  Book?: {
    title: string;
    coverImage?: string;
    category?: { name: string };
    author?: { name: string };
  };
}

export function AdminLoanList() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  const [activeFilter, setActiveFilter] = useState("Active"); // Default ke tab Active biar langsung kelihatan yang lagi dipinjam
  const filters = ["All", "Active", "Returned", "Overdue"];

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        // 🚀 Tembak langsung ke URL API Production Railway
        const res = await fetch(`${BASE_URL}/admin/loans?status=all&page=1&limit=100`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) throw new Error("Gagal mengambil data peminjaman");
        
        const json = await res.json();
        const loanData = Array.isArray(json.data) ? json.data : json.data?.loans || [];
        setLoans(loanData);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan sistem");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const calculateDuration = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    if (isNaN(start) || isNaN(end)) return 0;
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };

  // 🚀 ACTION FIX: LOGIC FILTER KAPITAL DAN SINKRONISASI FIELD API
  const filteredLoans = loans.filter((loan) => {
    const bookData = loan.book || loan.Book;
    const userData = loan.borrower || loan.user || loan.User; // Sesuaikan dengan API
    
    const titleMatch = bookData?.title?.toLowerCase().includes(search.toLowerCase()) || false;
    const userMatch = userData?.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchSearch = titleMatch || userMatch;
    
    let matchFilter = true;
    if (activeFilter === "Active") {
      matchFilter = loan.status === "BORROWED";
    } else if (activeFilter === "Returned") {
      matchFilter = loan.status === "RETURNED";
    } else if (activeFilter === "Overdue") {
      const dueDate = new Date(loan.dueAt || loan.dueDate || "");
      matchFilter = loan.status === "BORROWED" && new Date() > dueDate;
    }
    
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 px-4 sm:px-0">
      
      <div className="flex items-center p-2 gap-2 bg-[#F5F5F5] rounded-2xl w-full max-w-[600px] overflow-x-auto hide-scrollbar mt-4 sm:mt-0">
        <button
          className="flex-1 min-w-fit whitespace-nowrap py-2 px-3 text-sm sm:text-base rounded-xl transition-all duration-300 font-quicksand bg-white text-[#0A0D12] font-bold shadow-[0_0_20px_rgba(203,202,202,0.25)]"
        >
          Borrowed List
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="flex-1 min-w-fit whitespace-nowrap py-2 px-3 text-sm sm:text-base rounded-xl transition-all duration-300 font-quicksand text-[#535862] font-medium hover:bg-gray-200"
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
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#0A0D12] tracking-[-0.03em] font-quicksand">
          Borrowed List
        </h1>
        
        <div className="relative w-full max-w-[600px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535862]" size={20} />
          <input
            type="text"
            placeholder="Search by book or borrower..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 sm:h-12 pl-12 pr-4 bg-white border border-[#D5D7DA] rounded-full font-quicksand text-sm font-medium text-[#535862] focus:outline-none focus:border-[#1C65DA]"
          />
        </div>
      </div>

      <div className="flex w-full gap-2 pb-2 overflow-x-auto hide-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border font-quicksand text-sm sm:text-base transition-colors whitespace-nowrap ${
              activeFilter === filter
                ? "bg-[#F6F9FE] border-[#1C65DA] text-[#1C65DA] font-bold"
                : "bg-white border-[#D5D7DA] text-[#0A0D12] font-semibold hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-[#535862] animate-pulse font-quicksand">Memuat data peminjaman...</div>
        ) : error ? (
          <div className="p-8 font-bold text-center text-[#EE1D52] font-quicksand">{error}</div>
        ) : filteredLoans.length === 0 ? (
          <div className="p-8 text-center text-[#535862] font-quicksand">Data tidak ditemukan</div>
        ) : (
          filteredLoans.map((loan) => {
            const bookInfo = loan.book || loan.Book;
            const userInfo = loan.borrower || loan.user || loan.User;
            const borrowDateStr = formatDate(loan.borrowedAt || loan.borrowDate);
            const dueAtStr = formatDate(loan.dueAt || loan.dueDate);
            const duration = loan.durationDays || calculateDuration(loan.borrowedAt || loan.borrowDate, loan.dueAt || loan.dueDate);
            
            const isReturned = loan.status?.toUpperCase() === "RETURNED";
            const dueDateObj = new Date(loan.dueAt || loan.dueDate || "");
            const isOverdue = loan.status?.toUpperCase() === "BORROWED" && new Date() > dueDateObj;
            
            // Logika pewarnaan status yang lebih akurat
            let displayStatus = loan.status;
            let statusColor = "text-[#079455]"; // Default hijau (Active)
            
            if (isReturned) {
              displayStatus = "RETURNED";
              statusColor = "text-[#535862]"; // Abu-abu
            } else if (isOverdue) {
              displayStatus = "OVERDUE";
              statusColor = "text-[#EE1D52]"; // Merah
            }

            return (
              <div key={loan.id} className="flex flex-col p-4 sm:p-5 gap-4 w-full bg-white border border-[#E5E7EB] rounded-2xl relative shadow-sm hover:shadow-md transition-shadow">
                
                <div className="flex justify-between items-center w-full pb-3 border-b border-[#F5F5F5]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-[#535862] font-quicksand">Status</span>
                    <span className={`text-xs sm:text-sm font-bold ${statusColor} font-quicksand uppercase`}>
                      {displayStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-[#535862] font-quicksand">Due Date</span>
                    <span className={`px-2 py-1 rounded text-xs sm:text-sm font-bold font-quicksand ${isOverdue ? 'bg-[#EE1D52]/10 text-[#EE1D52]' : 'bg-gray-100 text-[#0A0D12]'}`}>
                      {dueAtStr}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row">
                  
                  <div className="flex items-start gap-4">
                    <img 
                      src={bookInfo?.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(bookInfo?.title || 'Book')}&background=E0ECFF&color=1C65DA`} 
                      alt={bookInfo?.title} 
                      className="w-[72px] h-[108px] object-cover rounded-md flex-shrink-0 border border-[#D5D7DA]"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-0.5 border border-[#D5D7DA] rounded text-[10px] sm:text-xs font-bold text-[#0A0D12] font-quicksand w-fit">
                        {bookInfo?.category?.name || "Uncategorized"}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em] line-clamp-2 mt-1">
                        {bookInfo?.title || "Unknown Book"}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-[#535862] font-quicksand">
                        {bookInfo?.author?.name || "Unknown Author"}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[#0A0D12] font-quicksand mt-2">
                        {borrowDateStr} <span className="text-[#535862] font-medium mx-1">•</span> Duration {duration} Days
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start mt-2 sm:items-end sm:mt-0">
                    <span className="text-xs sm:text-sm font-medium text-[#535862] font-quicksand mb-1">
                      Borrower's Name
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0A0D12] font-quicksand">
                      {userInfo?.name || "Unknown User"}
                    </span>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}