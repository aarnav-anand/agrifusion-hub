'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const hashed = await hashPassword(password);

      const { data, error: dbError } = await supabase
        .from('farmers')
        .select('*')
        .eq('phone_number', phone)
        .eq('password_hash', hashed)
        .maybeSingle();

      if (dbError) throw dbError;

      if (!data) {
        setError(t.invalidCredentials);
        setLoading(false);
        return;
      }

      login({
        id: data.id,
        name: data.farmer_name,
        phone: data.phone_number,
        role: data.role ?? 'farmer',
        is_verified: data.is_verified ?? false,
        dif_code: data.dif_code ?? null,
      });

      router.replace(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error(err);
      setError(t.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[#0a0f0a]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#111811] border border-[#1e3a1e] rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-5xl">🌾</span>
            <h1 className="text-2xl font-bold text-white mt-4">{t.login}</h1>
            <p className="text-gray-500 text-sm mt-1">{t.appName}</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">
                {t.phoneNumber}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="9876543210"
                className="w-full bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-4 py-3 text-white placeholder-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-4 py-3 text-white placeholder-gray-700 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? t.loading : t.loginSubmit}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            {t.noAccount}{' '}
            <Link href="/register" className="text-green-400 hover:text-green-300 font-medium">
              {t.registerHere}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
