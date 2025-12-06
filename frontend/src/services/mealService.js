import api from './api';

export const mealService = {
  // Get all meals
  getMeals: async (params = {}) => {
    try {
      const response = await api.get('/meals/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get meal by ID
  getMeal: async (id) => {
    try {
      const response = await api.get(`/meals/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get meals by cook
  getMyMeals: async () => {
    try {
      const response = await api.get('/meals/my-meals/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create meal
  createMeal: async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      const response = await api.post('/meals/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update meal
  updateMeal: async (id, data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      const response = await api.put(`/meals/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete meal
  deleteMeal: async (id) => {
    try {
      const response = await api.delete(`/meals/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Browse meals with filters (no location)
  browseMeals: async (filters = {}) => {
    try {
      const response = await api.get('/meals/browse/', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get nearby meals based on customer's location
  getNearbyMeals: async (maxDistance = 2) => {
    try {
      const response = await api.get('/meals/nearby/', {
        params: { max_distance: maxDistance },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
