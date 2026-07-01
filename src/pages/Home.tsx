import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-[120px]">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="flex justify-center py-8 md:py-12">
        <div className="relative w-full max-w-[1200px] overflow-hidden rounded-[24px] bg-gradient-to-b from-[#58B0E8] to-[#E7E9FF] shadow-lg">
          <div className="relative flex flex-col items-center justify-center px-6 py-12 text-center md:py-16">
            
            <div className="mb-6">
              <h1 className="text-[42px] font-bold leading-none tracking-[-2px] text-white drop-shadow-md md:text-[72px]">
                Welcome to
              </h1>
              <h1 className="text-[42px] font-bold leading-none tracking-[-2px] text-white drop-shadow-md md:text-[72px]">
                Booky
              </h1>
            </div>

            {/* Placeholder Ilustrasi */}
            <div className="mt-4 flex w-full max-w-[1100px] items-end justify-between px-4">
              <div className="hidden h-[220px] w-[180px] rounded-xl bg-white/20 md:block" />
              <div className="hidden h-[220px] w-[180px] rounded-xl bg-white/20 md:block" />
            </div>

            {/* Dot Indicator */}
            <div className="flex gap-2 mt-8">
              <div className="h-2.5 w-2.5 rounded-full bg-white" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== RECOMMENDATION SECTION ==================== */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#0A0D12]">Recommendation</h2>
          <Link to="/books" className="text-sm font-medium text-[#1C65DA] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-[320px] rounded-xl border bg-white p-4 shadow-sm">
              <div className="w-full h-48 bg-gray-200 rounded-lg" />
              <div className="mt-4">
                <div className="w-3/4 h-5 bg-gray-200 rounded" />
                <div className="w-1/2 h-4 mt-2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== POPULAR AUTHORS SECTION ==================== */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#0A0D12]">Popular Authors</h2>
          <Link to="/authors" className="text-sm font-medium text-[#1C65DA] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-4 p-4 bg-white border shadow-sm rounded-xl">
              <div className="bg-gray-200 rounded-full h-14 w-14" />
              <div>
                <div className="w-24 h-5 bg-gray-200 rounded" />
                <div className="w-16 h-4 mt-1 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}