import api from './api';

export const authService = {
  // Get CSRF token
  getCsrfToken: async () => {
    try {
      const response = await api.get('/auth/csrf/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Customer Signup
  signupCustomer: async (data) => {
    try {
      const response = await api.post('/auth/signup/customer/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cook Signup
  signupCook: async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await api.post('/auth/signup/cook/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      const response = await api.put('/auth/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
