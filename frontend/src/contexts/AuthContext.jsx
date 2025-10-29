import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../api/userApi';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      
      if (token && userInfo) {
        const userData = JSON.parse(userInfo);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Verify token is still valid by fetching profile
        try {
          const response = await getUserProfile();
          if (response.data) {
            setUser(response.data);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
          }
        } catch (error) {
          // Token is invalid, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials);
      
      if (response.data) {
        const { token, ...userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: userData };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerUser(userData);
      
      if (response.data) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isVolunteer = () => {
    return user?.role === 'volunteer';
  };

  const isNGO = () => {
    return user?.role === 'ngo';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isVolunteer,
    isNGO,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
