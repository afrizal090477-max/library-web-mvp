import { useEffect, useState } from "react";
import { getAdminOverview, AdminOverviewData } from "@/lib/api";
import { BookOpen, Users, Clock, AlertOctagon, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo-brand.svg";

interface TopBook {
  id: number | string;
  title: string;
  coverImage?: string;
  author?: { name: string };
  borrowCount?: number;
}

interface OverdueLoan {
  id: number | string;
  user?: { name: string };
  book?: { title: string };
  borrowDate?: string;
}

type ExtendedOverview = AdminOverviewData & {
  topBorrowed?: TopBook[]; 
  overdueLoansList?: OverdueLoan[];
  loans?: {
    active?: number;
    overdue?: number;
    overdueList?: OverdueLoan[];
  };
};

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminOverview();
        setOverview(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal mengambil data dari server");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <p className="text-lg font-bold text-[#6B7280] animate-pulse font-quicksand">Loading dashboard data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-red-600 border border-red-200 bg-red-50 rounded-xl font-quicksand">
        <h3 className="font-bold text-[18px]">Error!</h3>
        <p>{error}</p>
      </div>
    );
  }

  const totalBooks = overview?.totals?.books || 0;
  const totalMembers = overview?.totals?.users || 0;
  const activeLoans = overview?.loans?.active || 0;
  const overdueLoansCount = overview?.loans?.overdue || 0;
  
  const overviewData = overview as unknown as ExtendedOverview;
  const topBooks: TopBook[] = overviewData?.topBorrowed || []; 
  const overdueList: OverdueLoan[] = overviewData?.overdueLoansList || overviewData?.loans?.overdueList || [];

  return (
    <div className="relative z-10 pb-10 space-y-6 font-quicksand">
      <div>
        <h1 className="text-[24px] font-extrabold text-[#0A0D12] drop-shadow-sm">Dashboard Overview</h1>
        <p className="text-[#4B5563] text-[15px] font-medium drop-shadow-sm">Ringkasan data perpustakaan hari ini.</p>
      </div>
      
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white/50 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md flex flex-col sm:flex-row items-center gap-5">
        <div className="relative z-10 flex items-center justify-center flex-shrink-0 w-16 h-16 p-3 border shadow-md rounded-2xl bg-white/90 border-white/60">
          <img src={Logo} alt="Booky Logo" className="object-contain w-full h-full" />
        </div>
        <div className="relative z-10 text-center sm:text-left space-y-0.5 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#1C65DA] drop-shadow-sm">
            <Sparkles size={16} className="animate-spin-[duration:4s]" />
            <span className="text-xs font-bold tracking-wider uppercase font-redhat">Welcome back, Admin</span>
          </div>
          <h2 className="text-[22px] md:text-[26px] font-extrabold text-[#0A0D12] tracking-tight leading-tight drop-shadow-sm">
            Booky Library Overview
          </h2>
          <p className="text-[#4B5563] text-sm md:text-[15px] font-semibold italic drop-shadow-sm">
            "Unlocking Knowledge, Inspiring Minds."
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white/60 border border-white/60 backdrop-blur-lg rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex items-center gap-4 transition-all hover:-translate-y-1 hover:bg-white/80">
          <div className="w-12 h-12 bg-[#E0ECFF]/90 text-[#1C65DA] shadow-inner rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#4B5563]">Total Buku</p>
            <h3 className="text-[26px] leading-tight font-extrabold text-[#0A0D12]">{totalBooks}</h3>
          </div>
        </div>

        <div className="p-6 bg-white/60 border border-white/60 backdrop-blur-lg rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex items-center gap-4 transition-all hover:-translate-y-1 hover:bg-white/80">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-[#079455] shadow-inner rounded-full bg-[#E7F6F0]/90">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#4B5563]">Total Member</p>
            <h3 className="text-[26px] leading-tight font-extrabold text-[#0A0D12]">{totalMembers}</h3>
          </div>
        </div>

        <div className="p-6 bg-white/60 border border-white/60 backdrop-blur-lg rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex items-center gap-4 transition-all hover:-translate-y-1 hover:bg-white/80">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-[#E26E26] shadow-inner rounded-full bg-[#FEF4E9]/90">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#4B5563]">Buku Dipinjam</p>
            <h3 className="text-[26px] leading-tight font-extrabold text-[#0A0D12]">{activeLoans}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-white/60 border border-red-200/50 backdrop-blur-lg shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl transition-all hover:-translate-y-1 hover:bg-white/80">
          <div className="w-12 h-12 bg-[#FEE4E2]/90 text-[#EE1D52] shadow-inner rounded-full flex items-center justify-center flex-shrink-0">
            <AlertOctagon size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#EE1D52]">Telat Kembali</p>
            <h3 className="text-[26px] leading-tight font-extrabold text-[#EE1D52]">{overdueLoansCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-3">
        
        <div className="lg:col-span-2 bg-white/60 border border-white/60 backdrop-blur-lg rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-5 md:p-6 flex flex-col h-full min-h-[350px]">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/5">
            <h2 className="text-[18px] font-extrabold text-[#0A0D12] flex items-center gap-2">
              <AlertCircle className="text-[#EE1D52]" size={20} />
              Peringatan Telat Kembali
            </h2>
            <span onClick={() => navigate("/admin/loans")} className="text-[14px] font-bold text-[#1C65DA] cursor-pointer hover:underline">
              Lihat Semua
            </span>
          </div>
          <div className="flex-1 overflow-x-auto">
            {overdueList.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-[13px] text-[#6B7280] border-b border-black/5">
                    <th className="pb-3 font-bold">Member</th>
                    <th className="pb-3 font-bold">Judul Buku</th>
                    <th className="pb-3 font-bold">Tgl. Pinjam</th>
                    <th className="pb-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueList.slice(0, 5).map((loan, idx) => (
                    <tr key={loan.id || idx} className="transition-colors border-b border-black/5 hover:bg-white/40">
                      <td className="py-3 text-[14px] font-bold text-[#0A0D12]">{loan.user?.name || "Unknown User"}</td>
                      <td className="py-3 text-[14px] font-semibold text-[#4B5563] truncate max-w-[180px]">{loan.book?.title || "Unknown Book"}</td>
                      <td className="py-3 text-[14px] font-medium text-[#6B7280]">{loan.borrowDate ? new Date(loan.borrowDate).toLocaleDateString() : "-"}</td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#FEE4E2]/80 text-[#EE1D52] shadow-sm">
                          Overdue
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <AlertCircle className="text-[#0A0D12]/30 mb-2" size={32} />
                <p className="text-[#4B5563] text-[15px] font-bold">Aman terkendali!</p>
                <p className="text-[#6B7280] text-[13px] font-medium">Tidak ada member yang telat kembali saat ini.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white/60 border border-white/60 backdrop-blur-lg rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-5 md:p-6 flex flex-col h-full min-h-[350px]">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/5">
            <h2 className="text-[18px] font-extrabold text-[#0A0D12] flex items-center gap-2">
              <TrendingUp className="text-[#1C65DA]" size={20} />
              Buku Terpopuler
            </h2>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            {topBooks.length > 0 ? (
              topBooks.slice(0, 4).map((book, idx) => (
                <div key={book.id || idx} onClick={() => navigate("/admin/books")} className="flex items-center gap-3 p-2 transition-all border border-transparent shadow-sm cursor-pointer rounded-xl bg-white/30 hover:bg-white/70 hover:border-white/80 hover:shadow-md">
                  <div className="w-[48px] h-[64px] bg-white/90 rounded-md overflow-hidden flex-shrink-0 border border-[#E5E7EB] shadow-sm">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#A4A7AE] text-[10px] font-bold bg-[#F3F4F6]">No Cover</div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="text-[14px] font-extrabold text-[#0A0D12] truncate drop-shadow-sm">{book.title || "Unknown Book"}</h4>
                    <p className="text-[12px] font-semibold text-[#4B5563] truncate">{book.author?.name || "Unknown Author"}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#1C65DA] bg-[#E0ECFF]/90 shadow-sm w-fit px-2 py-0.5 rounded-full">
                      <TrendingUp size={10} />
                      {book.borrowCount || 0}x dipinjam
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <BookOpen className="text-[#0A0D12]/30 mb-2" size={32} />
                <p className="text-[#4B5563] text-[14px] font-bold">Belum ada data popularitas buku bulan ini.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}