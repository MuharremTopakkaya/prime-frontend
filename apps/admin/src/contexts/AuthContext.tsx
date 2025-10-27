import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthenticationMethod } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticationMethod: AuthenticationMethod | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticationMethod, setAuthenticationMethod] = useState<AuthenticationMethod | null>(null);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde token kontrolü yap
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = authService.getToken();
      
      if (token && authService.isTokenValid(token)) {
        const authMethod = authService.getAuthenticationMethod(token);
        if (authMethod) {
          setIsAuthenticated(true);
          setAuthenticationMethod(authMethod);
        } else {
          // Token geçersiz, temizle
          authService.removeToken();
          setIsAuthenticated(false);
          setAuthenticationMethod(null);
        }
      } else {
        // Token yok veya geçersiz
        authService.removeToken();
        setIsAuthenticated(false);
        setAuthenticationMethod(null);
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const authMethod = await authService.performLogin({ email, password });
      
      if (authMethod) {
        setIsAuthenticated(true);
        setAuthenticationMethod(authMethod);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.removeToken();
    setIsAuthenticated(false);
    setAuthenticationMethod(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    authenticationMethod,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
