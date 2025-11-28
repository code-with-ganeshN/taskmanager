import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutGrid,
  Users, 
  CheckSquare, 
  User,
  Bell 
} from "lucide-react";

export default function AdminSidebar() {
  const menu = [
    { title: "Dashboard", icon: <LayoutGrid size={20} />, path: "/admin" },
    { title: "Tasks", icon: <CheckSquare size={20} />, path: "/admin/tasks" },
    { title: "Employees", icon: <Users size={20} />, path: "/admin/employees" },
    { title: "Notifications", icon: <Bell size={20} />, path: "/admin/notifications" },
    { title: "Profile", icon: <User size={20} />, path: "/admin/profile" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl h-screen p-6 fixed left-0 top-0 text-white">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">TaskFlow</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Control</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-700 my-8"></div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</p>
        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition">
          + New Task
        </button>
        <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition">
          + Add Employee
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <p className="text-xs text-gray-500 text-center">© 2025 TaskFlow</p>
      </div>
    </aside>
  );
}
