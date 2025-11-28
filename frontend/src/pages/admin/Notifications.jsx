import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Navbar from '../../components/layout/Navbar';
import { Bell, CheckCircle2, Trash2, Check, Loader } from 'lucide-react';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || res.data || []);
    } catch (err) {
      console.error('fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('mark read error', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('mark all read error', err);
    }
  };

  const deleteAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      await api.delete('/notifications/clear');
      setNotifications([]);
    } catch (err) {
      console.error('delete error', err);
    }
  };

  const deleteOne = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('delete notification error', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type) => {
    return <Bell size={18} className="text-blue-600" />;
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-500 mt-1">Stay updated with system notifications</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={markAllAsRead} 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Check size={18} />
                  Mark All Read
                </button>
                <button 
                  onClick={deleteAll} 
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>
              </div>
            </div>

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <div className="px-4 py-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 font-semibold">
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader size={32} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-md text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No notifications yet</p>
                  <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n._id} 
                    className={`p-5 rounded-xl shadow-md transition border-l-4 ${
                      n.isRead 
                        ? 'bg-white border-l-gray-300' 
                        : 'bg-gradient-to-r from-blue-50 to-blue-50 border-l-blue-600 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        n.isRead 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {n.isRead ? <CheckCircle2 size={20} /> : <Bell size={20} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!n.isRead && (
                          <button 
                            onClick={() => markAsRead(n._id)} 
                            className="px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
                          >
                            Mark Read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteOne(n._id)} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
