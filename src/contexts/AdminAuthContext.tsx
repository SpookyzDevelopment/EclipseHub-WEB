import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ADMIN_CREDENTIALS } from '../config/admin';

interface AdminUser {
  email: string;
  role: string;
  id: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin_session');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        const sessionExpiry = localStorage.getItem('admin_session_expiry');

        if (sessionExpiry && new Date(sessionExpiry) > new Date()) {
          setAdmin(adminData);
        } else {
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_session_expiry');
        }
      } catch (error) {
        console.error('Error parsing admin session:', error);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password });
      console.log('Expected credentials:', ADMIN_CREDENTIALS);

      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const adminUser: AdminUser = {
          email,
          role: 'super_admin',
          id: 'admin-1',
        };

        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 8);

        localStorage.setItem('admin_session', JSON.stringify(adminUser));
        localStorage.setItem('admin_session_expiry', expiryTime.toISOString());

        setAdmin(adminUser);
        return { success: true };
      } else {
        console.log('Credentials do not match');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Auth error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_session_expiry');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
