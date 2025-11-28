import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";
import CommentBox from "../../components/tasks/CommentBox";
import StatusBadge from "../../components/tasks/StatusBadge";
import { AuthContext } from "../../context/AuthContext";
import { Loader, Calendar, Flag, Users, MessageCircle, Clock, CheckCircle2, ArrowLeft, History, Edit3, Share2 } from "lucide-react";

export default function AdminTaskDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${id}`);
      const taskData = res.data.task || res.data;
      setTask(taskData);
      setEditData(taskData);
    } catch (err) {
      console.error("fetch task", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (id) fetchTask(); 
  }, [id]);

  const addComment = async (text) => {
    try {
      await api.post(`/tasks/${id}/comment`, { text });
      await fetchTask();
    } catch (err) {
      console.error("add comment", err);
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.put(`/admin/tasks/${id}`, { status });
      await fetchTask();
    } catch (err) {
      console.error("update status", err);
    }
  };

  const updateTask = async () => {
    try {
      await api.put(`/admin/tasks/${id}`, editData);
      await fetchTask();
      setEditMode(false);
    } catch (err) {
      console.error("update task", err);
      alert("Failed to update task");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader size={40} className="animate-spin text-blue-600" />
        </div>
      </main>
    </div>
  );

  if (!task) return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-700 font-semibold text-lg">Task not found</p>
          <button 
            onClick={() => navigate("/admin/tasks")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Tasks
          </button>
        </div>
      </main>
    </div>
  );

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span className="text-red-600 font-semibold">{Math.abs(days)} days overdue</span>;
    if (days === 0) return <span className="text-orange-600 font-semibold">Due today</span>;
    return <span className="text-gray-600">{days} days left</span>;
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "bg-red-100 text-red-800 border-red-200";
    if (priority === "medium") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-100 text-green-800";
    if (status === "in-progress") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <button 
            onClick={() => navigate("/admin/tasks")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Tasks
          </button>

          {/* Task Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {editMode ? (
                  <>
                    <input 
                      type="text"
                      value={editData.title || ""}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="text-3xl font-bold text-gray-900 w-full border-2 border-blue-400 rounded-lg p-2 mb-2"
                    />
                    <textarea 
                      value={editData.description || ""}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="w-full border-2 border-blue-400 rounded-lg p-2 text-gray-600 font-medium"
                      rows="3"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {editMode ? (
                  <>
                    <button 
                      onClick={updateTask}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <StatusBadge status={task.status} />
                  </>
                )}
              </div>
            </div>

            {/* Task Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              {/* Category */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase">Category</label>
                {editMode ? (
                  <input 
                    type="text"
                    value={editData.category || ""}
                    onChange={(e) => setEditData({...editData, category: e.target.value})}
                    className="mt-1 px-3 py-1.5 border-2 border-blue-400 rounded-lg w-full text-sm font-medium"
                  />
                ) : (
                  task.category ? (
                    <div className="mt-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium w-fit">
                      {task.category}
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-400">—</p>
                  )
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1">
                  <Flag size={14} /> Priority
                </label>
                {editMode ? (
                  <select 
                    value={editData.priority || "medium"}
                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                    className="mt-1 px-3 py-1.5 border-2 border-blue-400 rounded-lg w-full text-sm font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  <div className={`mt-1 px-3 py-1.5 rounded-full text-sm font-medium w-fit border ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'Medium'}
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1">
                  <Calendar size={14} /> Deadline
                </label>
                {editMode ? (
                  <input 
                    type="date"
                    value={editData.deadline ? editData.deadline.split('T')[0] : ""}
                    onChange={(e) => setEditData({...editData, deadline: e.target.value})}
                    className="mt-1 px-3 py-1.5 border-2 border-blue-400 rounded-lg w-full text-sm font-medium"
                  />
                ) : (
                  task.deadline ? (
                    <div className="mt-1">
                      <p className="text-sm font-medium text-gray-900">{new Date(task.deadline).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{getDaysLeft(task.deadline)}</p>
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-400 text-sm">No deadline</p>
                  )
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase">Status</label>
                {editMode ? (
                  <select 
                    value={editData.status || "pending"}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                    className="mt-1 px-3 py-1.5 border-2 border-blue-400 rounded-lg w-full text-sm font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm font-medium text-gray-900 capitalize">{task.status}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Assigned To */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  Assigned To
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(task.assignedTo || []).length > 0 ? (
                    (task.assignedTo || []).map(a => (
                      <div key={a._id || a} className="px-4 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                        <p className="font-medium text-blue-900">{a.name || a}</p>
                        {a.title && <p className="text-xs text-blue-700">{a.title}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No one assigned yet</p>
                  )}
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Update Status</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => updateStatus("pending")} 
                    disabled={task.status === "pending"}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => updateStatus("in-progress")} 
                    disabled={task.status === "in-progress"}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Clock size={16} />
                    In Progress
                  </button>
                  <button 
                    onClick={() => updateStatus("completed")} 
                    disabled={task.status === "completed"}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} />
                    Mark Complete
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-600" />
                  Comments ({(task.comments || []).length})
                </h3>

                {/* Comments List */}
                <div className="space-y-4 mb-6">
                  {(task.comments || []).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No comments yet</p>
                  ) : (
                    (task.comments || []).map((c, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{c.createdBy?.name || "Unknown User"}</p>
                            <p className="text-gray-700 mt-2">{c.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 ml-2 whitespace-nowrap">{new Date(c.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Box */}
                <div className="border-t border-gray-200 pt-6">
                  <CommentBox onSubmit={addComment} />
                </div>
              </div>
            </div>

            {/* Task History Sidebar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-fit sticky top-32">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <History size={20} className="text-purple-600" />
                History
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(task.history || []).length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">No history yet</p>
                ) : (
                  [...(task.history || [])].reverse().map((h, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          h.status === 'completed' ? 'bg-green-500' :
                          h.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          {h.status && (
                            <p className="text-sm font-semibold text-gray-900">
                              Status: <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(h.status)}`}>{h.status}</span>
                            </p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">{h.comment}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            By: {h.updatedBy?.name || "System"} on {new Date(h.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
