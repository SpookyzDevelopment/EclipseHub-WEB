import { createContext, useContext, useEffect, useState } from 'react';

interface SimpleUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: SimpleUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const usersData = localStorage.getItem('app_users');
      const users = usersData ? JSON.parse(usersData) : [];

      if (users.find((u: any) => u.email === email)) {
        return { error: { message: 'User already exists' } };
      }

      const newUser: SimpleUser = {
        id: Date.now().toString(),
        email
      };

      users.push({ ...newUser, password });
      localStorage.setItem('app_users', JSON.stringify(users));
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);

      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign up failed' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const usersData = localStorage.getItem('app_users');
      const users = usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (!foundUser) {
        return { error: { message: 'Invalid login credentials' } };
      }

      const loggedInUser: SimpleUser = {
        id: foundUser.id,
        email: foundUser.email
      };

      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign in failed' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
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
