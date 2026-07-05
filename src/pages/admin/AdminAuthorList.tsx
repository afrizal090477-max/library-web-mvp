import { useState } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { BASE_URL } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Author {
  id: number;
  name: string;
  bio?: string;
}

export function AdminAuthorList() {
  const queryClient = useQueryClient(); 
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({ name: "", bio: "" });

  const token = localStorage.getItem("token");
  const { data: authors = [], isLoading } = useQuery<Author[]>({
    queryKey: ["admin-authors"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/authors`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data penulis");

      const json = await res.json();
      return Array.isArray(json.data) ? json.data : json.data?.authors || [];
    },
    enabled: !!token,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: { id?: number; name: string; bio: string }) => {
      const url = payload.id ? `${BASE_URL}/authors/${payload.id}` : `${BASE_URL}/authors`;
      const method = payload.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: payload.name, bio: payload.bio }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Gagal menyimpan data penulis");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      alert(`✅ Penulis berhasil ${variables.id ? "diperbarui" : "ditambahkan"}!`);
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-authors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-options"] }); 
    },
    onError: (err: Error) => {
      alert(err.message || "Terjadi kesalahan");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BASE_URL}/authors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Gagal menghapus penulis. Pastikan tidak ada buku yang terkait.");
      }
      return res.json();
    },
    onSuccess: () => {
      alert("✅ Penulis berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["admin-authors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-options"] });
    },
    onError: (err: Error) => {
      alert(err.message || "Terjadi kesalahan saat menghapus");
    }
  });

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingAuthor(null);
    setFormData({ name: "", bio: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({ name: author.name, bio: author.bio || "" });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Nama penulis tidak boleh kosong!");
    saveMutation.mutate({ id: editingAuthor?.id, ...formData });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Yakin ingin menghapus penulis ini? (Gagal jika penulis masih memiliki buku yang terdaftar)")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 px-4 sm:px-0">
      <div className="flex flex-col justify-between gap-4 mt-4 sm:flex-row sm:items-center sm:mt-0">
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#0A0D12] tracking-[-0.03em] font-quicksand">
          Manage Authors
        </h1>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C65DA] hover:bg-[#154fb6] text-white text-sm sm:text-base font-bold font-quicksand rounded-xl transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Author
        </button>
      </div>

      <div className="relative w-full max-w-[600px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535862]" size={20} />
        <input
          type="text"
          placeholder="Search author by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 sm:h-12 pl-12 pr-4 bg-white border border-[#D5D7DA] rounded-full font-quicksand text-sm font-medium text-[#535862] focus:outline-none focus:border-[#1C65DA]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || deleteMutation.isPending ? (
          <div className="col-span-full p-8 text-center text-[#535862] animate-pulse font-quicksand">
            Memuat data penulis...
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="col-span-full p-8 text-center text-[#535862] font-quicksand bg-white rounded-2xl border border-[#E5E7EB]">
            Data penulis tidak ditemukan.
          </div>
        ) : (
          filteredAuthors.map((author) => (
            <div key={author.id} className="flex flex-col p-5 gap-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=E0ECFF&color=1C65DA&bold=true`} 
                  alt={author.name} 
                  className="w-12 h-12 rounded-full object-cover border border-[#D5D7DA] flex-shrink-0 shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#0A0D12] font-quicksand truncate">
                    {author.name}
                  </h3>
                  <p className="text-sm font-medium text-[#535862] font-quicksand mt-1 line-clamp-2">
                    {author.bio || "Tidak ada biografi."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#F5F5F5]">
                <button
                  onClick={() => handleEdit(author)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F6F9FE] hover:bg-[#E0ECFF] text-[#1C65DA] text-sm font-bold font-quicksand rounded-lg transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(author.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EE1D52] text-sm font-bold font-quicksand rounded-lg transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#0A0D12] font-quicksand">
                {editingAuthor ? "Edit Author" : "Add New Author"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#535862] hover:bg-gray-100 p-1 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#374151] font-quicksand">Nama Penulis <span className="text-[#EE1D52]">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama penulis..."
                  className="w-full px-3 py-2.5 bg-white border border-[#D5D7DA] rounded-lg font-quicksand text-sm font-medium focus:outline-none focus:border-[#1C65DA]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#374151] font-quicksand">Biografi (Opsional)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tuliskan biografi singkat..."
                  rows={4}
                  className="w-full px-3 py-2.5 bg-white border border-[#D5D7DA] rounded-lg font-quicksand text-sm font-medium focus:outline-none focus:border-[#1C65DA] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-[#D5D7DA] text-[#374151] hover:bg-gray-50 text-sm font-bold font-quicksand rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-[#1C65DA] hover:bg-[#154fb6] text-white text-sm font-bold font-quicksand rounded-xl transition-colors disabled:opacity-50"
                >
                  {saveMutation.isPending ? "Saving..." : "Save Author"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}