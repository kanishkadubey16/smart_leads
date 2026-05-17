import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Clear errors
  const clearError = () => setError(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('smart_leads_token');
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (err: any) {
          // Token is invalid or expired
          console.error('Session restoration failed:', err);
          localStorage.removeItem('smart_leads_token');
          setToken(null);
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('smart_leads_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, password: string, role: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('smart_leads_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed on server:', err);
    } finally {
      localStorage.removeItem('smart_leads_token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerUser,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
