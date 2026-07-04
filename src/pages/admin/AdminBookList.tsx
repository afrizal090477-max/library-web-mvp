import { useEffect, useState } from "react";
import { Search, Star, MoreHorizontal, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "@/lib/api"; // 🚀 Import BASE_URL di sini!

export interface AdminBookItem {
  id: number;
  title: string;
  author: { name: string };
  category: { name: string };
  availableCopies: number; // 🚀 Ganti stock jadi ini
  borrowCount: number;     // 🚀 Tambahkan ini
  rating: number;
  coverImage?: string;
}

export function AdminBookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<AdminBookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Available", "Borrowed", "Returned", "Damaged"];
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [bookToDelete, setBookToDelete] = useState<{id: number, title: string} | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        // 🚀 PERBAIKAN: Gunakan BASE_URL untuk GET data buku
        const res = await fetch(`${BASE_URL}/admin/books`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data buku dari server");
        const json = await res.json();
        const bookData = Array.isArray(json.data) ? json.data : json.data?.books || [];
        setBooks(bookData);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan sistem");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [refreshTrigger]);

  const handleOpenDeleteModal = (id: number, title: string) => {
    setOpenDropdownId(null); 
    setBookToDelete({ id, title });
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/books/${bookToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Gagal menghapus buku");
      }

      setToastMessage("Data berhasil dihapus");
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setToastMessage(null), 3000);

    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Gagal menghapus karena ada kendala sistem");
    } finally {
      setBookToDelete(null); 
    }
  };

  const handleDamageBook = (title: string) => {
    setOpenDropdownId(null);
    alert(`Buku "${title}" berhasil ditandai sebagai Rusak/Damaged! 🛠️`);
  };

  const filteredBooks = books.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    let matchFilter = true;
    if (activeFilter === "Available") {
      matchFilter = b.availableCopies > 0;
    } else if (activeFilter === "Borrowed") {
      matchFilter = b.borrowCount > 0;
    } else if (activeFilter === "Damaged" || activeFilter === "Returned") {
      matchFilter = false; 
    }
    
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 relative px-4 sm:px-0">
      
      {toastMessage && (
        <div className="fixed top-[68px] sm:top-[116px] right-4 sm:right-[120px] z-50 flex flex-row justify-center items-center p-2 px-3 gap-2 w-[345px] sm:w-[291px] h-10 bg-[#079455] rounded-lg shadow-lg animate-in fade-in slide-in-from-top-5">
          <span className="flex-1 text-sm font-semibold text-white font-quicksand tracking-[-0.02em]">
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-70 shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {bookToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0A0D12]/50 transition-opacity" 
            onClick={() => setBookToDelete(null)}
          />
          <div className="relative bg-white rounded-2xl p-5 sm:p-5 flex flex-col w-full max-w-[361px] sm:max-w-[452px] gap-4 sm:gap-8 shadow-[0_0_20px_rgba(203,202,202,0.25)] animate-in fade-in zoom-in-95">
            <div className="flex flex-col gap-3">
              <h3 className="text-base sm:text-lg font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em] sm:tracking-[-0.03em]">
                Delete Data
              </h3>
              <p className="text-sm sm:text-base font-semibold text-[#0A0D12] font-quicksand tracking-[-0.02em]">
                Once deleted, you won’t be able to recover this data.
              </p>
            </div>
            
            <div className="flex flex-row items-center w-full gap-4">
              <button
                onClick={() => setBookToDelete(null)}
                className="flex-1 h-10 sm:h-11 border border-[#D5D7DA] rounded-full text-sm sm:text-base font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBook}
                className="flex-1 h-10 sm:h-11 bg-[#D9206E] rounded-full text-sm sm:text-base font-bold text-white font-quicksand tracking-[-0.02em] hover:bg-[#D9206E]/90 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center p-2 gap-2 bg-[#F5F5F5] rounded-2xl w-full max-w-[600px] overflow-x-auto hide-scrollbar mt-4 sm:mt-0">
        <button
          onClick={() => navigate("/admin/loans")}
          className="flex-1 min-w-fit whitespace-nowrap py-2 px-3 text-sm sm:text-base rounded-xl transition-all duration-300 font-quicksand text-[#535862] font-medium hover:bg-gray-200"
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
          className="flex-1 min-w-fit whitespace-nowrap py-2 px-3 text-sm sm:text-base rounded-xl transition-all duration-300 font-quicksand bg-white text-[#0A0D12] font-bold shadow-[0_0_20px_rgba(203,202,202,0.25)]"
        >
          Book List
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#0A0D12] tracking-[-0.03em] font-quicksand">Book List</h1>
          <Link 
            to="/admin/books/add"
            className="flex items-center justify-center px-6 py-2 h-11 sm:h-12 bg-[#1C65DA] text-white font-bold text-base rounded-full hover:bg-[#1C65DA]/90 transition-colors w-full sm:w-[240px]"
          >
            Add Book
          </Link>
        </div>
        
        <div className="relative w-full max-w-[600px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535862]" size={20} />
          <input
            type="text"
            placeholder="Search book"
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
            className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border font-quicksand text-[13px] sm:text-base transition-colors whitespace-nowrap ${
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
          <div className="p-8 text-center text-[#535862] animate-pulse">Memuat data buku...</div>
        ) : error ? (
          <div className="p-8 font-bold text-center text-[#EE1D52]">{error}</div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-8 text-center text-[#535862]">Buku tidak ditemukan</div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="flex flex-row items-center p-4 sm:p-5 gap-3 sm:gap-4 w-full bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)] border border-[#E5E7EB] rounded-2xl relative">
              <img 
                src={book.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=E0ECFF&color=1C65DA`} 
                alt={book.title} 
                className="w-20 h-[120px] sm:w-[92px] sm:h-[138px] object-cover rounded-md flex-shrink-0 bg-gray-100"
              />

              <div className="flex flex-col flex-1 min-w-0 gap-1 sm:gap-1.5">
                <span className="inline-block px-2 py-1 mb-1 border border-[#D5D7DA] rounded-md text-xs sm:text-sm font-bold text-[#0A0D12] font-quicksand w-fit">
                  {book.category?.name || "Uncategorized"}
                </span>
                
                <h3 className="text-sm sm:text-lg font-bold text-[#0A0D12] font-quicksand tracking-[-0.03em] line-clamp-2 leading-tight">
                  {book.title}
                </h3>
                
                <p className="text-xs font-medium sm:text-base text-[#414651] font-quicksand truncate">
                  {book.author?.name || "Unknown Author"}
                </p>
                
                <div className="flex items-center gap-1 mt-1">
                  <Star size={18} className="text-[#FFAB0D] fill-[#FFAB0D]" />
                  <span className="text-sm font-bold sm:text-base text-[#181D27] font-quicksand">{book.rating || "0"}</span>
                </div>
              </div>

              <div className="relative sm:hidden shrink-0">
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === book.id ? null : book.id)}
                  className="flex items-center justify-center p-1 text-[#0A0D12] hover:opacity-70 transition-opacity"
                >
                  <div className="border border-[#D5D7DA] rounded p-0.5 bg-gray-50">
                    <MoreHorizontal size={20} />
                  </div>
                </button>

                {openDropdownId === book.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                    <div className="absolute right-0 top-full mt-2 z-50 flex flex-col items-start p-4 gap-4 w-[154px] bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)] border border-gray-100 rounded-2xl">
                      <button 
                        onClick={() => { setOpenDropdownId(null); navigate(`/admin/books/${book.id}`); }}
                        className="w-full text-left font-quicksand font-semibold text-sm text-[#0A0D12] hover:text-[#1C65DA]"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => { setOpenDropdownId(null); navigate(`/admin/books/edit/${book.id}`); }}
                        className="w-full text-left font-quicksand font-semibold text-sm text-[#0A0D12] hover:text-[#1C65DA]"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDamageBook(book.title)}
                        className="w-full text-left font-quicksand font-semibold text-sm text-[#FFAB0D] hover:opacity-80"
                      >
                        Damage
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(book.id, book.title)}
                        className="w-full text-left font-quicksand font-semibold text-sm text-[#EE1D52] hover:opacity-80"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="items-center hidden gap-3 sm:flex shrink-0">
                <button 
                  onClick={() => navigate(`/admin/books/${book.id}`)}
                  className="px-5 h-12 border border-[#D5D7DA] rounded-full text-base font-bold text-[#0A0D12] hover:bg-gray-50 transition-colors"
                >
                  Preview
                </button>
                <button 
                  onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                  className="px-5 h-12 border border-[#D5D7DA] rounded-full text-base font-bold text-[#0A0D12] hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDamageBook(book.title)}
                  className="px-5 h-12 border border-[#D5D7DA] rounded-full text-base font-bold text-[#FFAB0D] hover:bg-amber-50 transition-colors"
                >
                  Damage
                </button>
                <button 
                  onClick={() => handleOpenDeleteModal(book.id, book.title)}
                  className="px-5 h-12 border border-[#D5D7DA] rounded-full text-base font-bold text-[#EE1D52] hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}