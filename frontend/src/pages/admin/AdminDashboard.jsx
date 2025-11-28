import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
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

  const StatCard = ({ label, value, icon }) => (
    <div className="bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl flex items-center gap-4 border">
      <div className="p-3 rounded-xl bg-gray-100 text-gray-700 text-xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
    </div>
  );

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    inprogress: "bg-blue-100 text-blue-700"
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Employees" value={employees.length} icon="👥" />
          <StatCard label="Total Tasks" value={total} icon="📋" />
          <StatCard label="Pending Tasks" value={pending} icon="⏳" />
          <StatCard label="Completed Tasks" value={completed} icon="✅" />
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Tasks</h2>
        <div className="space-y-4">
          {tasks.slice(0, 6).map(t => (
            <div key={t._id} className="bg-white border p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{t.title}</h3>
                  <p className="text-sm text-gray-500">{t.category || 'No category'}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[(t.status || '').toLowerCase()] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t.status || '—'}
                </span>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-sm text-gray-500">No tasks yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
