'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const CREDIT_KEYS = ['croplens', 'dizmatrix', 'senseorbit', 'quallix'];
const CREDIT_LABELS = {
  croplens: 'CropLens', dizmatrix: 'DizMatrix',
  senseorbit: 'SenseOrbit', quallix: 'Quallis',
};

export default function AdminFarmersPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [farmers, setFarmers]       = useState([]);
  const [difInputs, setDifInputs]   = useState({});
  const [loading, setLoading]       = useState(true);
  const [processingId, setProcessing] = useState(null);
  const [toast, setToast]           = useState('');

  useEffect(() => {
    if (!user)                 { router.replace('/login');     return; }
    if (user.role !== 'admin') { router.replace('/dashboard'); return; }
    fetchFarmers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFarmers = async () => {
    const { data } = await supabase
      .from('farmers')
      .select('*')
      .eq('role', 'farmer')
      .order('created_at', { ascending: false });
    setFarmers(data || []);
    setLoading(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleVerify = async (farmer) => {
    const dif = (difInputs[farmer.id] || '').trim();
    if (!dif) { showToast(t.enterDifFirst); return; }

    setProcessing(farmer.id);

    const { error } = await supabase
      .from('farmers')
      .update({ is_verified: true, verification_status: 'verified', dif_code: dif })
      .eq('id', farmer.id);

    if (!error) {
      setFarmers((prev) =>
        prev.map((f) =>
          f.id === farmer.id ? { ...f, is_verified: true, verification_status: 'verified', dif_code: dif } : f
        )
      );
      showToast(`✅ ${farmer.farmer_name} — ${t.verified} (DIF: ${dif})`);
    } else {
      showToast(t.error);
    }

    setProcessing(null);
  };

  const handleReject = async (farmer) => {
    setProcessing(farmer.id);

    const { error } = await supabase
      .from('farmers')
      .update({ is_verified: false, verification_status: 'rejected', dif_code: null })
      .eq('id', farmer.id);

    if (!error) {
      setFarmers((prev) =>
        prev.map((f) =>
          f.id === farmer.id ? { ...f, is_verified: false, verification_status: 'rejected', dif_code: null } : f
        )
      );
      showToast(`❌ ${farmer.farmer_name} — ${t.rejected}`);
    } else {
      showToast(t.error);
    }

    setProcessing(null);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-green-400 animate-pulse">{t.loading}</div>
      </div>
    );
  }

  // Categorize farmers
  const unverified = farmers.filter(
    (f) => !f.is_verified && f.verification_status !== 'rejected'
  );
  const verified = farmers.filter((f) => f.is_verified);
  const rejected = farmers.filter(
    (f) => !f.is_verified && f.verification_status === 'rejected'
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-500 hover:text-gray-300 text-sm"
          >
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-white">{t.allFarmers}</h1>
          <span className="ml-auto px-3 py-1 bg-[#1a2e1a] rounded-full text-green-400 text-sm font-semibold">
            {farmers.length}
          </span>
        </div>

        {/* Toast */}
        {toast && (
          <div className="mb-6 p-3 bg-green-950/50 border border-green-700 text-green-400 rounded-xl text-sm">
            {toast}
          </div>
        )}

        {/* No farmers */}
        {farmers.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[#1e3a1e] rounded-2xl text-gray-600">
            <div className="text-5xl mb-4">👨‍🌾</div>
            <p>{t.noFarmersFound}</p>
          </div>
        )}

        {/* ── Pending verification section ── */}
        {unverified.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-yellow-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>⏳</span> {t.notVerified} ({unverified.length})
            </h2>
            <div className="space-y-4">
              {unverified.map((farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                  t={t}
                  difInput={difInputs[farmer.id] || ''}
                  onDifChange={(val) =>
                    setDifInputs((prev) => ({ ...prev, [farmer.id]: val.toUpperCase() }))
                  }
                  onVerify={() => handleVerify(farmer)}
                  onReject={() => handleReject(farmer)}
                  processing={processingId === farmer.id}
                  status="pending"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Verified section ── */}
        {verified.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✅</span> {t.verified} ({verified.length})
            </h2>
            <div className="space-y-3">
              {verified.map((farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                  t={t}
                  status="verified"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Rejected section ── */}
        {rejected.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>❌</span> {t.rejected} ({rejected.length})
            </h2>
            <div className="space-y-3">
              {rejected.map((farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                  t={t}
                  status="rejected"
                  difInput={difInputs[farmer.id] || ''}
                  onDifChange={(val) =>
                    setDifInputs((prev) => ({ ...prev, [farmer.id]: val.toUpperCase() }))
                  }
                  onVerify={() => handleVerify(farmer)}
                  processing={processingId === farmer.id}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function FarmerCard({
  farmer,
  t,
  difInput,
  onDifChange,
  onVerify,
  onReject,
  processing,
  status = 'pending',
}) {
  return (
    <div
      className={`bg-[#111811] border rounded-2xl p-5 ${
        status === 'verified'
          ? 'border-green-900/60'
          : status === 'rejected'
          ? 'border-red-950/60'
          : 'border-[#1e3a1e]'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Farmer info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-green-900/50 border border-green-800 flex items-center justify-center text-lg font-bold text-green-300 shrink-0">
              {farmer.farmer_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold truncate">{farmer.farmer_name}</div>
              <div className="text-gray-400 text-sm">📱 {farmer.phone_number}</div>
            </div>
            {/* Status badge */}
            <div className="shrink-0">
              {status === 'verified' ? (
                <span className="px-2.5 py-1 bg-green-900/40 text-green-400 border border-green-700 rounded-full text-xs font-semibold">
                  ✅ {t.verified}
                </span>
              ) : status === 'rejected' ? (
                <span className="px-2.5 py-1 bg-red-900/40 text-red-400 border border-red-700 rounded-full text-xs font-semibold">
                  ❌ {t.rejected}
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-yellow-900/40 text-yellow-400 border border-yellow-700 rounded-full text-xs font-semibold">
                  ⏳ {t.notVerified}
                </span>
              )}
            </div>
          </div>

          {/* Credit pills */}
          <div className="flex flex-wrap gap-1.5">
            {CREDIT_KEYS.map((key) => (
              <span
                key={key}
                className="px-2 py-0.5 bg-[#0a0f0a] border border-[#1e3a1e] rounded-lg text-gray-500 text-xs"
              >
                {CREDIT_LABELS[key]}:{' '}
                <span className="text-gray-300 font-semibold">{farmer[key] ?? 0}</span>
              </span>
            ))}
            {farmer.dif_code && (
              <span className="px-2 py-0.5 bg-green-950/40 border border-green-800 rounded-lg text-green-400 text-xs font-mono">
                DIF: {farmer.dif_code}
              </span>
            )}
          </div>
        </div>

        {/* Actions for Pending Farmers */}
        {status === 'pending' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:w-80 shrink-0 w-full">
            <input
              type="text"
              maxLength={10}
              placeholder={t.difCodePlaceholder}
              value={difInput}
              onChange={(e) => onDifChange(e.target.value)}
              className="flex-1 bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 font-mono uppercase"
            />
            <div className="flex gap-2">
              <button
                onClick={onReject}
                disabled={processing}
                className="px-3.5 py-2.5 bg-red-950/60 border border-red-900 hover:bg-red-900/60 text-red-400 font-semibold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50"
                title={t.rejectVerification}
              >
                {processing ? '…' : `✗ ${t.rejectVerification}`}
              </button>
              <button
                onClick={onVerify}
                disabled={processing}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm whitespace-nowrap transition-all active:scale-95 shadow-md shadow-green-950/50"
              >
                {processing ? '…' : `✓ ${t.verify}`}
              </button>
            </div>
          </div>
        )}

        {/* Re-verify action for Rejected Farmers */}
        {status === 'rejected' && (
          <div className="flex items-center gap-2 sm:w-72 shrink-0 w-full">
            <input
              type="text"
              maxLength={10}
              placeholder={t.difCodePlaceholder}
              value={difInput}
              onChange={(e) => onDifChange(e.target.value)}
              className="flex-1 bg-[#0a0f0a] border border-[#1e3a1e] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 font-mono uppercase"
            />
            <button
              onClick={onVerify}
              disabled={processing}
              className="px-4 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm whitespace-nowrap transition-all active:scale-95"
            >
              {processing ? '…' : `✓ ${t.reopenVerification}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
