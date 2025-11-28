import api from './api';

export default {
  // Admin tasks
  getAll: (params) => api.get('/admin/tasks', { params }),
  getDeleted: () => api.get('/admin/tasks/deleted'),
  create: (payload) => api.post('/admin/tasks', payload),
  update: (id, payload) => api.put(`/admin/tasks/${id}`, payload),
  softDelete: (id) => api.put(`/admin/tasks/${id}/delete`),
  restore: (id) => api.put(`/admin/tasks/${id}/restore`),
  getById: (id) => api.get(`/admin/tasks/${id}`),
  
  // User/Employee tasks
  listUserTasks: () => api.get("/user/tasks"),
  getTask: (id) => api.get(`/tasks/${id}`),
  addComment: (id, text) => api.post(`/tasks/${id}/comment`, { text }),
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
};
