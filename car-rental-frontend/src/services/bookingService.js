import api from './api';

const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/Bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/Bookings?${queryParams.toString()}`);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/Bookings/${id}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.post(`/Bookings/${id}/cancel`);
    return response.data;
  },

  // Get booking statistics (admin only)
  getStatistics: async () => {
    const response = await api.get('/Bookings/statistics');
    return response.data;
  },
};

export default bookingService;

