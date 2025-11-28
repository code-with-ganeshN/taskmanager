import React, { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/layout/EmployeeSidebar";
import UserNavbar from "../../components/layout/UserNavbar";
import notificationService from "../../services/notificationService";
import NotificationItem from "../../components/notifications/NotificationItem";
import { Bell, Loader } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await notificationService.list();
      setNotifications(res.data.data || res.data || []);
    } catch (err) {
      console.error("fetch notifications error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <EmployeeSidebar />
      <UserNavbar title="Notifications" />
      
      <main className="ml-64 pt-20 p-6 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">Keep track of your task updates and messages</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader size={32} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No notifications yet</p>
                  <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.map(n => (
                  <NotificationItem key={n._id} notification={n} refresh={load} />
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
