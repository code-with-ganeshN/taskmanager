import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import notificationService from "../../services/notificationService";
import NotificationsDropdown from "./NotificationsDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.list();
      const list = res.data.data || res.data;
      setNotifications(list);
      setUnread(list.filter(n => !n.read).length);
    } catch (err) {
      console.error("notification load error", err);
    }
  };

  // Polling every 20s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6" />
        {unread > 0 && (
          <span className="absolute -top-2 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <NotificationsDropdown
          notifications={notifications}
          refresh={fetchNotifications}
        />
      )}
    </div>
  );
}
