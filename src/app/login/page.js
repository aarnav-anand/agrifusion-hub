'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'dif'
  const [matchedUser, setMatchedUser] = useState(null);
  const [inputDif, setInputDif] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const completeLogin = (userRecord) => {
    login({
      id: userRecord.id,
      name: userRecord.farmer_name,
      phone: userRecord.phone_number,
      role: userRecord.role ?? 'farmer',
      is_verified: userRecord.is_verified ?? false,
      dif_code: userRecord.dif_code ?? null,
    });

    router.replace(userRecord.role === 'admin' ? '/admin' : '/dashboard');
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setError(t.invalidCredentials);
      return;
    }

    setLoading(true);

    try {
      // Query database by phone number
      const { data, error: dbError } = await supabase
        .from('farmers')
        .select('*')
        .eq('phone_number', cleanPhone);

      if (dbError) throw dbError;

      if (!data || data.length === 0) {
        setError(t.invalidCredentials);
        setLoading(false);
        return;
      }

      const userRecord = data[0];
      setMatchedUser(userRecord);

      // Check if DIF code is assigned to this user
      const userDif = userRecord.dif_code ? String(userRecord.dif_code).trim() : '';

      if (userDif !== '') {
        // User has a DIF code assigned — prompt for DIF in modal/step 2
        setStep('dif');
        setLoading(false);
      } else {
        // No DIF assigned — log in directly & restrict cart access on dashboard
        completeLogin(userRecord);
      }
    } catch (err) {
      console.error(err);
      setError(t.error);
      setLoading(false);
    }
  };

  const handleDifSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!matchedUser) return;

    const userDif = matchedUser.dif_code ? String(matchedUser.dif_code).trim().toUpperCase() : '';
    const cleanInput = inputDif.trim().toUpperCase();

    if (cleanInput === userDif) {
      // DIF code matches — complete login
      completeLogin(matchedUser);
    } else {
      setError(t.incorrectDif);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[#0a0f0a]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#111811] border border-[#1e3a1e] rounded-2xl p-8 shadow-2xl relative">
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

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? t.loading : t.loginSubmit}
              </button>
            </form>
          ) : null}

          <p className="text-center text-gray-600 text-sm mt-6">
            {t.noAccount}{' '}
            <Link href="/register" className="text-green-400 hover:text-green-300 font-medium">
              {t.registerHere}
            </Link>
          </p>
        </div>
      </div>

      {/* ── DIF Code Modal ── */}
      {step === 'dif' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111811] border border-green-700/60 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-4xl">🔐</span>
              <h2 className="text-xl font-bold text-white mt-3">{t.enterDifTitle}</h2>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">{t.enterDifDesc}</p>
              
              {matchedUser && (
                <div className="mt-4 p-2.5 rounded-xl bg-[#0a0f0a] border border-[#1e3a1e] inline-flex items-center gap-2 text-xs text-gray-300">
                  <span>👤 {matchedUser.farmer_name}</span>
                  <span className="text-gray-600">|</span>
                  <span>📱 {matchedUser.phone_number}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleDifSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5 font-medium">
                  {t.difCode}
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={inputDif}
                  onChange={(e) => setInputDif(e.target.value.toUpperCase())}
                  required
                  autoFocus
                  placeholder={t.difPlaceholder}
                  className="w-full bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-4 py-3 text-white text-center font-mono font-bold tracking-widest text-lg uppercase placeholder-gray-700"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setError('');
                    setInputDif('');
                  }}
                  className="w-1/3 bg-[#0a0f0a] border border-[#1e3a1e] hover:bg-[#1a2e1a] text-gray-400 font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-green-900/40"
                >
                  {t.verifyLogin}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
