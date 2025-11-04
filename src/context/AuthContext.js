import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user data
  const loadUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Load user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Set auth token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Signup
  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password
      });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
        errors: error.response?.data?.errors
      };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  // Update profile
  const updateProfile = async (name, email) => {
    try {
      const response = await axios.put('/api/auth/updateprofile', {
        name,
        email
      });

      if (response.data.success) {
        setUser(response.data.data);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed',
        errors: error.response?.data?.errors
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
