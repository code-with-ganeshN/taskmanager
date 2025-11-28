import api from './api';

export default {
  getEmployees: (params) => api.get('/admin/employees', { params }),
  getDeleted: () => api.get('/admin/employees/deleted'),
  update: (id, payload) => api.put(`/admin/employees/${id}`, payload),
  softDelete: (id) => api.put(`/admin/employees/${id}/delete`),
  restore: (id) => api.put(`/admin/employees/${id}/restore`),
};
