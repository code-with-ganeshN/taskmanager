import React, { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/layout/EmployeeSidebar";
import UserNavbar from "../../components/layout/UserNavbar";
import api from "../../services/api";
import TaskCard from "../../components/tasks/TaskCard";
import { Loader, Filter, CheckCircle2, Clock, AlertCircle, Search, X } from "lucide-react";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      // backend route: GET /user/tasks
      const res = await api.get("/user/tasks");
      setTasks(res.data.data || res.data);
    } catch (err) {
      console.error("fetch my tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyTasks(); }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filter === "all" || task.status === filter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
  };

  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle2 size={16} className="text-green-600" />;
    if (status === "in-progress") return <Clock size={16} className="text-blue-600" />;
    return <AlertCircle size={16} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <UserNavbar title="My Tasks" />
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-500 mt-1">Track and manage your assigned tasks</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
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

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "completed"
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-400"
                }`}
              >
                Completed ({stats.completed})
              </button>
              <button
                onClick={() => setFilter("in-progress")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "in-progress"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400"
                }`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "pending"
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-yellow-400"
                }`}
              >
                Pending ({stats.pending})
              </button>
            </div>
          </div>

          {/* Tasks */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader size={32} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    {filter === "all" ? "No tasks assigned." : `No ${filter} tasks.`}
                  </p>
                </div>
              ) : (
                filteredTasks.map(task => <TaskCard key={task._id} task={task} />)
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
