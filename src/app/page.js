'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const SOLUTIONS = [
  {
    key: 'croplens',
    name: 'CropLens',
    icon: '🌿',
    descEn: 'AI-powered crop health monitoring & analysis',
    descHi: 'AI-संचालित फसल स्वास्थ्य निगरानी',
    url: 'https://croplens.streamlit.app',
    gradient: 'from-green-900/50 to-green-800/20',
    border: 'border-green-700/40 hover:border-green-500/70',
  },
  {
    key: 'dizmatrix',
    name: 'DizMatrix',
    icon: '🧬',
    descEn: 'Disease detection and diagnostic matrix',
    descHi: 'रोग पहचान और नैदानिक मैट्रिक्स',
    url: 'https://dizmatrix.vercel.app',
    gradient: 'from-blue-900/50 to-blue-800/20',
    border: 'border-blue-700/40 hover:border-blue-500/70',
  },
  {
    key: 'senseorbit',
    name: 'SenseOrbit',
    icon: '🛰️',
    descEn: 'Satellite-based precision field intelligence',
    descHi: 'उपग्रह-आधारित खेत बुद्धिमत्ता',
    url: 'https://senseorbit-web.vercel.app',
    gradient: 'from-purple-900/50 to-purple-800/20',
    border: 'border-purple-700/40 hover:border-purple-500/70',
  },
  {
    key: 'quallis',
    name: 'Quallis',
    icon: '✅',
    descEn: 'Crop quality grading and assessment platform',
    descHi: 'फसल गुणवत्ता मूल्यांकन मंच',
    url: 'https://quallis.vercel.app',
    gradient: 'from-amber-900/50 to-amber-800/20',
    border: 'border-amber-700/40 hover:border-amber-500/70',
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(22,163,74,0.18) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="text-7xl mb-6 drop-shadow-lg">🌾</div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            {t.heroTitle}
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-lg shadow-lg shadow-green-900/40 transition-all duration-200 active:scale-95"
            >
              {t.getStarted}
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-green-700 text-green-400 hover:bg-green-900/30 font-bold rounded-2xl text-lg transition-all duration-200 active:scale-95"
            >
              {t.loginBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Solutions ── */}
      <section className="max-w-6xl mx-auto px-4 pb-28">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-10">
          {t.solutionsHeading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLUTIONS.map((s) => (
            <a
              key={s.key}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-gradient-to-br ${s.gradient} border ${s.border} rounded-2xl p-6 flex flex-col hover:scale-[1.03] hover:-translate-y-1 transition-all duration-200 cursor-pointer group`}
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-green-300 transition-colors">
                {s.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">
                {lang === 'en' ? s.descEn : s.descHi}
              </p>
              <div className="mt-4 text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                {t.clickToVisit} →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1e3a1e] py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} AgriFusion Hub — Smart AgriTech Credits
      </footer>
    </div>
  );
}