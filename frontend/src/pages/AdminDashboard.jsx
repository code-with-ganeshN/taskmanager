import React from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
