import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  role: number;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn(credentials: object): Promise<void>;
  signOut(): void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = localStorage.getItem('@HeroForce:user');
      const storagedToken = localStorage.getItem('@HeroForce:token');

      if (storagedToken && storagedUser) {
        try {
          api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
          await api.get('/auth/me');
          setUser(JSON.parse(storagedUser));
        } catch (error: any) {
          if (error.response) {
            signOut();
          } else {
            setUser(JSON.parse(storagedUser));
          }
        }
      }

      setLoading(false); 
    }

    loadStorageData();
  }, []);

  async function signIn(credentials: object) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, user: userData } = response.data;

      setUser(userData);
      api.defaults.headers.Authorization = `Bearer ${access_token}`;

      localStorage.setItem('@HeroForce:token', access_token);
      localStorage.setItem('@HeroForce:user', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('@HeroForce:token');
    localStorage.removeItem('@HeroForce:user');
    setUser(null);
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Carregando Portal...</div>;
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};