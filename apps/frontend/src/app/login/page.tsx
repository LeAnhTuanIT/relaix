'use client';

import { useState } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { authApi } from '@/shared/api/chat.api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authApi.getGoogleAuthUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] opacity-60" />

      <div className="max-w-md w-full bg-white rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.04)] border border-gray-100 p-10 sm:p-14 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center gap-1 mb-8 hover:opacity-80 transition-opacity">
            <span className="font-black text-blue-600 text-3xl tracking-tighter uppercase">TEMPLATE</span>
            <span className="font-medium text-gray-400 text-3xl tracking-tighter uppercase">.NET</span>
          </Link>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-gray-500 text-[15px] mt-3 font-medium">Continue your journey with RELAIX.AI</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-[20px] font-bold text-center animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[22px] text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all font-medium"
              placeholder="name@company.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">
                Password
              </label>
              <button type="button" className="text-[11px] font-black text-blue-600 hover:underline uppercase tracking-wider">
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[22px] text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4.5 rounded-[22px] font-black text-[16px] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 h-[60px]"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : (
              <>
                Log in
                <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
            <span className="bg-white px-4">Or secure login with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-[22px] font-bold text-[15px] hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-4 shadow-sm active:scale-[0.98]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google Account
        </button>

        <p className="mt-12 text-center text-[14px] text-gray-500 font-medium tracking-tight">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 font-black hover:underline ml-1">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
