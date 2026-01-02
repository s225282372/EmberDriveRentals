import api from './api';

const bookingService = {
  // Get all bookings with filters and pagination
  getBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/Bookings?${queryParams.toString()}`);
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/Bookings/${id}`);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/Bookings/my?${queryParams.toString()}`);
    return response.data;
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/Bookings', bookingData);
    return response.data;
  },

  // Update booking status (Admin only)
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/Bookings/${id}/status`, { status });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.post(`/Bookings/${id}/cancel`);
    return response.data;
  },

  // Get booking statistics (Admin only)
  getStatistics: async () => {
    const response = await api.get('/Bookings/statistics');
    return response.data;
  },
};

export default bookingService;