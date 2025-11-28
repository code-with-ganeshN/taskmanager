import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";
import notificationService from "../../services/notificationService";
import NotificationItem from "../../components/notifications/NotificationItem";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const res = await notificationService.list();
    setNotifications(res.data.data || res.data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <AdminNavbar title="Notifications" />

      <main className="ml-56 pt-20 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="text-gray-500">No notifications</div>
        ) : (
          notifications.map(n => (
            <NotificationItem key={n._id} notification={n} refresh={load} />
          ))
        )}
      </main>
    </div>
  );
}
