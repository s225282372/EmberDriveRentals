import api from './api';

const maintenanceService = {
  // Get all maintenance records with pagination
  getMaintenanceRecords: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.carId) queryParams.append('carId', params.carId);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const queryString = queryParams.toString();
    const url = queryString ? `/Maintenance?${queryString}` : '/Maintenance';
    const response = await api.get(url);
    return response.data;
  },

  // Get a single maintenance record by ID
  getMaintenanceById: async (id) => {
    const response = await api.get(`/Maintenance/${id}`);
    return response.data;
  },

  // Get maintenance records for a specific car
  getCarMaintenance: async (carId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const queryString = queryParams.toString();
    const url = queryString ? `/Maintenance/car/${carId}?${queryString}` : `/Maintenance/car/${carId}`;
    const response = await api.get(url);
    return response.data;
  },

  // Create a new maintenance record (Admin only)
  createMaintenance: async (maintenanceData) => {
    const response = await api.post('/Maintenance', maintenanceData);
    return response.data;
  },

  // Update a maintenance record (Admin only)
  updateMaintenance: async (id, maintenanceData) => {
    const response = await api.put(`/Maintenance/${id}`, maintenanceData);
    return response.data;
  },

  // Mark maintenance as completed (Admin only)
  completeMaintenance: async (id) => {
    const response = await api.post(`/Maintenance/${id}/complete`);
    return response.data;
  },

  // Get maintenance alerts (Admin only)
  getMaintenanceAlerts: async () => {
    const response = await api.get('/Maintenance/alerts');
    return response.data;
  },

  // Delete a maintenance record (Admin only)
  deleteMaintenance: async (id) => {
    const response = await api.delete(`/Maintenance/${id}`);
    return response.data;
  }
};

export default maintenanceService;