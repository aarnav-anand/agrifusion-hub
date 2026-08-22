'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanPhone) {
      setError(t.error);
      return;
    }

    setLoading(true);

    try {
      // Check for duplicate phone
      const { data: existing } = await supabase
        .from('farmers')
        .select('id')
        .eq('phone_number', cleanPhone);

      if (existing && existing.length > 0) {
        setError(t.phoneExists);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('farmers').insert({
        farmer_name: cleanName,
        phone_number: cleanPhone,
        role: 'farmer',
        is_verified: false,
        dif_code: null,
        croplens: 0,
        dizmatrix: 0,
        senseorbit: 0,
        quallix: 0,
      });

      if (insertError) {
        console.error('Registration error:', insertError);
        setError(insertError.message || t.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      console.error(err);
      setError(err?.message || t.error);
    }

    setLoading(false);
  };

  // ── Success screen ──
  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-[#0a0f0a]">
        <div className="bg-[#111811] border border-green-700 rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-5">✅</div>
          <h2 className="text-xl font-bold text-green-400 mb-3">{t.registrationSuccess}</h2>
          <p className="text-gray-500 text-sm">{t.redirectingToLogin}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[#0a0f0a]">
      <div className="w-full max-w-md">
        <div className="bg-[#111811] border border-[#1e3a1e] rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-5xl">🌾</span>
            <h1 className="text-2xl font-bold text-white mt-4">{t.createAccount}</h1>
            <p className="text-gray-500 text-sm mt-1">{t.appName}</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">{t.fullName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ram Kumar"
                className="w-full bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-4 py-3 text-white placeholder-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">{t.phoneNumber}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="9876543210"
                className="w-full bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-4 py-3 text-white placeholder-gray-700 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? t.loading : t.registerBtn}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
              {t.loginHere ?? '← Back to Login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
