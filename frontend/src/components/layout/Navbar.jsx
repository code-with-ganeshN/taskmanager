import React, { useContext } from "react";
import LogoutButton from "../ui/LogoutButton";
import { AuthContext } from "../../context/AuthContext";
import { Bell, Settings } from "lucide-react";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center fixed top-0 left-0 pl-72 z-40">
      {/* Left side - Title */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TaskFlow</h2>
        <p className="text-xs text-gray-500">Admin Dashboard</p>
      </div>

      {/* Right side - Notifications, Settings, User Info, Logout */}
      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Settings Icon */}
        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
          <Settings size={20} />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </nav>
  );
}
