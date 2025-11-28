import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AdminHome() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eRes, tRes] = await Promise.all([
        api.get('/admin/employees'),
        api.get('/admin/tasks?limit=100')
      ]);
      setEmployees(eRes.data.data || eRes.data || []);
      setTasks(tRes.data.data || tRes.data || []);
    } catch (err) {
      console.error('Admin dashboard fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const total = tasks.length;
  const pending = tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length;
  const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;
  const inProgress = tasks.filter(t => (t.status || '').toLowerCase() === 'in-progress').length;

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white opacity-90 text-sm font-medium">{label}</p>
          <p className="text-white text-4xl font-bold mt-2">{value}</p>
        </div>
        <Icon className="text-white opacity-30" size={48} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="ml-3 text-gray-600">Loading data...</p>
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Users} 
            label="Total Employees" 
            value={employees.length}
            color="from-blue-500 to-blue-600"
          />
          <StatCard 
            icon={CheckCircle2} 
            label="Completed Tasks" 
            value={completed}
            color="from-green-500 to-green-600"
          />
          <StatCard 
            icon={Clock} 
            label="In Progress" 
            value={inProgress}
            color="from-purple-500 to-purple-600"
          />
          <StatCard 
            icon={AlertCircle} 
            label="Pending Tasks" 
            value={pending}
            color="from-orange-500 to-orange-600"
          />
        </div>
      )}

      {/* Recent Tasks Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Recent Tasks</h2>
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No tasks yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Task</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map(task => (
                  <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority || 'low'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {(task.assignedTo || []).slice(0, 3).map((user, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
