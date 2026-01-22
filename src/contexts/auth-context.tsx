import React, { createContext, useContext, useState, useEffect } from 'react';

import { client } from '@/sanityClient';

interface AuthContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Fetch the first adminSettings document
      const settings = await client.fetch(`*[_type == "adminSettings"][0]`);

      if (settings && settings.email && settings.password) {
        if (email === settings.email && password === settings.password) {
          setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
          return true;
        }
        return false;
      }

      // Fallback/Legacy behavior (keep env vars as backup or just fail? Request said "remove the Demo credentials text", implying reliance on DB. 
      // But if DB is empty, user can't login to create the entry!
      // I should keep the env vars as a "bootstrap" login just in case.
      const fallbackEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@family.com';
      const fallbackPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

      if (email === fallbackEmail && password === fallbackPass) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        return true;
      }

      return false;
    } catch (err) {
      console.error("Login Error", err);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}