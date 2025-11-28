import React from "react";
import EmployeeSidebar from "../../components/layout/EmployeeSidebar";
import UserNavbar from "../../components/layout/UserNavbar";
import { Outlet } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <EmployeeSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <UserNavbar title="Dashboard" />
        <Outlet />
      </main>
    </div>
  );
}
