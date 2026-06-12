'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'admin' | 'user' | null;

interface AuthContextType {
  role: Role;
  login: (role: Role, pinOrPassword: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_PIN = '030709';
const ADMIN_PASSWORD = '270907';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('birthday-role') as Role;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const login = (loginRole: Role, pinOrPassword: string): boolean => {
    if (loginRole === 'user') {
      if (pinOrPassword !== USER_PIN) return false;
    }
    if (loginRole === 'admin') {
      if (pinOrPassword !== ADMIN_PASSWORD) return false;
    }
    setRole(loginRole);
    localStorage.setItem('birthday-role', loginRole!);
    return true;
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('birthday-role');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isAdmin: role === 'admin' }}>
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
