import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/assets/logo-brand.svg';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query'; 

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const registerMutation = useMutation({
    mutationFn: async () => {
      return await register(name, email, phone, password);    
    },
    onSuccess: () => {
      toast.success("Registrasi berhasil! Silakan login dengan akun baru kamu.");
      navigate('/login'); 
    },
    onError: (err: Error) => {
      setError(err.message || "Registrasi gagal. Silakan coba lagi.");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama.");
      return;
    }
    
    registerMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white font-quicksand">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex items-center gap-[11.79px]">
          <div className="flex h-[33px] w-[33px] items-center justify-center rounded-[6px] border border-[#D5D7DA] bg-white p-1 shadow-sm">
            <img 
              src={Logo} 
              alt="Booky Logo" 
              className="object-contain w-full h-full" 
            />
          </div>
          <span className="font-quicksand text-[25.14px] font-bold tracking-[-0.02em] text-[#0A0D12]">
            Booky
          </span>
        </div>

        <Card className="border border-[#E5E7EB] shadow-sm rounded-2xl">
          <CardHeader className="pb-5">
            <CardTitle className="text-[28px] font-bold tracking-[-0.02em] text-[#0A0D12]">
              Register
            </CardTitle>
            <CardDescription className="text-base text-[#414651] font-medium">
              Create your account to start using Booky.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-bold text-[#0A0D12]">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-[12px] border-[#D5D7DA] px-4 font-medium"
                  required
                  disabled={registerMutation.isPending}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-bold text-[#0A0D12]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-[12px] border-[#D5D7DA] px-4 font-medium"
                  required
                  disabled={registerMutation.isPending}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-bold text-[#0A0D12]">
                  Nomor Handphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-[12px] border-[#D5D7DA] px-4 font-medium"
                  required
                  disabled={registerMutation.isPending}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-bold text-[#0A0D12]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-[12px] border-[#D5D7DA] px-4 pr-11 font-medium tracking-widest"
                    required
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-bold text-[#0A0D12]">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-[12px] border-[#D5D7DA] px-4 font-medium tracking-widest"
                  required
                  disabled={registerMutation.isPending}
                />
              </div>
              
              {error && (
                <p className="text-[13px] font-bold text-[#EE1D52] bg-[#FEE4E2]/50 p-2.5 rounded-lg border border-[#FEE4E2]">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#1C65DA] text-base font-bold hover:bg-[#1C65DA]/90 transition-all shadow-sm"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating Account..." : "Register"}
              </Button>
            </form>
            
            <div className="mt-6 text-sm font-medium text-center">
              <span className="text-[#6B7280]">Already have an account? </span>
              <Link to="/login" className="font-extrabold text-[#1C65DA] hover:underline">
                Login
              </Link>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}