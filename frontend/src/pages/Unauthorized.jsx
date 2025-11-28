import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
        <p className="text-sm text-gray-600 mb-4">You don't have permission to view this page.</p>
        <Link to="/" className="text-blue-600">Go Home</Link>
      </div>
    </div>
  );
}
