"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string) => Promise<void>; // Backward compatibility wrapper
  registerFull: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  demoLogin: (type: 'user' | 'admin') => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Configure Axios globally to send cookies
  axios.defaults.withCredentials = true;

  // Load auth state from HTTP-only cookies via /me endpoint on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/auth/me`);
        if (res.data) {
          setUser({
            id: res.data._id || res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            profilePic: res.data.profilePic
          });
        }
      } catch (err) {
        console.log('No active authentication session found.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);

    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.success) {
        setUser(res.data.user);
        return res.data.user;
      }

      throw new Error("Login failed.");
    } catch (err: any) {
      throw new Error(
        err.response?.data?.error?.message || "Login credentials invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  const registerFull = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/register`, { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || 'Registration details invalid.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string) => {
    // Backward compatibility wrapper
    return registerFull(name, email, 'demopassword123');
  };

  const googleLogin = async (credential: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/google`, { credential });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || 'Google Auth failed.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (type: 'user' | 'admin') => {
    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/demo`, { type });
      if (res.data.success) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err: any) {
      throw new Error('Demo login server link issue.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`);
    } catch (err) {
      console.warn('Logout API call failed, clearing client state anyway.');
    } finally {
      setUser(null);
      setLoading(false);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      registerFull,
      googleLogin,
      demoLogin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
