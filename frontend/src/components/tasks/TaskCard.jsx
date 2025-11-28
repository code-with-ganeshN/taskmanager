import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { Calendar, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function TaskCard({ task }) {
  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle2 size={16} className="text-green-600" />;
    if (status === "in-progress") return <Clock size={16} className="text-blue-600" />;
    return <AlertCircle size={16} className="text-gray-400" />;
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "border-l-4 border-red-600";
    if (priority === "medium") return "border-l-4 border-yellow-600";
    return "border-l-4 border-green-600";
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span className="text-red-600 font-semibold">{Math.abs(days)} days overdue</span>;
    if (days === 0) return <span className="text-orange-600 font-semibold">Due today</span>;
    return <span className="text-gray-600">{days} days left</span>;
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition border-l-4 ${getPriorityColor(task.priority || "low")} group`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Link 
            to={`/user/tasks/${task._id}`} 
            className="flex-1 text-lg font-bold text-gray-900 hover:text-blue-600 transition group-hover:translate-x-1 transition-transform"
          >
            {task.title}
          </Link>
          <div className="flex items-center gap-1 text-xs">
            {getStatusIcon(task.status)}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {task.description || "No description provided"}
        </p>

        {/* Category & Status */}
        <div className="flex items-center gap-2 mb-4">
          {task.category && (
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {task.category}
            </span>
          )}
          <StatusBadge status={task.status} />
        </div>

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center gap-2 text-sm mb-4 p-2 bg-gray-50 rounded-lg">
            <Calendar size={14} className="text-gray-500" />
            <div>
              <p className="text-gray-600">
                {new Date(task.deadline).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">{getDaysLeft(task.deadline)}</p>
            </div>
          </div>
        )}

        {/* Assigned To */}
        {task.assignedTo && task.assignedTo.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} className="text-gray-500" />
            <div className="flex -space-x-2">
              {task.assignedTo.slice(0, 3).map(u => (
                <div 
                  key={u._id || u} 
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-semibold border-2 border-white shadow-sm"
                  title={u.name}
                >
                  {(u.name || "U")[0]}
                </div>
              ))}
              {task.assignedTo.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 font-semibold border-2 border-white shadow-sm">
                  +{task.assignedTo.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <Link 
            to={`/user/tasks/${task._id}`}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
