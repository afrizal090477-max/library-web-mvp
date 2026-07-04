import { useEffect, useState } from "react";
import { getAdminOverview, AdminOverviewData } from "@/lib/api";
import { BookOpen, Users, Clock, AlertOctagon } from "lucide-react";

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex items-center justify-center h-full">
        <p className="text-lg font-bold text-[#6B7280] animate-pulse">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 border border-red-200 bg-red-50 rounded-xl">
        <h3 className="font-bold">Error!</h3>
        <p>{error}</p>
      </div>
    );
  }

  // 👇 CARA BACA DATANYA UDAH KITA SESUAIKAN SAMA JSON HENRY 👇
  const totalBooks = overview?.totals?.books || 0;
  const totalMembers = overview?.totals?.users || 0;
  const activeLoans = overview?.loans?.active || 0;
  const overdueLoans = overview?.loans?.overdue || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A0D12]">Dashboard Overview</h1>
        <p className="text-[#6B7280]">Ringkasan data perpustakaan hari ini.</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Total Buku */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#1C65DA] rounded-full flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Total Buku</p>
            <h3 className="text-2xl font-bold text-[#0A0D12]">{totalBooks}</h3>
          </div>
        </div>

        {/* Card 2: Total Member */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 text-green-600 rounded-full bg-green-50">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Total Member</p>
            <h3 className="text-2xl font-bold text-[#0A0D12]">{totalMembers}</h3>
          </div>
        </div>

        {/* Card 3: Sedang Dipinjam */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 text-orange-500 rounded-full bg-orange-50">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Buku Dipinjam</p>
            <h3 className="text-2xl font-bold text-[#0A0D12]">{activeLoans}</h3>
          </div>
        </div>

        {/* Card 4: Telat Mengembalikan (Overdue) */}
        <div className="flex items-center gap-4 p-6 bg-white border border-red-100 shadow-sm rounded-2xl">
          <div className="w-12 h-12 bg-red-50 text-[#EE1D52] rounded-full flex items-center justify-center">
            <AlertOctagon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-red-600">Telat Kembali</p>
            <h3 className="text-2xl font-bold text-[#EE1D52]">{overdueLoans}</h3>
          </div>
        </div>

      </div>
    </div>
  );
}