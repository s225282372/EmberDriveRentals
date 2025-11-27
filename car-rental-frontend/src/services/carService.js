import api from './api';

const carService = {
  // Get all cars with filters and pagination
  getCars: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.make) queryParams.append('make', params.make);
    if (params.model) queryParams.append('model', params.model);
    if (params.year) queryParams.append('year', params.year);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/Cars?${queryParams.toString()}`);
    return response.data;
  },

  // Get single car by ID
  getCarById: async (id) => {
    const response = await api.get(`/Cars/${id}`);
    return response.data;
  },

  // Check car availability
  checkAvailability: async (id, startDate, endDate) => {
    const response = await api.get(
      `/Cars/${id}/availability?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Admin: Create car
  createCar: async (carData) => {
    const response = await api.post('/Cars', carData);
    return response.data;
  },

  // Admin: Update car
  updateCar: async (id, carData) => {
    const response = await api.put(`/Cars/${id}`, carData);
    return response.data;
  },

  // Admin: Delete car
  deleteCar: async (id) => {
    const response = await api.delete(`/Cars/${id}`);
    return response.data;
  },
};

export default carService;

