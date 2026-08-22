'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const SOLUTIONS = [
  { key: 'croplens',   label: 'CropLens',   icon: '🌿', url: 'https://croplens.streamlit.app',    border: 'border-green-700/50',  bg: 'bg-green-950/20'  },
  { key: 'dizmatrix',  label: 'DizMatrix',  icon: '🧬', url: 'https://dizmatrix.vercel.app',       border: 'border-blue-700/50',   bg: 'bg-blue-950/20'   },
  { key: 'senseorbit', label: 'SenseOrbit', icon: '🛰️', url: 'https://senseorbit-web.vercel.app',  border: 'border-purple-700/50', bg: 'bg-purple-950/20' },
  { key: 'quallix',    label: 'Quallis',    icon: '✅', url: 'https://quallis.vercel.app',          border: 'border-amber-700/50',  bg: 'bg-amber-950/20'  },
];

const STATUS_STYLES = {
  pending:  'bg-yellow-900/40 text-yellow-400  border-yellow-700',
  approved: 'bg-green-900/40  text-green-400   border-green-700',
  rejected: 'bg-red-900/40    text-red-400     border-red-700',
};

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [farmer, setFarmer]   = useState(null);
  const [carts, setCarts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user)                  { router.replace('/login');  return; }
    if (user.role === 'admin')  { router.replace('/admin');  return; }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    const [{ data: farmerRow }, { data: cartRows }] = await Promise.all([
      supabase.from('farmers').select('*').eq('id', user.id).single(),
      supabase.from('carts').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false }),
    ]);

    if (farmerRow) {
      setFarmer(farmerRow);
      // Keep session in sync with latest DB state
      refreshUser({
        is_verified: farmerRow.is_verified,
        dif_code:    farmerRow.dif_code,
      });
    }

    setCarts(cartRows || []);
    setLoading(false);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-green-400 text-lg animate-pulse">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {t.welcomeBack},{' '}
              <span className="text-green-400">{farmer?.farmer_name}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {farmer?.dif_code ? (
                <span className="text-sm text-gray-400">
                  {t.difCode}:{' '}
                  <span className="font-mono font-bold text-green-300 bg-green-950/40 border border-green-800 px-2 py-0.5 rounded-lg">
                    {farmer.dif_code}
                  </span>
                </span>
              ) : (
                <span className="text-sm text-gray-600">📋 {t.noDif}</span>
              )}
              <span className="text-sm text-gray-600">📱 {farmer?.phone_number}</span>
            </div>
          </div>

          {farmer?.is_verified && farmer?.dif_code && (
            <Link
              href="/dashboard/create-cart"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shrink-0"
            >
              🛒 {t.createCart}
            </Link>
          )}
        </div>

        {/* ── Verification Banner ── */}
        {(!farmer?.is_verified || !farmer?.dif_code) && (
          <div className="mb-8 p-4 bg-yellow-950/30 border border-yellow-800/60 rounded-2xl flex items-start gap-3 text-yellow-400">
            <span className="text-2xl mt-0.5">⏳</span>
            <p className="text-sm leading-relaxed">{t.pendingVerification}</p>
          </div>
        )}

        {/* ── Credits Grid ── */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t.yourCredits}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SOLUTIONS.map(({ key, label, icon, border, bg, url }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${bg} border ${border} rounded-2xl p-5 flex flex-col hover:scale-[1.04] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-gray-400 text-xs mb-1 font-medium">{label}</div>
                <div className="text-4xl font-extrabold text-white leading-none">
                  {farmer?.[key] ?? 0}
                </div>
                <div className="text-gray-600 text-xs mt-1">{t.creditsLabel}</div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Carts ── */}
        <section>
          <h2 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t.yourCarts}
          </h2>

          {carts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#1e3a1e] rounded-2xl text-gray-600">
              <div className="text-5xl mb-4">🛒</div>
              <p>{t.noCartsYet}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {carts.map((cart) => (
                <div key={cart.id} className="bg-[#111811] border border-[#1e3a1e] rounded-xl p-5 hover:border-[#2a4a2a] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Credit tags */}
                    <div className="flex flex-wrap gap-2">
                      {SOLUTIONS.map(({ key, label }) =>
                        cart[`${key}_credits`] > 0 ? (
                          <span
                            key={key}
                            className="px-2.5 py-1 bg-[#1a2e1a] rounded-full text-xs text-gray-300 border border-[#1e3a1e]"
                          >
                            {label}:{' '}
                            <span className="text-white font-bold">{cart[`${key}_credits`]}</span>
                          </span>
                        ) : null
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-green-400 font-bold text-lg">
                        ₹{Number(cart.total_cost).toLocaleString('en-IN')}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${STATUS_STYLES[cart.status]}`}>
                        {t[cart.status]}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-600 text-xs mt-2">
                    {new Date(cart.created_at).toLocaleDateString(
                      lang === 'hi' ? 'hi-IN' : 'en-IN',
                      { dateStyle: 'medium' }
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
