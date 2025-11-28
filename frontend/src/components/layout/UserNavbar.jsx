import React from "react";
import LogoutButton from "../ui/LogoutButton";
import { Bell, Settings } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function UserNavbar({ title = "" }) {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed left-64 right-0 top-0 bg-white border-b border-gray-200 p-4 shadow-sm z-40">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button className="relative text-gray-600 hover:text-gray-900 transition">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          </button>

          {/* Settings Icon */}
          <button className="text-gray-600 hover:text-gray-900 transition">
            <Settings size={20} />
          </button>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
