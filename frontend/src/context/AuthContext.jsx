import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mf_user');
    return stored ? JSON.parse(stored) : null;
  });

  const setAuthHeader = (token) => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (user?.token) setAuthHeader(user.token);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('mf_user', JSON.stringify(userData));
    setAuthHeader(userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mf_user');
    setAuthHeader(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('mf_user', JSON.stringify(userData));
    setAuthHeader(userData.token);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
