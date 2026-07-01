import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setCredentials } from "@/features/auth/authSlice";
import { login } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Logo from "@/assets/logo-brand.svg";
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, token } = await login(email, password);
      dispatch(setCredentials({ user, token }));
      toast.success("Login berhasil! Selamat datang kembali.");
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Email atau password salah.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-[400px]">
        {/* Logo + Booky */}
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
              Login
            </CardTitle>
            <CardDescription className="text-base text-[#6B7280]">
              Sign in to manage your library account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-[#374151]"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-[12px] border-[#D1D5DB] px-4"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold text-[#374151]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-[12px] border-[#D1D5DB] px-4 pr-11"
                    required
                    disabled={isLoading}
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

              {error && (
                <p className="text-sm font-medium text-[#EE1D52]">{error}</p>
              )}

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#1C65DA] text-base font-bold hover:bg-[#1C65DA]/90"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-sm text-center">
              <span className="text-[#6B7280]">Don't have an account? </span>
              <a
                href="/register"
                className="font-bold text-[#1C65DA] hover:underline"
              >
                Register
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
