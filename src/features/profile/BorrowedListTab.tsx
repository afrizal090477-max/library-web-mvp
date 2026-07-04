import { useState, useEffect } from "react";
import { Search, Star, X } from "lucide-react";
import { toast } from "sonner";

interface Loan {
  id: number;
  status: "BORROWED" | "LATE" | "RETURNED";
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  book: {
    id: number;
    title: string;
    coverImage: string;
    author?: { name: string };
    category?: { name: string };
  };
}

export function BorrowedListTab() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://library-backend-production-b9cf.up.railway.app/api/me/loans?page=1&limit=50",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const json = await response.json();
        if (json.success && json.data && Array.isArray(json.data.loans)) {
          setLoans(json.data.loans);
        } else {
          setLoans([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data pinjaman:", error);
        toast.error("Gagal memuat daftar pinjaman");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Silakan berikan rating minimal 1 bintang!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://library-backend-production-b9cf.up.railway.app/api/reviews",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId: selectedBookId,
            star: rating,
            comment: reviewText || null, 
          }),
        },
      );

      const json = await response.json();
      if (json.success || response.ok) {
        toast.success("Ulasan berhasil dikirim!");
        setIsReviewModalOpen(false);
        setRating(0);
        setReviewText("");
        setSelectedBookId(null);
      } else {
        toast.error(json.message || "Gagal mengirim ulasan");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReviewModal = (bookId: number) => {
    setSelectedBookId(bookId);
    setRating(0);
    setReviewText("");
    setIsReviewModalOpen(true);
  };

  const filteredLoans = loans.filter((loan) => {
    return loan.book?.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDuration = (borrowedAt: string, dueAt: string) => {
    const diffTime = Math.abs(
      new Date(dueAt).getTime() - new Date(borrowedAt).getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  return (
    <div className="flex flex-col items-start gap-[16px] md:gap-[24px] w-full animate-in fade-in duration-300">
      <h2 className="font-bold text-[24px] md:text-[28px] text-[#0A0D12]">
        Borrowed List
      </h2>

      <div className="flex flex-row items-center px-[16px] py-[8px] gap-[6px] w-full md:max-w-[544px] h-[44px] bg-white border border-[#D5D7DA] rounded-[9999px] focus-within:border-[#1C65DA] transition-colors">
        <Search className="w-[20px] h-[20px] text-[#535862] flex-shrink-0" />
        <input
          type="text"
          placeholder="Search book"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none font-medium text-[14px] text-[#535862]"
        />
      </div>

      <div className="flex flex-col gap-[16px] w-full mt-2">
        {loading ? (
          <div className="w-full text-center py-10 font-bold text-[#1C65DA] animate-pulse">
            Memuat daftar pinjaman...
          </div>
        ) : filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className="flex flex-col p-[16px] md:p-[20px] gap-[16px] md:gap-[20px] w-full bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[16px]"
            >
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex items-center gap-[8px] md:gap-[12px]">
                  <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">
                    Status
                  </span>
                  {loan.status === "BORROWED" && (
                    <div className="px-[8px] py-[2px] bg-[rgba(36,165,0,0.05)] rounded-[4px]">
                      <span className="font-bold text-[14px] text-[#24A500]">
                        Active
                      </span>
                    </div>
                  )}
                  {loan.status === "LATE" && (
                    <div className="px-[8px] py-[2px] bg-[rgba(238,29,82,0.1)] rounded-[4px]">
                      <span className="font-bold text-[14px] text-[#EE1D52]">
                        Late
                      </span>
                    </div>
                  )}
                  {loan.status === "RETURNED" && (
                    <div className="px-[8px] py-[2px] bg-gray-100 rounded-[4px]">
                      <span className="font-bold text-[14px] text-gray-600">
                        Returned
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-[8px] md:gap-[12px]">
                  <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">
                    {loan.status === "RETURNED" ? "Returned At" : "Due Date"}
                  </span>
                  <div className="px-[8px] py-[2px] bg-[rgba(238,29,82,0.1)] rounded-[4px]">
                    <span className="font-bold text-[14px] text-[#0A0D12]">
                      {loan.status === "RETURNED"
                        ? formatDate(loan.returnedAt!)
                        : formatDate(loan.dueAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[#D5D7DA]"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-[16px]">
                <div className="flex flex-row items-center gap-[16px] flex-1">
                  <img
                    src={
                      loan.book?.coverImage ||
                      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200"
                    }
                    alt={loan.book?.title}
                    className="w-[70px] h-[106px] md:w-[92px] md:h-[138px] object-cover rounded-sm flex-shrink-0"
                  />
                  <div className="flex flex-col items-start gap-[4px]">
                    <div className="border border-[#D5D7DA] rounded-[6px] px-[8px] h-[28px] flex items-center justify-center">
                      <span className="font-bold text-[14px] text-[#0A0D12] line-clamp-1">
                        {loan.book?.category?.name || "General"}
                      </span>
                    </div>
                    <h3 className="font-bold text-[16px] md:text-[20px] text-[#0A0D12] line-clamp-1">
                      {loan.book?.title}
                    </h3>
                    <p className="font-medium text-[14px] md:text-[16px] text-[#414651] line-clamp-1">
                      {loan.book?.author?.name || "Unknown Author"}
                    </p>
                    <div className="flex items-center gap-[8px] mt-1">
                      <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">
                        {formatDate(loan.borrowedAt)}
                      </span>
                      <div className="w-[4px] h-[4px] rounded-full bg-[#0A0D12]"></div>
                      <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12]">
                        Duration{" "}
                        {calculateDuration(loan.borrowedAt, loan.dueAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-[8px] w-full md:w-auto mt-[8px] md:mt-0">
                  {loan.status === "RETURNED" ? (
                    <button
                      onClick={() => openReviewModal(loan.book.id)}
                      className="flex-1 md:flex-none px-[24px] h-[40px] md:h-[48px] border border-[#1C65DA] hover:bg-[#F6F9FE] text-[#1C65DA] font-bold text-[14px] md:text-[16px] rounded-[100px] transition-colors outline-none"
                    >
                      Give Review
                    </button>
                  ) : (
                    <button className="flex-1 md:flex-none px-[24px] h-[40px] md:h-[48px] bg-[#1C65DA] hover:bg-[#1652b4] text-white font-bold text-[14px] md:text-[16px] rounded-[100px] transition-colors outline-none">
                      Read Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-10 font-medium text-[#A4A7AE]">
            Belum ada data pinjaman.
          </div>
        )}
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-[#0A0D12]/50 z-[100] flex items-center justify-center p-[16px] font-['Quicksand'] animate-in fade-in duration-200">
          <div className="flex flex-col items-center p-[16px] md:p-[24px] gap-[24px] w-full max-w-[345px] md:max-w-[439px] bg-white rounded-[16px] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-row items-center justify-between w-full">
              <h2 className="font-bold text-[18px] md:text-[24px] text-[#0A0D12]">
                Give Review
              </h2>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-[#0A0D12] hover:text-[#EE1D52] transition-colors outline-none"
              >
                <X className="w-[24px] h-[24px]" strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col items-center w-full">
              <span className="font-bold text-[14px] md:text-[16px] text-[#0A0D12] mb-[4px]">
                Give Rating
              </span>
              <div className="flex flex-row justify-center items-center gap-[4px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-[40px] h-[40px] md:w-[49px] md:h-[49px] cursor-pointer transition-colors ${
                      star <= rating
                        ? "fill-[#FDB022] text-[#FDB022]"
                        : "fill-[#A4A7AE] text-[#A4A7AE]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Please share your thoughts about this book"
              className="w-full h-[235px] border border-[#D5D7DA] rounded-[12px] p-[12px] font-medium text-[14px] md:text-[16px] text-[#0A0D12] outline-none focus:border-[#1C65DA] resize-none"
            />
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="flex justify-center items-center w-full h-[40px] md:h-[48px] bg-[#1C65DA] hover:bg-[#1652b4] disabled:opacity-50 text-white font-bold text-[14px] md:text-[16px] rounded-[200px] transition-colors outline-none"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}