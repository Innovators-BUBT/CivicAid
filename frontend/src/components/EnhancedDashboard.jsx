import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import EnhancedLoading from './EnhancedLoading';

const EnhancedDashboard = ({ user, complaints = [], tasks = [] }) => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    calculateStats();
    generateRecentActivity();
    setLoading(false);
  }, [complaints, tasks, timeRange]);

  const calculateStats = () => {
    const filteredComplaints = filterByTimeRange(complaints);
    const filteredTasks = filterByTimeRange(tasks);

    setStats({
      totalComplaints: filteredComplaints.length,
      pendingComplaints: filteredComplaints.filter(c => c.status === 'Pending').length,
      resolvedComplaints: filteredComplaints.filter(c => c.status === 'Resolved').length,
      totalTasks: filteredTasks.length,
      completedTasks: filteredTasks.filter(t => t.status === 'Completed').length,
      pendingTasks: filteredTasks.filter(t => t.status === 'Pending').length
    });
  };

  const filterByTimeRange = (items) => {
    const now = new Date();
    const timeRanges = {
      day: 1,
      week: 7,
      month: 30,
      year: 365
    };
    
    const days = timeRanges[timeRange] || 7;
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return items.filter(item => new Date(item.createdAt) >= cutoffDate);
  };

  const generateRecentActivity = () => {
    const allItems = [
      ...complaints.map(c => ({ ...c, type: 'complaint' })),
      ...tasks.map(t => ({ ...t, type: 'task' }))
    ];
    
    const sorted = allItems
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    setRecentActivity(sorted);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <EnhancedLoading message="Loading dashboard..." size="large" />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-purple-100">
          Here's what's happening in your community today.
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Complaints */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last {timeRange}</span>
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {stats.totalComplaints > 0 
                ? Math.round((stats.pendingComplaints / stats.totalComplaints) * 100)
                : 0}% of total
            </span>
          </div>
        </div>

        {/* Resolved Complaints */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolvedComplaints}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">
              {stats.totalComplaints > 0 
                ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
                : 0}% resolution rate
            </span>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {stats.completedTasks} completed
            </span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">
              {stats.totalTasks > 0 
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                : 0}% completion rate
            </span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-orange-600">
              {stats.totalTasks > 0 
                ? Math.round((stats.pendingTasks / stats.totalTasks) * 100)
                : 0}% pending
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    item.type === 'complaint' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {item.type === 'complaint' ? (
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Users className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.title}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.priority && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
