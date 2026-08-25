'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const SOLUTIONS = [
  { key: 'croplens',   label: 'CropLens',   icon: '🌿', border: 'border-green-700/50',  bg: 'bg-green-950/20'  },
  { key: 'dizmatrix',  label: 'DizMatrix',  icon: '🧬', border: 'border-blue-700/50',   bg: 'bg-blue-950/20'   },
  { key: 'senseorbit', label: 'SenseOrbit', icon: '🛰️', border: 'border-purple-700/50', bg: 'bg-purple-950/20' },
  { key: 'quallis',    label: 'Quallis',    icon: '✅', border: 'border-amber-700/50',  bg: 'bg-amber-950/20'  },
];

const EMPTY_CREDITS = { croplens: 0, dizmatrix: 0, senseorbit: 0, quallis: 0 };

export default function CreateCartPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [credits, setCredits]     = useState({ ...EMPTY_CREDITS });
  const [costs, setCosts]         = useState({});
  const [loadingPage, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!user)              { router.replace('/login');     return; }
    if (!user.is_verified)  { router.replace('/dashboard'); return; }
    fetchCosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCosts = async () => {
    const { data } = await supabase.from('credit_costs').select('*');
    if (data) {
      const map = {};
      data.forEach((row) => { map[row.solution_name] = Number(row.cost_per_credit); });
      setCosts(map);
    }
    setLoading(false);
  };

  const totalCost = SOLUTIONS.reduce(
    (sum, { key }) => sum + (credits[key] || 0) * (costs[key] || 0),
    0
  );

  const setCredit = useCallback((key, val) => {
    setCredits((prev) => ({ ...prev, [key]: Math.max(0, parseInt(val) || 0) }));
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (totalCost === 0) { setError(t.selectAtLeastOne); return; }
    setSubmitting(true);

    const { error: dbError } = await supabase.from('carts').insert({
      farmer_id:          user.id,
      croplens_credits:   credits.croplens,
      dizmatrix_credits:  credits.dizmatrix,
      senseorbit_credits: credits.senseorbit,
      quallis_credits:    credits.quallis,
      total_cost:         totalCost,
      status:             'pending',
    });

    if (dbError) { setError(t.error); setSubmitting(false); return; }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 2000);
  };

  // ── Loading ──
  if (loadingPage) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-green-400 animate-pulse">{t.loading}</div>
      </div>
    );
  }

  // ── Success ──
  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] flex items-center justify-center">
        <div className="bg-[#111811] border border-green-700 rounded-2xl p-10 max-w-sm w-full text-center mx-4">
          <div className="text-6xl mb-5">✅</div>
          <p className="text-green-400 font-bold text-xl">{t.cartSubmitted}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 mb-6"
        >
          ← {t.cancel}
        </button>

        <h1 className="text-2xl font-bold text-white mb-8">{t.createCartTitle}</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-800 text-red-400 rounded-xl text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Solution rows */}
        <div className="space-y-4 mb-8">
          {SOLUTIONS.map(({ key, label, icon, border, bg }) => {
            const lineTotal = (credits[key] || 0) * (costs[key] || 0);
            return (
              <div key={key} className={`${bg} border ${border} rounded-2xl p-5`}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{icon}</span>
                    <div>
                      <div className="text-white font-bold">{label}</div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {t.creditCost}:{' '}
                        <span className="text-green-400 font-semibold">
                          ₹{costs[key] ?? '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {credits[key] || 0} × ₹{costs[key] || 0}
                    </div>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCredit(key, (credits[key] || 0) - 1)}
                    className="w-11 h-11 rounded-xl bg-[#0a0f0a] border border-[#1e3a1e] text-white text-xl font-bold hover:bg-[#1a2e1a] active:scale-90 transition-all"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={credits[key]}
                    onChange={(e) => setCredit(key, e.target.value)}
                    className="flex-1 bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-4 py-2.5 text-white text-center text-xl font-bold"
                  />
                  <button
                    onClick={() => setCredit(key, (credits[key] || 0) + 1)}
                    className="w-11 h-11 rounded-xl bg-[#0a0f0a] border border-[#1e3a1e] text-white text-xl font-bold hover:bg-[#1a2e1a] active:scale-90 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Cost Box */}
        <div className="bg-green-950/40 border-2 border-green-700/60 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm font-medium">{t.totalCost}</div>
              <div className="text-gray-600 text-xs mt-0.5">
                {SOLUTIONS.filter(({ key }) => credits[key] > 0)
                  .map(({ key, label }) => `${label}: ${credits[key]}`)
                  .join(', ') || '—'}
              </div>
            </div>
            <div className="text-green-400 font-extrabold text-4xl">
              ₹{totalCost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || totalCost === 0}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 active:scale-[0.98] shadow-lg shadow-green-900/30"
        >
          {submitting ? t.loading : `🛒 ${t.submitCart}`}
        </button>
      </div>
    </div>
  );
}