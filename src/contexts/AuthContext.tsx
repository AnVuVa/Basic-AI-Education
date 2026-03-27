import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('baiedu_user');
    if (storedUser) return JSON.parse(storedUser);
    // Pre-seeded admin account for development
    const defaultAdmin: User = {
      id: 'admin-001',
      name: 'Admin',
      email: 'admin@baiedu.vn',
      role: 'admin',
      avatar: 'https://picsum.photos/seed/baiedu-admin/100/100',
    };
    localStorage.setItem('baiedu_user', JSON.stringify(defaultAdmin));
    return defaultAdmin;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('baiedu_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('baiedu_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
