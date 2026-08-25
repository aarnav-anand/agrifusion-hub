'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const SOLUTION_LABELS = {
  croplens: 'CropLens', dizmatrix: 'DizMatrix',
  senseorbit: 'SenseOrbit', quallis: 'Quallis',
};
const CREDIT_FIELDS = ['croplens', 'dizmatrix', 'senseorbit', 'quallis'];

const STATUS_STYLES = {
  pending:  'bg-yellow-900/40 text-yellow-400  border-yellow-700',
  approved: 'bg-green-900/40  text-green-400   border-green-700',
  rejected: 'bg-red-900/40    text-red-400     border-red-700',
};

const FILTERS = ['pending', 'approved', 'rejected', 'all'];

export default function AdminCartsPage() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [carts, setCarts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [processingId, setProcessing] = useState(null);
  const [filter, setFilter]         = useState('pending');
  const [toast, setToast]           = useState({ msg: '', type: 'success' });

  useEffect(() => {
    if (!user)                 { router.replace('/login');     return; }
    if (user.role !== 'admin') { router.replace('/dashboard'); return; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') fetchCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user]);

  const fetchCarts = async () => {
    setLoading(true);

    let query = supabase
      .from('carts')
      .select(`
        id, created_at, farmer_id,
        croplens_credits, dizmatrix_credits, senseorbit_credits, quallis_credits,
        total_cost, status, reviewed_at, reviewed_by,
        farmer:farmer_id ( farmer_name, phone_number, dif_code )
      `)
      .order('created_at', { ascending: false });

    if (filter !== 'all') query = query.eq('status', filter);

    const { data } = await query;
    setCarts(data || []);
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const handleApprove = useCallback(async (cart) => {
    setProcessing(cart.id);

    // 1. Update cart status
    const { error: cartErr } = await supabase
      .from('carts')
      .update({
        status:      'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.name,
      })
      .eq('id', cart.id);

    if (cartErr) { showToast(t.error, 'error'); setProcessing(null); return; }

    // 2. Fetch current farmer credits
    const { data: farmerRow, error: farmerErr } = await supabase
      .from('farmers')
      .select('croplens, dizmatrix, senseorbit, quallis')
      .eq('id', cart.farmer_id)
      .single();

    if (farmerErr || !farmerRow) { showToast(t.error, 'error'); setProcessing(null); return; }

    // 3. Increment credits
    await supabase.from('farmers').update({
      croplens:   (farmerRow.croplens   ?? 0) + (cart.croplens_credits   ?? 0),
      dizmatrix:  (farmerRow.dizmatrix  ?? 0) + (cart.dizmatrix_credits  ?? 0),
      senseorbit: (farmerRow.senseorbit ?? 0) + (cart.senseorbit_credits ?? 0),
      quallis:    (farmerRow.quallis    ?? 0) + (cart.quallis_credits    ?? 0),
    }).eq('id', cart.farmer_id);

    setCarts((prev) =>
      prev.map((c) => c.id === cart.id ? { ...c, status: 'approved' } : c)
    );
    showToast(t.cartApproved);
    setProcessing(null);
  }, [user, t]);

  const handleReject = useCallback(async (cart) => {
    setProcessing(cart.id);

    await supabase.from('carts').update({
      status:      'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.name,
    }).eq('id', cart.id);

    setCarts((prev) =>
      prev.map((c) => c.id === cart.id ? { ...c, status: 'rejected' } : c)
    );
    showToast(t.cartRejected, 'info');
    setProcessing(null);
  }, [user, t]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button onClick={() => router.push('/admin')} className="text-gray-500 hover:text-gray-300 text-sm">
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-white">{t.cartRequests}</h1>

          {/* Filter tabs */}
          <div className="ml-auto flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-[#111811] border border-[#1e3a1e] text-gray-400 hover:border-green-700'
                }`}
              >
                {f === 'all' ? t.all : t[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Toast */}
        {toast.msg && (
          <div
            className={`mb-6 p-3 rounded-xl text-sm border ${
              toast.type === 'error'
                ? 'bg-red-950/50 border-red-800 text-red-400'
                : 'bg-green-950/50 border-green-700 text-green-400'
            }`}
          >
            {toast.msg}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 text-green-400 animate-pulse">{t.loading}</div>
        ) : carts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#1e3a1e] rounded-2xl text-gray-600">
            <div className="text-5xl mb-4">🛒</div>
            <p>{t.noCartsFound}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {carts.map((cart) => (
              <CartCard
                key={cart.id}
                cart={cart}
                t={t}
                lang={lang}
                onApprove={() => handleApprove(cart)}
                onReject={() => handleReject(cart)}
                processing={processingId === cart.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CartCard({ cart, t, lang, onApprove, onReject, processing }) {
  const farmer = cart.farmer;

  return (
    <div className="bg-[#111811] border border-[#1e3a1e] hover:border-[#2a4a2a] rounded-2xl p-6 transition-colors">
      {/* Top row — farmer info + total cost */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        {/* Farmer */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-900/50 border border-green-800 flex items-center justify-center text-xl font-bold text-green-300 shrink-0">
            {farmer?.farmer_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-tight">{farmer?.farmer_name ?? '—'}</div>
            <div className="flex flex-wrap gap-3 text-sm mt-0.5">
              <span className="text-gray-400">📱 {farmer?.phone_number ?? '—'}</span>
              {farmer?.dif_code && (
                <span className="text-green-400 font-mono font-semibold">
                  DIF: {farmer.dif_code}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cost + date */}
        <div className="text-right shrink-0">
          <div className="text-green-400 font-extrabold text-2xl leading-tight">
            ₹{Number(cart.total_cost).toLocaleString('en-IN')}
          </div>
          <div className="text-gray-600 text-xs mt-0.5">
            {new Date(cart.created_at).toLocaleDateString(
              lang === 'hi' ? 'hi-IN' : 'en-IN',
              { dateStyle: 'medium' }
            )}
          </div>
        </div>
      </div>

      {/* Credit breakdown */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CREDIT_FIELDS.map((key) =>
          cart[`${key}_credits`] > 0 ? (
            <span
              key={key}
              className="px-3 py-1 bg-[#0a0f0a] border border-[#1e3a1e] rounded-full text-sm text-gray-300"
            >
              {SOLUTION_LABELS[key]}:{' '}
              <span className="text-white font-bold">{cart[`${key}_credits`]}</span>
            </span>
          ) : null
        )}
      </div>

      {/* Footer — status + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1e3a1e]">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-bold border rounded-full ${
              STATUS_STYLES[cart.status] ?? STATUS_STYLES.pending
            }`}
          >
            {t[cart.status] ?? cart.status}
          </span>
          {cart.reviewed_at && (
            <span className="text-gray-600 text-xs">
              {t.reviewed}: {new Date(cart.reviewed_at).toLocaleDateString(
                lang === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'short' }
              )}
              {cart.reviewed_by && ` · ${cart.reviewed_by}`}
            </span>
          )}
        </div>

        {cart.status === 'pending' && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onReject}
              disabled={processing}
              className="px-5 py-2 bg-red-950/50 border border-red-800 text-red-400 hover:bg-red-900/50 font-bold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {processing ? '…' : `✗ ${t.reject}`}
            </button>
            <button
              onClick={onApprove}
              disabled={processing}
              className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {processing ? '…' : `✓ ${t.approve}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}