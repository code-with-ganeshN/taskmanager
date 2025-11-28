import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit3, Eye, CheckCircle2, Clock, AlertCircle, Loader, Search, X } from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', category: '', assignedTo: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, eRes] = await Promise.all([
        api.get('/admin/tasks'),
        api.get('/admin/employees')
      ]);
      setTasks(tRes.data.data || tRes.data || []);
      setEmployees(eRes.data.data || eRes.data || []);
    } catch (err) {
      console.error('fetch tasks error', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleAssign = (id) => {
    setNewTask(prev => {
      const assigned = prev.assignedTo.includes(id) ? prev.assignedTo.filter(x => x !== id) : [...prev.assignedTo, id];
      return { ...prev, assignedTo: assigned };
    });
  };

  const create = async () => {
    if (!newTask.title) return alert('Title required');
    try {
      const res = await api.post('/admin/tasks', {
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        assignedTo: newTask.assignedTo
      });
      const created = res.data.task || res.data;
      setTasks(prev => [created, ...prev]);
      setNewTask({ title: '', description: '', category: '', assignedTo: [] });
      setShowAdd(false);
    } catch (err) {
      console.error('Create task error', err);
      alert(err?.response?.data?.message || 'Failed to create task');
    }
  };

  const softDelete = async (id) => {
    if (!window.confirm('Move task to recycle bin?')) return;
    try {
      await api.put(`/admin/tasks/${id}/delete`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('delete error', err);
      alert('Failed to delete');
    }
  };

  const goEdit = (id) => navigate(`/admin/tasks/${id}/edit`);

  const getPriorityBadge = (priority) => {
    if (priority === 'high') return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">High</span>;
    if (priority === 'medium') return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Medium</span>;
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Low</span>;
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 size={16} className="text-green-600" />;
    if (status === 'in-progress') return <Clock size={16} className="text-blue-600" />;
    return <AlertCircle size={16} className="text-gray-400" />;
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Tasks</h1>
            <p className="text-gray-500 mt-1">Create and manage all project tasks</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowAdd(s => !s)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${showAdd ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg'}`}
            >
              <Plus size={18} />
              {showAdd ? 'Close' : 'Add Task'}
            </button>
            <Link to="/admin/tasks/deleted" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">
              Deleted
            </Link>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Create New Task</h3>
          <div className="space-y-4">
            <input 
              value={newTask.title} 
              onChange={e => setNewTask({...newTask, title: e.target.value})} 
              placeholder="Task title" 
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
            />
            <textarea 
              value={newTask.description} 
              onChange={e => setNewTask({...newTask, description: e.target.value})} 
              placeholder="Task description" 
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition h-20" 
            />
            <input 
              value={newTask.category} 
              onChange={e => setNewTask({...newTask, category: e.target.value})} 
              placeholder="Category" 
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
            />

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Assign to Employees</label>
              <div className="flex gap-2 flex-wrap">
                {employees.map(emp => (
                  <button 
                    key={emp._id} 
                    type="button" 
                    onClick={() => toggleAssign(emp._id)} 
                    className={`px-3 py-1 border-2 rounded-full text-sm font-medium transition ${newTask.assignedTo.includes(emp._id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                  >
                    {emp.name}
                  </button>
                ))}
                {employees.length === 0 && <div className="text-sm text-gray-500">No employees available</div>}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={create} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition">Create Task</button>
              <button onClick={() => { setShowAdd(false); setNewTask({ title: '', description: '', category: '', assignedTo: [] }); }} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={32} className="animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {["all", "pending", "in-progress", "completed"].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filterStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks List */}
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map(t => (
                <div key={t._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 cursor-pointer hover:border-blue-400" onClick={() => navigate(`/admin/tasks/${t._id}`)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">{t.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t.description || 'No description'}</p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        {t.category && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{t.category}</span>}
                        {t.priority && <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          t.priority === 'high' ? 'bg-red-100 text-red-700' :
                          t.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>{t.priority}</span>}
                        <div className="flex items-center gap-1">
                          {getStatusIcon(t.status)}
                          <span className="text-xs text-gray-600 font-medium capitalize">{t.status || 'pending'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {t.assignedTo && t.assignedTo.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 font-semibold mb-2">ASSIGNED TO:</p>
                      <div className="flex flex-wrap gap-2">
                        {t.assignedTo.map(emp => (
                          <span key={emp._id} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {emp.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/tasks/${t._id}/edit`); }}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); softDelete(t._id); }}
                        className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/tasks/${t._id}`); }}
                      className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition text-sm font-medium"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500 text-lg">
                {searchQuery || filterStatus !== "all" ? "No matching tasks found" : "No tasks created yet. Create one to get started!"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
