import api from './api';

const damageService = {
  // Get all damage reports with pagination
  getDamageReports: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await api.get(`/DamageReports?${queryParams.toString()}`);
    return response.data;
  },

  // Get a single damage report by ID
  getDamageReportById: async (id) => {
    const response = await api.get(`/DamageReports/${id}`);
    return response.data;
  },

  // Create a new damage report
  createDamageReport: async (damageData) => {
    const response = await api.post('/DamageReports', damageData);
    return response.data;
  },

  // Resolve a damage report (Admin only)
  resolveDamage: async (id, resolutionData) => {
    const response = await api.post(`/DamageReports/${id}/resolve`, resolutionData);
    return response.data;
  },

  // Upload damage images
  uploadDamageImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post('/Upload/damage-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a damage report (Admin only)
  deleteDamageReport: async (id) => {
    const response = await api.delete(`/DamageReports/${id}`);
    return response.data;
  }
};

export default damageService;