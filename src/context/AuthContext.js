'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'agrifusion_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (_) {}
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    setUser(null);
  };

  // Allow components to refresh user data (e.g. after verification)
  const refreshUser = (partial) => {
    setUser((prevUser) => {
      if (!prevUser) return null; // Prevent resurrecting user if logged out
      const updated = { ...prevUser, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
