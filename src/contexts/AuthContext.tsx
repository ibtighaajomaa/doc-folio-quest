import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { email: string; password: string; nom: string; prenom: string; specialite?: string }) => Promise<{ success: boolean; error?: string }>;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// In-memory store for registered users (persists during session)
const registeredUsers: (User & { password: string; specialite?: string })[] = mockUsers.map(u => ({ ...u, password: 'demo' }));

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const found = registeredUsers.find(u => u.email === email);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      const idx = registeredUsers.findIndex(u => u.id === prev.id);
      if (idx !== -1) Object.assign(registeredUsers[idx], data);
      return updated;
    });
  }, []);

  const register = useCallback(async (data: { email: string; password: string; nom: string; prenom: string; specialite?: string }) => {
    const exists = registeredUsers.find(u => u.email === data.email);
    if (exists) return { success: false, error: 'Un compte avec cet e-mail existe déjà.' };

    const newUser = {
      id: `U${Date.now()}`,
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      role: 'medecin' as UserRole,
      password: data.password,
      specialite: data.specialite,
    };
    registeredUsers.push(newUser);
    setUser({ id: newUser.id, email: newUser.email, nom: newUser.nom, prenom: newUser.prenom, role: newUser.role });
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
