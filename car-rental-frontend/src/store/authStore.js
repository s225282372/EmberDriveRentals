import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/Auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Register
  register: async (fullName, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/Auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: async () => {
    const { refreshToken } = get();
    
    try {
      // Revoke refresh token on server
      if (refreshToken) {
        await api.post('/Auth/revoke', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.clear();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      });
    }
  },

  // Logout from all devices
  logoutAll: async () => {
    try {
      await api.post('/Auth/revoke-all');
      localStorage.clear();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to logout from all devices';
      return { success: false, error: errorMessage };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { accessToken } = get();
    return !!accessToken;
  },

  // Check if user is admin
  isAdmin: () => {
    const { user } = get();
    return user?.role === 'Admin';
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
