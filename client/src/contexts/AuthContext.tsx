import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getErrorMessage } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCitizen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('civic_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        const userData: User | undefined = res.data?.data?.user || res.data?.user;
        if (userData) {
          setUser(userData);
          localStorage.setItem('civic_user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('civic_user');
          localStorage.removeItem('civic_token');
        }
      } catch {
        // If checking auth fails (e.g. 401 unauthenticated), clear stale state
        setUser(null);
        try {
          localStorage.removeItem('civic_user');
          localStorage.removeItem('civic_token');
        } catch {
          // ignore
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const userData: User = res.data?.data?.user || res.data?.user;
      const token: string | undefined = res.data?.data?.token || res.data?.token;

      if (!userData) {
        throw new Error('Authentication succeeded but user payload is missing.');
      }

      if (token) {
        try {
          localStorage.setItem('civic_token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch {
          // ignore
        }
      }
      try {
        localStorage.setItem('civic_user', JSON.stringify(userData));
      } catch {
        // ignore
      }

      setUser(userData);
      return userData;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<User> => {
    setError(null);
    try {
      const res = await api.post('/auth/register', {
        fullName,
        email,
        password,
        phone,
      });
      const userData: User = res.data?.data?.user || res.data?.user;
      const token: string | undefined = res.data?.data?.token || res.data?.token;

      if (!userData) {
        throw new Error('Registration succeeded but user payload is missing.');
      }

      if (token) {
        try {
          localStorage.setItem('civic_token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch {
          // ignore
        }
      }
      try {
        localStorage.setItem('civic_user', JSON.stringify(userData));
      } catch {
        // ignore
      }

      setUser(userData);
      return userData;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      try {
        localStorage.removeItem('civic_token');
        localStorage.removeItem('civic_user');
        delete api.defaults.headers.common['Authorization'];
      } catch {
        // ignore
      }
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isCitizen: user?.role === 'CITIZEN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
