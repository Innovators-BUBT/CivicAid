import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Filter
} from 'lucide-react';

const AnalyticsDashboard = ({ complaints = [], tasks = [] }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [analytics, setAnalytics] = useState({
    complaintStats: [],
    taskStats: [],
    categoryStats: [],
    areaStats: [],
    priorityStats: [],
    statusTrends: [],
    resolutionTime: []
  });

  useEffect(() => {
    calculateAnalytics();
  }, [complaints, tasks, timeRange]);

  const calculateAnalytics = () => {
    const filteredComplaints = filterByTimeRange(complaints);
    const filteredTasks = filterByTimeRange(tasks);

    setAnalytics({
      complaintStats: getComplaintStats(filteredComplaints),
      taskStats: getTaskStats(filteredTasks),
      categoryStats: getCategoryStats(filteredComplaints),
      areaStats: getAreaStats(filteredComplaints),
      priorityStats: getPriorityStats(filteredComplaints),
      statusTrends: getStatusTrends(filteredComplaints),
      resolutionTime: getResolutionTime(filteredComplaints)
    });
  };

  const filterByTimeRange = (items) => {
    const now = new Date();
    const timeRanges = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    };
    
    const days = timeRanges[timeRange] || 30;
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return items.filter(item => new Date(item.createdAt) >= cutoffDate);
  };

  const getComplaintStats = (complaints) => {
    const statusCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.status] = (acc[complaint.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / complaints.length) * 100) || 0
    }));
  };

  const getTaskStats = (tasks) => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / tasks.length) * 100) || 0
    }));
  };

  const getCategoryStats = (complaints) => {
    const categoryCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const getAreaStats = (complaints) => {
    const areaCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.area] = (acc[complaint.area] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(areaCounts)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getPriorityStats = (complaints) => {
    const priorityCounts = complaints.reduce((acc, complaint) => {
      const priority = complaint.priority || 'Medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count,
      fill: getPriorityColor(priority)
    }));
  };

  const getStatusTrends = (complaints) => {
    const trends = {};
    complaints.forEach(complaint => {
      const date = new Date(complaint.createdAt).toISOString().split('T')[0];
      if (!trends[date]) {
        trends[date] = { date, pending: 0, resolved: 0, inProgress: 0 };
      }
      trends[date][complaint.status.toLowerCase().replace(' ', '')] = 
        (trends[date][complaint.status.toLowerCase().replace(' ', '')] || 0) + 1;
    });

    return Object.values(trends).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getResolutionTime = (complaints) => {
    return complaints
      .filter(c => c.status === 'Resolved' && c.resolvedAt)
      .map(complaint => {
        const created = new Date(complaint.createdAt);
        const resolved = new Date(complaint.resolvedAt);
        const days = Math.ceil((resolved - created) / (1000 * 60 * 60 * 24));
        return {
          category: complaint.category,
          days,
          title: complaint.title.substring(0, 20) + '...'
        };
      })
      .sort((a, b) => b.days - a.days)
      .slice(0, 10);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5a2b', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <button className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {complaints.length > 0 
                  ? Math.round((analytics.complaintStats.find(s => s.status === 'Resolved')?.count || 0) / complaints.length * 100)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+5% improvement</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.resolutionTime.length > 0 
                  ? Math.round(analytics.resolutionTime.reduce((sum, item) => sum + item.days, 0) / analytics.resolutionTime.length)
                  : 0} days
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">-2 days faster</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% increase</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.complaintStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percentage }) => `${status}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.complaintStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categoryStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.statusTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="pending" stackId="1" stroke="#eab308" fill="#eab308" />
              <Area type="monotone" dataKey="inprogress" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
              <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10b981" fill="#10b981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.priorityStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ priority, count }) => `${priority}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.priorityStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Time Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resolution Time Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.resolutionTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="days" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
