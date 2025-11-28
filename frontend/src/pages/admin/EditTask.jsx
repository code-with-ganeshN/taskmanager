import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Navbar from '../../components/layout/Navbar';
import { Save, X, Loader, History, AlertCircle } from 'lucide-react';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const [tRes, eRes] = await Promise.all([
        api.get(`/admin/tasks/${id}`),
        api.get('/admin/employees')
      ]);
      setTask(tRes.data.task || tRes.data);
      setEmployees(eRes.data.data || eRes.data || []);
    } catch (err) {
      console.error('fetch task error', err);
      alert('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setTask(prev => ({ ...prev, [field]: e.target.value }));
  };

  const toggleAssign = (empId) => {
    setTask(prev => {
      const assigned = (prev.assignedTo || []).map(a => a._id || a);
      const next = assigned.includes(empId) ? assigned.filter(x => x !== empId) : [...assigned, empId];
      return { ...prev, assignedTo: next };
    });
  };

  const save = async () => {
    if (!task.title) return alert('Title required');
    setSaving(true);
    try {
      await api.put(`/admin/tasks/${id}`, {
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline,
        assignedTo: task.assignedTo
      });
      alert('Task updated successfully');
      navigate('/admin/tasks');
    } catch (err) {
      console.error('save error', err);
      alert(err?.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loader size={40} className="animate-spin text-blue-600" />
    </div>
  );

  if (!task) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={40} className="text-red-600 mx-auto mb-3" />
        <p className="text-gray-700 font-semibold">Task not found</p>
      </div>
    </div>
  );

  const assignedIds = (task.assignedTo || []).map(a => a._id || a);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
            <p className="text-gray-500 mt-1">Update task details and assignments</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-gray-100">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Task Title</label>
              <input 
                value={task.title || ''} 
                onChange={handleChange('title')} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                placeholder="Enter task title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
              <textarea 
                value={task.description || ''} 
                onChange={handleChange('description')} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                rows={4}
                placeholder="Enter task description"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                <input 
                  value={task.category || ''} 
                  onChange={handleChange('category')} 
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  placeholder="e.g., Development"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Priority</label>
                <select 
                  value={task.priority || 'medium'} 
                  onChange={handleChange('priority')} 
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Status & Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Status</label>
                <select 
                  value={task.status || 'pending'} 
                  onChange={handleChange('status')} 
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Deadline</label>
                <input 
                  type="date" 
                  value={task.deadline ? task.deadline.split('T')[0] : ''} 
                  onChange={handleChange('deadline')} 
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Assign to Employees */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Assign to Employees</label>
              <div className="flex gap-2 flex-wrap p-4 bg-gray-50 rounded-lg border border-gray-200">
                {employees.length === 0 ? (
                  <div className="text-gray-500 text-sm">No employees available</div>
                ) : (
                  employees.map(emp => (
                    <button 
                      key={emp._id} 
                      type="button" 
                      onClick={() => toggleAssign(emp._id)} 
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition border-2 ${
                        assignedIds.includes(emp._id) 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {emp.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* History */}
            {(task.history || []).length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <History size={16} />
                  Update History
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto space-y-3">
                  {task.history.map((h, i) => (
                    <div key={i} className="pb-3 border-b border-gray-200 last:border-0">
                      <div className="text-xs text-gray-500 font-semibold">{new Date(h.updatedAt).toLocaleString()}</div>
                      <div className="text-sm text-gray-700 mt-1">{h.comment || `Status changed to: ${h.status}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={save} 
                disabled={saving} 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={() => navigate('/admin/tasks')} 
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
