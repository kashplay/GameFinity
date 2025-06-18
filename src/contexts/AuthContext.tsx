import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'USER' | 'ADMIN') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loginError: string | null;
  postLoginLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Fixed credentials
const CREDENTIALS = {
  USER: {
    username: 'user',
    password: 'user123'
  },
  ADMIN: {
    username: 'admin',
    password: 'admin@12345'
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('gameShopUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [postLoginLoading, setPostLoginLoading] = useState(false);

  const login = async (username: string, password: string, role: 'USER' | 'ADMIN'): Promise<boolean> => {
    setLoginError(null);
    
    // Validate credentials
    const validCredentials = CREDENTIALS[role];
    
    if (username !== validCredentials.username || password !== validCredentials.password) {
      setLoginError('Invalid username or password');
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      role
    };
    
    setUser(newUser);
    localStorage.setItem('gameShopUser', JSON.stringify(newUser));
    
    // Set post-login loading state
    setPostLoginLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setPostLoginLoading(false);
    }, 1500);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setLoginError(null);
    setPostLoginLoading(false);
    localStorage.removeItem('gameShopUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loginError,
    postLoginLoading
  };

  return (
    <AuthContext.Provider value={value}>
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