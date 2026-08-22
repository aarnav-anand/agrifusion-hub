'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <nav className="bg-[#0d1a0d] border-b border-[#1e3a1e] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌾</span>
            <span className="text-green-400 font-bold text-lg leading-none">
              {t.appName}
            </span>
          </Link>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
            <LanguageToggle />

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-green-400 text-sm transition-colors hidden sm:inline"
                    >
                      {t.admin}
                    </Link>
                    <Link
                      href="/admin/farmers"
                      className="text-gray-300 hover:text-green-400 text-sm transition-colors hidden md:inline"
                    >
                      {t.manageFarmers}
                    </Link>
                    <Link
                      href="/admin/carts"
                      className="text-gray-300 hover:text-green-400 text-sm transition-colors hidden md:inline"
                    >
                      {t.manageCarts}
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-green-400 text-sm transition-colors"
                  >
                    {t.dashboard}
                  </Link>
                )}

                {/* User chip */}
                <span className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#1a2e1a] border border-[#1e3a1e] rounded-full text-xs text-gray-300">
                  <span className="text-green-400">●</span>
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-950/50 text-red-400 border border-red-900 hover:bg-red-900/60 text-sm transition-all"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-green-400 text-sm transition-colors"
                >
                  {t.login}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-semibold transition-all"
                >
                  {t.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
