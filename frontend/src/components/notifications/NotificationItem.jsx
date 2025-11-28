import React from "react";
import notificationService from "../../services/notificationService";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";

export default function NotificationItem({ notification, refresh }) {
  const markRead = async () => {
    if (!notification.read) {
      await notificationService.markRead(notification._id);
      refresh();
    }
  };

  const deleteNotification = async (e) => {
    e.stopPropagation();
    try {
      await notificationService.delete(notification._id);
      refresh();
    } catch (err) {
      console.error("delete notification error", err);
    }
  };

  return (
    <div
      className={`p-5 rounded-xl transition border-l-4 cursor-pointer group ${
        notification.read 
          ? "bg-white border-l-gray-300 shadow-md hover:shadow-lg" 
          : "bg-gradient-to-r from-blue-50 to-blue-50 border-l-blue-600 shadow-lg hover:shadow-xl"
      }`}
      onClick={markRead}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          notification.read 
            ? 'bg-gray-100 text-gray-600' 
            : 'bg-blue-100 text-blue-600'
        }`}>
          {notification.read ? <CheckCircle2 size={20} /> : <Bell size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={deleteNotification}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
          title="Delete notification"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
