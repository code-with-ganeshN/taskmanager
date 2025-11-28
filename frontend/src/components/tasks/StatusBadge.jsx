import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function StatusBadge({ status }) {
  const map = {
    pending: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <AlertCircle size={14} />
    },
    "in-progress": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: <Clock size={14} />
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle2 size={14} />
    }
  };
  
  const config = map[status] || map.pending;
  
  return (
    <div className={`${config.bg} ${config.text} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1`}>
      {config.icon}
      <span>{status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'Pending'}</span>
    </div>
  );
}
