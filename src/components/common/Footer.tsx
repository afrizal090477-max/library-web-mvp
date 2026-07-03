import { Logo } from "./Logo";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export const Footer = () => {
  return (
    // PERBAIKAN: py-[80px] diubah jadi py-[40px] md:py-[80px] agar pas di HP
    <footer className="w-full bg-[#FFFFFF] border-t border-[#D5D7DA] py-[40px] md:py-[80px] font-['Quicksand']">
      <div className="mx-auto w-full max-w-[1140px] flex flex-col items-center gap-[24px] md:gap-[40px] px-4">
        
        <div className="flex flex-col items-center gap-[16px] md:gap-[22px] w-full max-w-[800px]">
          <Logo size="lg" />
          {/* PERBAIKAN: Text size 14px untuk mobile, 16px untuk desktop */}
          <p className="font-semibold text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12] text-center">
            Platform perpustakaan digital terbaik untuk menemukan, membaca, dan meminjam ribuan koleksi buku pilihan kapan saja dan di mana saja.
          </p>
        </div>

        <div className="flex flex-col items-center gap-[20px]">
          <span className="font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-[#0A0D12]">
            Connect With Us
          </span>
          <div className="flex gap-[12px]">
            {[
              { Icon: FacebookIcon, url: "#" },
              { Icon: TwitterIcon, url: "#" },
              { Icon: LinkedinIcon, url: "#" },
              { Icon: InstagramIcon, url: "#" },
            ].map((item, idx) => (
              <a 
                key={idx}
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-[40px] h-[40px] border border-[#D5D7DA] rounded-full text-[#0A0D12] hover:bg-[#1C65DA] hover:text-white transition-all active:scale-95"
              >
                <item.Icon className="w-[20px] h-[20px]" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;