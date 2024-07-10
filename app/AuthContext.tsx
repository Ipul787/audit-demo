import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTokenFromStorage, saveTokenToStorage, removeTokenFromStorage } from './storage';
import axios from 'axios';

type AuthContextType = {
  userToken: string | null;
  login: (username: string, password: string) => void;
  register: (email: string, username: string, password: string) => void;
  logout: () => void;
};
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
  
    const login = async (username: string, password: string) => {
      try {
        const response = await axios.post('http://10.0.2.2:3000/login', { username, password });
        const token = response.data.token;
        setUserToken(token);
        await saveTokenToStorage(token);
      } catch (error) {
        console.error(error);
      }
    };

    const register = async (email: string, username: string, password: string) => {
      try {
        await axios.post('http://10.0.2.2:3000/register', { email, username, password });
        await login(username, password);
      } catch (error) {
        console.error(error);
      }
    };
  
    const logout = async () => {
      setUserToken(null);
      await removeTokenFromStorage();
    };

    useEffect(() => {
      const loadToken = async () => {
        const storedToken = await getTokenFromStorage();
        if (storedToken) {
          setUserToken(storedToken);
        }
      };
      loadToken();
    }, []);
  
    return (
      <AuthContext.Provider value={{ userToken, login, register, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

export default AuthContext;