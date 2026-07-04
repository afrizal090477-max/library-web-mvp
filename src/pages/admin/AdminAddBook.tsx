import { useState, useEffect, useRef } from "react";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Author { id: number; name: string; }
interface Category { id: number; name: string; }

export function AdminAddBook() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    pages: "",
    description: "",
    coverImage: "", 
  });

  const [authorSearch, setAuthorSearch] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const [authRes, catRes] = await Promise.all([
          fetch("/api/authors", { headers }),
          fetch("/api/categories", { headers })
        ]);
        
        if (authRes.ok) {
          const authData = await authRes.json();
          setAuthors(authData.data?.authors || []);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.data?.categories || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data dropdown", err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB ya bro!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setFormData({ ...formData, coverImage: compressedBase64 });
        setError(null); 
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowToast(false);

    try {
      const token = localStorage.getItem("token");
      let finalAuthorId = selectedAuthorId;

      if (!finalAuthorId && authorSearch.trim() !== "") {
        const existingAuthor = authors.find(
          a => a.name.toLowerCase() === authorSearch.trim().toLowerCase()
        );

        if (existingAuthor) {
          finalAuthorId = existingAuthor.id;
        } else {
          const createAuthRes = await fetch("/api/authors", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ 
              name: authorSearch.trim(),
              bio: "Author ditambahkan otomatis dari sistem" 
            })
          });
          
          if (!createAuthRes.ok) {
            const errJson = await createAuthRes.json();
            throw new Error(errJson.message || "Gagal membuat data Author baru di server");
          }
          
          const newAuthData = await createAuthRes.json();
          finalAuthorId = newAuthData.data?.author?.id || newAuthData.data?.id;
        }
      }

      if (!finalAuthorId) {
        throw new Error("Sistem gagal mendapatkan ID Author. Coba pilih manual dari dropdown.");
      }

      // 🥷 JALAN NINJA: Generate ISBN Acak 13 Digit (978xxxxxxxxxx)
      const randomIsbn = "978" + Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const payload = {
        isbn: randomIsbn, 
        title: formData.title,
        authorId: finalAuthorId,
        categoryId: Number(formData.categoryId),
        stock: 5, 
        description: formData.description,
        coverImage: formData.coverImage, 
        totalPages: Number(formData.pages) || 0
      };

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Gagal menambahkan buku");
      }

      setShowToast(true);
      setFormData({ title: "", categoryId: "", pages: "", description: "", coverImage: "" });
      setAuthorSearch("");
      setSelectedAuthorId(null);

      setTimeout(() => {
        navigate("/admin/books");
      }, 2000);

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuthors = authors.filter(a => a.name.toLowerCase().includes(authorSearch.toLowerCase()));

  return (
    <div className="max-w-[529px] mx-auto space-y-6 pb-12 relative pt-8 sm:pt-4">
      
      {/* TOAST SUCCESS */}
      {showToast && (
        <div className="fixed top-[68px] sm:top-[116px] left-1/2 -translate-x-1/2 w-[345px] sm:w-[291px] h-10 bg-[#079455] rounded-lg flex items-center justify-between px-3 z-50 shadow-lg animate-in fade-in slide-in-from-top-5">
          <span className="text-sm font-semibold text-white font-quicksand tracking-[-0.02em]">Buku berhasil ditambahkan!</span>
          <button onClick={() => setShowToast(false)} className="text-white hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex items-center w-full gap-3">
        <Link to="/admin/books" className="text-[#1E1E1E] hover:opacity-70 transition-opacity">
          <ArrowLeft size={32} />
        </Link>
        <h1 className="text-[20px] sm:text-[24px] font-bold text-[#0A0D12] font-quicksand leading-[36px]">
          Add Book
        </h1>
      </div>

      {/* Error Message Lokal */}
      {error && (
        <div className="p-3 text-sm font-bold text-[#EE1D52] bg-[#EE1D52]/10 border border-[#EE1D52]/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Area Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Title</label>
          <input 
            type="text" 
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-redhat text-sm text-[#0A0D12] outline-none focus:border-[#1C65DA]"
          />
        </div>

        {/* ❌ KOLOM ISBN DIHAPUS DARI SINI ❌ */}

        {/* Author */}
        <div className="space-y-0.5 relative">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Author</label>
          <input 
            type="text" 
            placeholder="Type or select author..."
            required
            value={authorSearch}
            onChange={(e) => {
              setAuthorSearch(e.target.value);
              setSelectedAuthorId(null); 
              setShowAuthorDropdown(true);
            }}
            onFocus={() => setShowAuthorDropdown(true)}
            onBlur={() => setTimeout(() => setShowAuthorDropdown(false), 200)}
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-redhat text-sm text-[#0A0D12] outline-none focus:border-[#1C65DA]"
          />
          {showAuthorDropdown && authorSearch && (
            <ul className="absolute z-20 w-full bg-white border border-[#D5D7DA] rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg py-1">
              {filteredAuthors.length > 0 ? (
                filteredAuthors.map(a => (
                  <li 
                    key={a.id} 
                    onMouseDown={() => {
                      setAuthorSearch(a.name);
                      setSelectedAuthorId(a.id);
                      setShowAuthorDropdown(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#0A0D12] font-quicksand hover:bg-[#F6F9FE] hover:text-[#1C65DA] cursor-pointer"
                  >
                    {a.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm font-medium text-[#717680] font-quicksand italic">
                  Author belum ada. Akan ditambahkan otomatis.
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Category */}
        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Category</label>
          <select 
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-redhat text-sm text-[#717680] outline-none focus:border-[#1C65DA] appearance-none"
          >
            <option value="" disabled>Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Number of Pages */}
        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Number of Pages</label>
          <input 
            type="number" 
            name="pages"
            required
            min="1"
            value={formData.pages}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-redhat text-sm text-[#0A0D12] outline-none focus:border-[#1C65DA]"
          />
        </div>

        {/* Description */}
        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Description</label>
          <textarea 
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 bg-white border border-[#D5D7DA] rounded-xl font-redhat text-sm text-[#0A0D12] outline-none focus:border-[#1C65DA] resize-none"
          ></textarea>
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Cover Image</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-[144px] bg-white border border-dashed border-[#D5D7DA] rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden group"
          >
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.coverImage ? (
              <img src={formData.coverImage} alt="Cover Preview" className="absolute inset-0 object-contain w-full h-full opacity-40 group-hover:opacity-10" />
            ) : null}
            <div className="w-10 h-10 border border-[#D5D7DA] rounded-lg flex items-center justify-center z-10 bg-white shadow-sm">
              <UploadCloud size={20} className="text-[#0A0D12]" />
            </div>
            <div className="z-10 flex items-center gap-1 mt-2">
              <span className="text-sm font-bold text-[#1C65DA] font-quicksand tracking-[-0.02em]">Click to upload</span>
              <span className="text-sm font-semibold text-[#0A0D12] font-quicksand tracking-[-0.02em]">or drag and drop</span>
            </div>
            <span className="text-sm font-semibold text-[#6B7280] font-quicksand tracking-[-0.02em] z-10">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </span>
          </div>
        </div>

        {/* Tombol Save */}
        <div className="pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#1C65DA] rounded-full flex justify-center items-center gap-2 text-base font-bold text-white font-quicksand tracking-[-0.02em] hover:bg-[#1C65DA]/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>

      </form>
    </div>
  );
}