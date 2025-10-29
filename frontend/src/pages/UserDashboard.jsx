import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import '../minimalist-modern.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);

      // Fetch user's complaint statistics
      const complaintsResponse = await axios.get('/api/complaints/my-complaints?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (complaintsResponse.data.success) {
        const complaints = complaintsResponse.data.data;
        
        // Calculate statistics
        const total = complaints.length;
        const pending = complaints.filter(c => c.status === 'Pending').length;
        const inProgress = complaints.filter(c => ['Under Review', 'Assigned', 'In Progress'].includes(c.status)).length;
        const resolved = complaints.filter(c => c.status === 'Resolved').length;
        const urgent = complaints.filter(c => c.priority === 'Urgent').length;

        setStats({ total, pending, inProgress, resolved, urgent });
        
        // Get recent complaints
        setRecentComplaints(complaints.slice(0, 5));
      }
    } catch (error) {
      showToast('Error fetching dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Assigned': 'bg-purple-100 text-purple-800',
      'In Progress': 'bg-orange-100 text-orange-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'text-green-600',
      'Medium': 'text-yellow-600',
      'High': 'text-orange-600',
      'Urgent': 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-minimal">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="container-minimal">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="heading-minimal text-2xl mb-2">
            Welcome back, {user.name || 'Citizen'}!
          </h1>
          <div className="text-icon text-icon-primary mb-4">DASHBOARD</div>
          <p className="body-minimal text-sm text-muted">
            Track your complaints and stay updated on community issues
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid-minimal grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="minimal-card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded">
                <span className="text-icon text-icon-primary text-sm">TOTAL</span>
              </div>
              <div className="ml-3">
                <p className="caption-minimal text-xs text-muted">Total Complaints</p>
                <p className="heading-minimal text-lg">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="minimal-card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded">
                <span className="text-icon text-warning text-sm">PENDING</span>
              </div>
              <div className="ml-3">
                <p className="caption-minimal text-xs text-muted">Pending</p>
                <p className="heading-minimal text-lg">{stats.pending || 0}</p>
              </div>
            </div>
          </div>

          <div className="minimal-card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-accent-100 rounded">
                <span className="text-icon text-accent text-sm">PROGRESS</span>
              </div>
              <div className="ml-3">
                <p className="caption-minimal text-xs text-muted">In Progress</p>
                <p className="heading-minimal text-lg">{stats.inProgress || 0}</p>
              </div>
            </div>
          </div>

          <div className="minimal-card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded">
                <span className="text-icon text-success text-sm">RESOLVED</span>
              </div>
              <div className="ml-3">
                <p className="caption-minimal text-xs text-muted">Resolved</p>
                <p className="heading-minimal text-lg">{stats.resolved || 0}</p>
              </div>
            </div>
          </div>

          <div className="minimal-card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-error-100 rounded">
                <span className="text-icon text-error text-sm">URGENT</span>
              </div>
              <div className="ml-3">
                <p className="caption-minimal text-xs text-muted">Urgent</p>
                <p className="heading-minimal text-lg">{stats.urgent || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/complaint/new')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Submit New Complaint</h3>
                <p className="text-gray-600">Report an issue in your community</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/complaints')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">View All Complaints</h3>
                <p className="text-gray-600">Check status and updates</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/complaints?status=Pending')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pending Issues</h3>
                <p className="text-gray-600">Review pending complaints</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Complaints</h3>
              <button
                onClick={() => navigate('/complaints')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          
          {recentComplaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
              <p className="text-gray-600 mb-6">Start by submitting your first complaint</p>
              <button
                onClick={() => navigate('/complaint/new')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Complaint
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complaint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {complaint.photos && complaint.photos.length > 0 && (
                            <div className="flex-shrink-0 h-12 w-12 mr-4">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={complaint.photos[0].url}
                                alt="Complaint photo"
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                            <div className="text-sm text-gray-500">{complaint.category}</div>
                            <div className="text-sm text-gray-500">{complaint.location}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(complaint.createdAt)}
                      </td>
                      
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/complaints/${complaint._id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {complaint.canEdit && complaint.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => navigate(`/complaints/${complaint._id}/edit`)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">📞 Contact Support</h4>
              <p className="text-gray-600">+880 1798 585 919</p>
              <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">📧 Email Support</h4>
              <p className="text-gray-600">lognohassan@gmail.com</p>
              <p className="text-sm text-gray-500">We respond within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
