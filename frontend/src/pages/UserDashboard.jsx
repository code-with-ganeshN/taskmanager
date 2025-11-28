import React from "react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="bg-white p-4 rounded shadow">Pending tasks: —</div>
          <div className="bg-white p-4 rounded shadow">Due this week: —</div>
        </div>
      </div>
    </div>
  );
}
