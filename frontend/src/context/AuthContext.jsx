// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Authentication Context & Viva Demo Session Manager

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('eventhub_token') || '');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error' | 'warning', message: '' }

  // Clear toast automatically after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Validate active session token on startup
  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get('/auth/me');
      if (res && res.success && res.user) {
        setUser(res.user);
      } else {
        // Token invalid or expired, clear out
        localStorage.removeItem('eventhub_token');
        setToken('');
        setUser(null);
      }
      setLoading(false);
    }

    checkAuth();
  }, [token]);

  // Standard Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      localStorage.setItem('eventhub_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(res.message || `Welcome back, ${res.user.name}!`, 'success');
      return { success: true };
    } else {
      showToast(res.message || 'Login failed. Please check credentials.', 'error');
      return { success: false, message: res.message };
    }
  };

  // Sign up
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success && res.token) {
      localStorage.setItem('eventhub_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast('Registration successful! Welcome to EventHub.', 'success');
      return { success: true };
    } else {
      showToast(res.message || 'Registration failed.', 'error');
      return { success: false, message: res.message };
    }
  };

  // 1-Click Fast Demo Login for College Viva Examiner
  const demoLogin = async (role = 'student') => {
    const res = await api.post('/auth/demo-login', { role });
    if (res.success && res.token) {
      localStorage.setItem('eventhub_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(`Switched role to: ${res.user.name} (${res.user.role.toUpperCase()})`, 'success');
      return { success: true };
    } else {
      showToast('Demo switch failed.', 'error');
      return { success: false };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('eventhub_token');
    setToken('');
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        toast,
        showToast,
      }}
    >
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
