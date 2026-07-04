import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, X, LibraryBig, UploadCloud } from "lucide-react";
import { BASE_URL } from "@/lib/api";

export interface Category {
  id: number;
  name: string;
  iconUrl?: string; 
}

export function AdminCategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/categories`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data kategori");
        const json = await res.json();
        const categoryData = Array.isArray(json.data) ? json.data : json.data?.categories || [];
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false); 
      }
    };

    loadCategories();
  }, [refreshTrigger]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: "" });
    setIconFile(null);
    setIconPreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIconFile(null);
    setIconPreview(category.iconUrl || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Nama kategori tidak boleh kosong!");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingCategory 
        ? `${BASE_URL}/categories/${editingCategory.id}` 
        : `${BASE_URL}/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const payload = new FormData();
      payload.append("name", formData.name);
      if (iconFile) {
        payload.append("icon", iconFile); 
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Gagal menyimpan data kategori. Pastikan Backend mendukung FormData.");
      }

      alert(`✅ Kategori berhasil ${editingCategory ? "diperbarui" : "ditambahkan"}!`);
      setIsModalOpen(false);
      setRefreshTrigger((prev) => prev + 1); 
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      setIsLoading(true); 
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus kategori.");

      alert("✅ Kategori berhasil dihapus!");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setIsLoading(false);
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 px-4 sm:px-0">
      <div className="flex flex-col justify-between gap-4 mt-4 sm:flex-row sm:items-center sm:mt-0">
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#0A0D12] tracking-[-0.03em] font-quicksand">
          Manage Categories
        </h1>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C65DA] hover:bg-[#154fb6] text-white text-sm sm:text-base font-bold font-quicksand rounded-xl transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Category
        </button>
      </div>

      <div className="relative w-full max-w-[600px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535862]" size={20} />
        <input
          type="text"
          placeholder="Search category by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 sm:h-12 pl-12 pr-4 bg-white border border-[#D5D7DA] rounded-full font-quicksand text-sm font-medium text-[#535862] focus:outline-none focus:border-[#1C65DA]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-[#535862] animate-pulse font-quicksand">Memuat data kategori...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full p-8 text-center text-[#535862] font-quicksand bg-white rounded-2xl border border-[#E5E7EB]">Data kategori tidak ditemukan.</div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="flex flex-col p-5 gap-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#079455] flex-shrink-0 overflow-hidden border border-[#D5D7DA]">
                  {category.iconUrl ? (
                    <img src={category.iconUrl} alt={category.name} className="object-cover w-full h-full" />
                  ) : (
                    <LibraryBig size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#0A0D12] font-quicksand truncate">{category.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-4 border-t border-[#F5F5F5]">
                <button onClick={() => handleEdit(category)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F6F9FE] hover:bg-[#E0ECFF] text-[#1C65DA] text-sm font-bold font-quicksand rounded-lg transition-colors"><Edit2 size={16} /> Edit</button>
                <button onClick={() => handleDelete(category.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EE1D52] text-sm font-bold font-quicksand rounded-lg transition-colors"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#0A0D12] font-quicksand">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#535862] hover:bg-gray-100 p-1 rounded-md transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#374151] font-quicksand">Nama Kategori <span className="text-[#EE1D52]">*</span></label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama kategori (misal: Fiksi)..."
                  className="w-full px-3 py-2.5 bg-white border border-[#D5D7DA] rounded-lg font-quicksand text-sm font-medium focus:outline-none focus:border-[#1C65DA]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#374151] font-quicksand">Upload Icon (Opsional)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#D5D7DA] border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                  {iconPreview ? (
                    <>
                      <img src={iconPreview} alt="Preview" className="object-contain w-full h-full p-2" />
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
                        <p className="text-xs font-bold text-white font-quicksand">Change Icon</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-[#535862]">
                      <UploadCloud size={24} className="mb-2 text-[#535862]" />
                      <p className="px-4 text-xs font-semibold text-center font-quicksand">Click or drag image here<br/>(PNG, JPG, SVG)</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                {iconPreview && (
                  <button type="button" onClick={() => { setIconFile(null); setIconPreview(null); }} className="text-[#EE1D52] text-xs font-bold hover:underline font-quicksand">
                    Hapus Gambar
                  </button>
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white border border-[#D5D7DA] text-[#374151] hover:bg-gray-50 text-sm font-bold font-quicksand rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-[#1C65DA] hover:bg-[#154fb6] text-white text-sm font-bold font-quicksand rounded-xl transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}