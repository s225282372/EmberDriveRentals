import api from './api';

const reviewService = {
  // Get all reviews with pagination
  getReviews: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/Reviews?${queryParams.toString()}`);
    return response.data;
  },

  // Get reviews for a specific car
  getCarReviews: async (carId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/Reviews/car/${carId}?${queryParams.toString()}`);
    return response.data;
  },

  // Get a single review by ID
  getReviewById: async (id) => {
    const response = await api.get(`/Reviews/${id}`);
    return response.data;
  },

  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post('/Reviews', reviewData);
    return response.data;
  },

  // Update review status (Admin only)
  updateReviewStatus: async (id, status) => {
    const response = await api.patch(`/Reviews/${id}/status`, { status });
    return response.data;
  },

  // Bulk approve reviews (Admin only)
  bulkApprove: async (reviewIds) => {
    const response = await api.post('/Reviews/bulk-approve', { reviewIds });
    return response.data;
  },

  // Bulk reject reviews (Admin only)
  bulkReject: async (reviewIds) => {
    const response = await api.post('/Reviews/bulk-reject', { reviewIds });
    return response.data;
  },

  // Delete a review (Admin only)
  deleteReview: async (id) => {
    const response = await api.delete(`/Reviews/${id}`);
    return response.data;
  }
};

export default reviewService;