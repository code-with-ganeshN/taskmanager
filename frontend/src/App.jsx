import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/layout/ProtectedAdminRoute";
import AdminHome from "./pages/admin/AdminHome";
import Tasks from "./pages/admin/Tasks";
import TaskDetails from "./pages/admin/TaskDetails";
import Employees from "./pages/admin/Employees";
import DeletedEmployees from "./pages/admin/DeletedEmployees";
import AdminNotifications from "./pages/admin/Notifications";
import AdminProfile from "./pages/admin/Profile";
import EditTask from "./pages/admin/EditTask";
import Unauthorized from "./pages/Unauthorized";

import UserDashboard from "./pages/employee/UserDashboard";
import MyTasks from "./pages/employee/MyTasks";
import EmployeeTaskDetails from "./pages/employee/TaskDetails";
import EmployeeProfile from "./pages/employee/Profile";
import EmployeeNotifications from "./pages/employee/Notifications";
import ProtectedRoute from "./components/layout/ProtectedRoute"; // generic role-aware route

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="tasks/:id/edit" element={<EditTask />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/deleted" element={<DeletedEmployees />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Employee / User Routes */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute allowedRoles={["employee", "user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      >
        {/* nested routes under /user */}
        <Route index element={<MyTasks />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="tasks/:id" element={<EmployeeTaskDetails />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="notifications" element={<EmployeeNotifications />} />
      </Route>

      <Route path="/" element={<Login />} />
    </Routes>
  );
}
