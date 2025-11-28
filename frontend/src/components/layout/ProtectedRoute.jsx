import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../../utils/storage";

/**
 * Usage:
 * <ProtectedRoute allowedRoles={['admin']}> <AdminPage/> </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
  const token = getToken();
  const user = getUser();

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
