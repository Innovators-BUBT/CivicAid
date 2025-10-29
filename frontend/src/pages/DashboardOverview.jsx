import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
  });

  const fetchStats = async () => {
    try {
      const usersRes = await axios.get('http://localhost:5000/api/users/count');
      const complaintsRes = await axios.get('http://localhost:5000/api/complaints/stats');

      setStats({
        totalUsers: usersRes.data.count,
        totalComplaints: complaintsRes.data.total,
        pendingComplaints: complaintsRes.data.pending,
        resolvedComplaints: complaintsRes.data.resolved,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Complaints</h2>
          <p className="text-3xl mt-2">{stats.totalComplaints}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-yellow-600">Pending Complaints</h2>
          <p className="text-3xl mt-2">{stats.pendingComplaints}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-green-600">Resolved Complaints</h2>
          <p className="text-3xl mt-2">{stats.resolvedComplaints}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
