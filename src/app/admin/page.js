'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [stats, setStats]     = useState({ total: 0, pending: 0, pendingCarts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user)                   { router.replace('/login');     return; }
    if (user.role !== 'admin')   { router.replace('/dashboard'); return; }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    const [
      { data: farmersData },
      { count: pendingCarts },
    ] = await Promise.all([
      supabase.from('farmers').select('id, is_verified, dif_code').eq('role', 'farmer'),
      supabase.from('carts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const total = farmersData?.length ?? 0;
    const pending = farmersData?.filter(
      (f) => !f.is_verified && f.dif_code?.toUpperCase() !== 'RJCT'
    ).length ?? 0;

    setStats({ total, pending, pendingCarts: pendingCarts ?? 0 });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-green-400 animate-pulse">{t.loading}</div>
      </div>
    );
  }

  const statCards = [
    { label: t.totalFarmers,   value: stats.total,        icon: '👨‍🌾', border: 'border-green-700/50',  bg: 'bg-green-950/20'  },
    { label: t.pendingFarmers, value: stats.pending,       icon: '⏳',  border: 'border-yellow-700/50', bg: 'bg-yellow-950/20' },
    { label: t.pendingCarts,   value: stats.pendingCarts,  icon: '🛒',  border: 'border-blue-700/50',   bg: 'bg-blue-950/20'   },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-white mb-2">
          {t.adminDashboard}
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          {t.welcomeBack}, <span className="text-green-400">{user?.name}</span>
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {statCards.map((c) => (
            <div key={c.label} className={`${c.bg} border ${c.border} rounded-2xl p-6`}>
              <div className="text-4xl mb-3">{c.icon}</div>
              <div className="text-5xl font-extrabold text-white mb-2 leading-none">{c.value}</div>
              <div className="text-gray-400 text-sm font-medium">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Quick action tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/admin/farmers"
            className="bg-[#111811] border border-[#1e3a1e] hover:border-green-700 rounded-2xl p-7 group transition-all duration-200"
          >
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h2 className="text-white font-bold text-xl mb-1 group-hover:text-green-400 transition-colors">
              {t.manageFarmers}
            </h2>
            <p className="text-gray-500 text-sm">
              {stats.pending > 0
                ? `${stats.pending} ${t.pendingFarmers.toLowerCase()}`
                : t.allVerified}
            </p>
          </Link>

          <Link
            href="/admin/carts"
            className="bg-[#111811] border border-[#1e3a1e] hover:border-green-700 rounded-2xl p-7 group transition-all duration-200"
          >
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-white font-bold text-xl mb-1 group-hover:text-green-400 transition-colors">
              {t.manageCarts}
            </h2>
            <p className="text-gray-500 text-sm">
              {stats.pendingCarts > 0
                ? `${stats.pendingCarts} ${t.pendingCarts.toLowerCase()}`
                : t.noPendingCarts}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
