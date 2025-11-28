import React from "react";
import NotificationItem from "./NotificationItem";
import notificationService from "../../services/notificationService";
import { Link } from "react-router-dom";

export default function NotificationsDropdown({ notifications, refresh }) {
  const markAll = async () => {
    await notificationService.markAllRead();
    refresh();
  };

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded p-3 z-50">
      <div className="flex justify-between mb-2">
        <div className="font-semibold">Notifications</div>
        <button onClick={markAll} className="text-xs text-blue-600">
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-sm text-gray-500">No notifications</div>
        ) : (
          notifications.map(n => (
            <NotificationItem key={n._id} notification={n} refresh={refresh} />
          ))
        )}
      </div>

      <Link to="/user/notifications" className="block text-center text-blue-600 text-sm mt-3">
        View all
      </Link>
    </div>
  );
}
