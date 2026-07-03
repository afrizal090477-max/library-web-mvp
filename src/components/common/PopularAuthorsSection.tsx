import { useQuery } from "@tanstack/react-query";
import AuthorCard, { Author } from "./AuthorCard";


interface ApiAuthor {
  id: number;
  name: string;
  bio: string | null;
  bookCount: number;
  accumulatedScore: number;
}

interface PopularAuthorsResponse {
  success: boolean;
  message: string;
  data: {
    authors: ApiAuthor[];
  };
}

export const PopularAuthorsSection = () => {
  // Mengambil data dari API menggunakan React Query
  const { data, isLoading, isError } = useQuery<PopularAuthorsResponse>({
    queryKey: ["popularAuthors"],
    queryFn: async () => {
      // TODO: Sesuaikan URL endpoint ini dengan routing backend kamu
      const response = await fetch("/api/authors/popular");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Ambil list authors dari response, batas maksimal 4 orang agar pas 1 baris grid Desktop
  const apiAuthors = data?.data?.authors?.slice(0, 4) || [];

  // Mapping data API (ApiAuthor) menjadi format yang diterima oleh AuthorCard (Author)
  const mappedAuthors: Author[] = apiAuthors.map((author) => ({
    id: author.id,
    name: author.name,
    totalBooks: author.bookCount,
    // Generate avatar berdasarkan nama author karena API belum menyediakan profileImage
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=E0ECFF&color=1C65DA&size=150`,
  }));

  if (isLoading) {
    return <div className="w-full py-10 text-center text-gray-500 font-['Quicksand']">Memuat penulis populer...</div>;
  }

  if (isError) {
    return <div className="w-full py-10 text-center text-red-500 font-['Quicksand']">Gagal memuat penulis.</div>;
  }

  // Jika tidak ada data author yang dikembalikan
  if (mappedAuthors.length === 0) return null;

  return (
    <section className="flex flex-col items-start w-full gap-[24px] md:gap-[40px] font-['Quicksand']">
      {/* Title */}
      <div className="w-full text-left">
        <h2 className="font-bold text-[24px] leading-[36px] md:text-[36px] md:leading-[44px] text-[#0A0D12]">
          Popular Authors
        </h2>
      </div>
      
      {/* Grid Layout Authors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px] md:gap-[20px] w-full">
        {mappedAuthors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>
    </section>
  );
};

export default PopularAuthorsSection;