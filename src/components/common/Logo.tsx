import { Link } from 'react-router-dom';
import LogoImage from '@/assets/logo-brand.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  showBorder?: boolean;
  className?: string;
}

export function Logo({ 
  size = 'md', 
  withText = true, 
  showBorder = false,
  className 
}: LogoProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-[42px] w-[42px]',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-[32px]',
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-3 ${className}`}
    >
      <div 
        className={`
          ${sizes[size]} flex-shrink-0 flex items-center justify-center 
          ${showBorder ? 'rounded-md border border-[#D5D7DA] p-1 shadow-sm bg-white' : ''}
        `}
      >
        <img 
          src={LogoImage} 
          alt="Booky Logo" 
          className="object-contain w-full h-full" 
        />
      </div>

      {withText && (
        <span className={`font-quicksand font-bold tracking-[-0.02em] text-[#0A0D12] ${textSizes[size]}`}>
          Booky
        </span>
      )}
    </Link>
  );
}