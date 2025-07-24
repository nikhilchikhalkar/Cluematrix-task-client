import React, { createContext, useState } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: localStorage.getItem('name') || '',
    role: localStorage.getItem('role') || '',
    token: localStorage.getItem('token') || '',
    _id: localStorage.getItem('_id') || ''
  });

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    console.log("res login",res.data)
    const { token, name, role, _id } = res.data;
    setUser({ name, role, token, _id });
    localStorage.setItem('token', token);
    localStorage.setItem('_id', _id);
    localStorage.setItem('name', name);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setUser({ name: '', role: '', token: '' });
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
