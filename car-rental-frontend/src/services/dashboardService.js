import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getStatistics: async () => {
    const response = await api.get('/Dashboard/statistics');
    return response.data;
  },

  // Get revenue chart data
  getRevenueChart: async () => {
    const response = await api.get('/Dashboard/revenue-chart');
    return response.data;
  },

  // Get bookings chart data
  getBookingsChart: async () => {
    const response = await api.get('/Dashboard/bookings-chart');
    return response.data;
  },

  // Get top cars
  getTopCars: async (limit = 5) => {
    const response = await api.get(`/Dashboard/top-cars?limit=${limit}`);
    return response.data;
  },

  // Get alerts
  getAlerts: async () => {
    const response = await api.get('/Dashboard/alerts');
    return response.data;
  },

  // Update booking status (admin)
  updateBookingStatus: async (bookingId, status) => {
    const response = await api.patch(`/Bookings/${bookingId}/status`, { status });
    return response.data;
  },

  // Get all bookings (admin)
  getAllBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.carId) queryParams.append('carId', params.carId);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/Bookings?${queryParams.toString()}`);
    return response.data;
  },
};

export default dashboardService;
