import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

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

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // Get CSRF token first
      await authService.getCsrfToken();
      // Then check authentication
      await checkAuth();
    } catch (error) {
      console.error('Init auth error:', error);
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      // API returns {user: null} when not authenticated, or user object when authenticated
      if (userData.user === null || (!userData.user && !userData.id)) {
        setUser(null);
      } else {
        // If userData has user property, use it; otherwise userData is the user object
        setUser(userData.user || userData);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      await checkAuth();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const signupCustomer = async (data) => {
    try {
      const response = await authService.signupCustomer(data);
      await checkAuth();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signupCook = async (data) => {
    try {
      const response = await authService.signupCook(data);
      await checkAuth();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      await checkAuth();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signupCustomer,
    signupCook,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
