import React from 'react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/complaints"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow text-center"
          >
            View Complaints
          </Link>

          <Link
            to="/admin/dashboard"
            className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow text-center"
          >
            Admin Dashboard
          </Link>

          {/* Optional Future Section
          <Link
            to="/admin/users"
            className="block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow text-center"
          >
            Manage Users
          </Link>
          */}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
