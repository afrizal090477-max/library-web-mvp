import { useState, useEffect, useRef } from "react";
import { Camera, Save, X, User } from "lucide-react";
import { BASE_URL } from "@/lib/api"; 

export function AdminProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePhoto: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) throw new Error("Gagal memuat data profil");
        
        const json = await res.json();
        const user = json.data?.user || json.data;
        
        setFormData({
          name: user.name || "",
          email: user.email || "", 
          phone: user.phone || "",
          profilePhoto: user.profilePhoto || "",
        });
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan sistem");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB ya bro!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setFormData({ ...formData, profilePhoto: compressedBase64 });
        setError(null); 
      };
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setShowToast(false);

    try {
      const token = localStorage.getItem("token");
      // 🚀 PERBAIKAN: Gunakan BASE_URL untuk PATCH update profil
      const res = await fetch(`${BASE_URL}/me`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          profilePhoto: formData.profilePhoto,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Gagal mengupdate profil");
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-[#535862] animate-pulse font-quicksand">Memuat data profil...</div>;
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6 pb-12 relative">
      {showToast && (
        <div className="fixed top-[80px] right-4 sm:right-8 z-50 flex items-center p-3 gap-3 w-fit bg-[#079455] rounded-lg shadow-lg animate-in fade-in slide-in-from-top-5">
          <span className="text-sm font-semibold text-white font-quicksand">Profil berhasil diperbarui!</span>
          <button onClick={() => setShowToast(false)} className="text-white hover:opacity-70 shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#0A0D12] tracking-[-0.03em] font-quicksand">
          Admin Profile
        </h1>
        <p className="text-sm font-medium text-[#535862] font-quicksand">
          Kelola informasi profil kamu di sini.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm font-bold text-[#EE1D52] bg-[#EE1D52]/10 border border-[#EE1D52]/20 rounded-lg font-quicksand">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#D5D7DA] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-8 items-start">
        <div className="flex flex-col items-center w-full gap-4 sm:w-auto shrink-0">
          <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            <div className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
              {formData.profilePhoto ? (
                <img src={formData.profilePhoto} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <User size={48} className="text-[#D5D7DA]" />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center transition-opacity rounded-full opacity-0 bg-black/40 group-hover:opacity-100">
              <Camera size={28} className="text-white" />
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-center">
            <span className="text-sm font-bold text-[#1C65DA] font-quicksand cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
              Ubah Foto
            </span>
            <p className="text-xs font-medium text-[#535862] font-quicksand mt-1">JPG/PNG maks. 2MB</p>
          </div>
        </div>

        {/* KANAN: Form Input */}
        <div className="flex flex-col flex-1 w-full gap-5">
          
          <div className="space-y-1">
            <label className="block text-sm font-bold text-[#0A0D12] font-quicksand">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-base text-[#0A0D12] outline-none focus:border-[#1C65DA]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-[#0A0D12] font-quicksand">Email Address <span className="text-xs text-[#535862] font-medium">(Tidak bisa diubah)</span></label>
            <input 
              type="email" 
              value={formData.email}
              disabled
              className="w-full h-12 px-4 bg-gray-50 border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-base text-[#535862] outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-[#0A0D12] font-quicksand">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-white border border-[#D5D7DA] rounded-xl font-quicksand font-semibold text-base text-[#0A0D12] outline-none focus:border-[#1C65DA]"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={isSaving}
              className="h-12 px-8 bg-[#1C65DA] rounded-full flex items-center justify-center gap-2 text-base font-bold text-white font-quicksand hover:bg-[#1C65DA]/90 transition-colors disabled:opacity-70 w-full sm:w-fit ml-auto"
            >
              {isSaving ? "Menyimpan..." : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}