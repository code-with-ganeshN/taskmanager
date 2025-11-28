import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutGrid,
  ListTodo, 
  User,
  Bell 
} from "lucide-react";

export default function EmployeeSidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl h-screen p-6 fixed left-0 top-0 text-white">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">TaskFlow</h1>
        <p className="text-xs text-gray-400 mt-1">Employee Portal</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {/* <NavLink 
          to="/user" 
          end
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <LayoutGrid size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink> */}
        
        <NavLink 
          to="/user/tasks" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <ListTodo size={20} />
          <span className="font-medium">My Tasks</span>
        </NavLink>
        
        <NavLink 
          to="/user/notifications" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <Bell size={20} />
          <span className="font-medium">Notifications</span>
        </NavLink>
        
        <NavLink 
          to="/user/profile" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <User size={20} />
          <span className="font-medium">Profile</span>
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-700 my-8"></div>

      {/* Task Stats */}
      <div className="space-y-4 bg-gray-700 p-4 rounded-lg">
        <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Quick Stats</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Assigned</span>
            <span className="font-bold text-blue-400">5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Completed</span>
            <span className="font-bold text-green-400">3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pending</span>
            <span className="font-bold text-yellow-400">2</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <p className="text-xs text-gray-500 text-center">© 2025 TaskFlow</p>
      </div>
    </aside>
  );
}
