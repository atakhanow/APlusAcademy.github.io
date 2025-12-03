import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Admin } from '@shared/schema';

type AuthContextType = {
  admin: Admin | null;
  loading: boolean;
  signIn: (login: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in (from localStorage)
    const storedAdmin = localStorage.getItem('admin_session');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAdmin(adminData);
        setIsAdmin(true);
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (login: string, password: string) => {
    try {
      // Call Supabase function to verify admin credentials
      const { data, error } = await supabase.rpc('verify_admin_login', {
        p_login: login,
        p_password: password,
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        return { error: { message: error.message || 'Login yoki parol noto\'g\'ri' } };
      }

      // Supabase RPC function JSON qaytaradi
      const result = data;

      if (result && result.success === true) {
        // Store admin session
        const adminData = {
          login: result.login,
          name: result.name,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('admin_session', JSON.stringify(adminData));
        setAdmin(adminData as Admin);
        setIsAdmin(true);
        return { error: null };
      } else {
        return { error: { message: 'Login yoki parol noto\'g\'ri' } };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: { message: error.message || 'Xatolik yuz berdi' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('admin_session');
    setAdmin(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, signIn, signOut, isAdmin }}>
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

