import api from './api';

const userService = {
  // Get all users with pagination (Admin only)
  getUsers: async (params = {}) => {
    const response = await api.get('/Users', { params });
    return response.data;
  },

  // Get a single user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/Users/${userId}`);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/Users/me');
    return response.data;
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    const response = await api.put(`/Users/${userId}`, userData);
    return response.data;
  },

  // Update user role (Admin only)
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/Users/${userId}/role`, { role });
    return response.data;
  },

  // Delete a user (Admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/Users/${userId}`);
    return response.data;
  },

  // Get user statistics (Admin only)
  getUserStatistics: async (userId) => {
    const response = await api.get(`/Users/${userId}/statistics`);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (userId, params = {}) => {
    const response = await api.get(`/Users/${userId}/bookings`, { params });
    return response.data;
  }
};

export default userService;