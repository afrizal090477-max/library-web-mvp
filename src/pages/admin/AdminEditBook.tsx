import { useState, useEffect, useRef } from "react";
import { ArrowLeft, UploadCloud, X, ImageIcon, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "@/lib/api"; 

interface Author { id: number; name: string; }
interface Category { id: number; name: string; }

export function AdminEditBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    isbn: "", 
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
  
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetchingData(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        // 🚀 PERBAIKAN: Tembak URL dengan BASE_URL
        const [authRes, catRes, bookRes] = await Promise.all([
          fetch(`${BASE_URL}/authors`, { headers }),
          fetch(`${BASE_URL}/categories`, { headers }),
          fetch(`${BASE_URL}/books/${id}`, { headers })
        ]);
        if (authRes.ok) {
          const authData = await authRes.json();
          setAuthors(authData.data?.authors || []);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.data?.categories || []);
        }
        if (bookRes.ok) {
          const bookData = await bookRes.json();
          const book = bookData.data?.book || bookData.data; 
          
          setFormData({
            title: book.title || "",
            isbn: book.isbn || "", 
            categoryId: book.category?.id?.toString() || book.categoryId?.toString() || "",
            pages: book.totalPages?.toString() || "",
            description: book.description || "",
            coverImage: book.coverImage || "",
          });
          if (book.author) {
            setAuthorSearch(book.author.name);
            setSelectedAuthorId(book.author.id);
          }
        } else {
          throw new Error("Gagal mengambil data buku");
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data buku. Pastikan ID benar.");
      } finally {
        setIsFetchingData(false);
      }
    };
    if (id) fetchData();
  }, [id]);

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

  const handleDeleteImage = () => {
    setFormData({ ...formData, coverImage: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          const createAuthRes = await fetch(`${BASE_URL}/authors`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ 
              name: authorSearch.trim(),
              bio: "Author ditambahkan otomatis dari sistem" 
            })
          });
          
          if (!createAuthRes.ok) throw new Error("Gagal membuat data Author baru di server");
          
          const newAuthData = await createAuthRes.json();
          finalAuthorId = newAuthData.data?.author?.id || newAuthData.data?.id;
        }
      }

      if (!finalAuthorId) throw new Error("Sistem gagal mendapatkan ID Author.");

      const payload = {
        isbn: formData.isbn, 
        title: formData.title,
        authorId: finalAuthorId,
        categoryId: Number(formData.categoryId),
        description: formData.description,
        coverImage: formData.coverImage, 
        totalPages: Number(formData.pages) || 0
      };

      // 🚀 PERBAIKAN: Tembak URL dengan BASE_URL
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Gagal mengupdate buku");
      }

      setShowToast(true);

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

  if (isFetchingData) {
    return <div className="p-12 text-center text-[#535862] font-quicksand animate-pulse">Menyiapkan data buku...</div>;
  }

  return (
    <div className="max-w-[529px] mx-auto space-y-6 pb-12 relative pt-8 sm:pt-4">
      
      {showToast && (
        <div className="fixed top-[68px] sm:top-[116px] left-1/2 -translate-x-1/2 w-[345px] sm:w-[291px] h-10 bg-[#079455] rounded-lg flex items-center justify-between px-3 z-50 shadow-lg animate-in fade-in slide-in-from-top-5">
          <span className="text-sm font-semibold text-white font-quicksand tracking-[-0.02em]">Buku berhasil diupdate!</span>
          <button onClick={() => setShowToast(false)} className="text-white hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center w-full gap-3">
        <Link to="/admin/books" className="text-[#1E1E1E] hover:opacity-70 transition-opacity">
          <ArrowLeft size={32} />
        </Link>
        <h1 className="text-[20px] sm:text-[24px] font-bold text-[#0A0D12] font-quicksand leading-[36px]">
          Edit Book
        </h1>
      </div>

      {error && (
        <div className="p-3 text-sm font-bold text-[#EE1D52] bg-[#EE1D52]/10 border border-[#EE1D52]/20 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Title</label>
          <input 
            type="text" 
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-base text-[#0A0D12] outline-none focus:border-[#1C65DA]"
          />
        </div>

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
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-base text-[#0A0D12] outline-none focus:border-[#1C65DA]"
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

        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Category</label>
          <select 
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-base text-[#0A0D12] outline-none focus:border-[#1C65DA] appearance-none"
          >
            <option value="" disabled>Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Number of Pages</label>
          <input 
            type="number" 
            name="pages"
            required
            min="1"
            value={formData.pages}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-base text-[#0A0D12] outline-none focus:border-[#1C65DA]"
          />
        </div>

        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Description</label>
          <textarea 
            name="description"
            required
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 bg-white border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-sm sm:text-base text-[#0A0D12] outline-none focus:border-[#1C65DA] resize-none"
          ></textarea>
        </div>

        <div className="space-y-0.5">
          <label className="block text-sm font-bold text-[#0A0D12] font-quicksand tracking-[-0.02em]">Cover Image</label>
          
          <div className="w-full border border-dashed border-[#D5D7DA] rounded-xl p-4 sm:p-6 bg-white flex flex-col items-center justify-center min-h-[144px]">
            
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {formData.coverImage ? (
              <div className="flex flex-col items-center w-full gap-3">
                <img 
                  src={formData.coverImage} 
                  alt="Cover Preview" 
                  className="w-[92px] h-[138px] object-cover rounded shadow-sm border border-[#D5D7DA]" 
                />
                
                <div className="flex items-center gap-3 mt-1">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D5D7DA] rounded-[10px] bg-[#FDFDFD] hover:bg-gray-50 transition-colors"
                  >
                    <ImageIcon size={16} className="text-[#0A0D12]" />
                    <span className="text-sm font-medium text-[#0A0D12] font-quicksand">Change Image</span>
                  </button>
                  <button 
                    type="button"
                    onClick={handleDeleteImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D5D7DA] rounded-[10px] bg-[#FDFDFD] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} className="text-[#D9206E]" />
                    <span className="text-sm font-medium text-[#D9206E] font-quicksand">Delete Image</span>
                  </button>
                </div>
                
                <span className="text-sm font-medium text-[#0A0D12] font-quicksand tracking-[-0.03em] mt-1">
                  PNG or JPG (max. 5mb)
                </span>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-full gap-1 cursor-pointer group"
              >
                <div className="w-10 h-10 border border-[#D5D7DA] rounded-lg flex items-center justify-center bg-white shadow-sm group-hover:bg-gray-50">
                  <UploadCloud size={20} className="text-[#0A0D12]" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm font-bold text-[#1C65DA] font-quicksand tracking-[-0.02em]">Click to upload</span>
                  <span className="text-sm font-semibold text-[#0A0D12] font-quicksand tracking-[-0.02em]">or drag and drop</span>
                </div>
                <span className="text-sm font-semibold text-[#6B7280] font-quicksand tracking-[-0.02em]">
                  SVG, PNG, JPG or GIF (max. 5mb)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#1C65DA] rounded-full flex justify-center items-center gap-2 text-base font-bold text-white font-quicksand tracking-[-0.02em] hover:bg-[#1C65DA]/90 transition-colors disabled:opacity-70 shadow-md"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>

      </form>
    </div>
  );
}