// src/pages/ComplaintsList.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import EnhancedSearchBar from '../components/EnhancedSearchBar';
import DataVisualization from '../components/DataVisualization';
import axios from 'axios';
import '../minimalist-modern.css';

const ComplaintsList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
    'Assigned': 'bg-purple-100 text-purple-800 border-purple-200',
    'In Progress': 'bg-orange-100 text-orange-800 border-orange-200',
    'Resolved': 'bg-green-100 text-green-800 border-green-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    'Low': 'text-green-600 bg-green-50 border-green-200',
    'Medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'High': 'text-orange-600 bg-orange-50 border-orange-200',
    'Urgent': 'text-red-600 bg-red-50 border-red-200'
  };

  const categories = [
    'Natural Disasters', 'Local Issues', 'Accidents', 'Other'
  ];

  const statuses = [
    'Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Cancelled'
  ];

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, [currentPage, filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `/api/complaints/my-complaints?page=${currentPage}&limit=10`;
      
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.category) url += `&category=${filters.category}`;
      if (filters.search) url += `&q=${filters.search}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setComplaints(response.data.data);
        setTotalPages(response.data.pagination.total);
      }
    } catch (error) {
      showToast('Error fetching complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/complaints/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (query, searchFilters) => {
    setFilters(prev => ({ 
      ...prev, 
      search: query,
      status: searchFilters.status || '',
      category: searchFilters.category || ''
    }));
    setCurrentPage(1);
  };

  const handleEdit = (complaint) => {
    navigate(`/complaint/edit/${complaint._id}`);
  };

  const handleDelete = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showToast('Complaint deleted successfully', 'success');
        fetchComplaints();
        fetchStats();
      }
    } catch (error) {
      showToast('Error deleting complaint', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'PENDING',
      'Under Review': 'REVIEW',
      'Assigned': 'ASSIGNED',
      'In Progress': 'PROGRESS',
      'Resolved': 'RESOLVED',
      'Cancelled': 'CANCELLED'
    };
    return icons[status] || 'UNKNOWN';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'Low': 'LOW',
      'Medium': 'MED',
      'High': 'HIGH',
      'Urgent': 'URGENT'
    };
    return icons[priority] || 'UNKNOWN';
  };

  // Chart data for visualization
  const chartData = [
    { label: 'Pending', value: stats.pending },
    { label: 'In Progress', value: stats.inProgress },
    { label: 'Resolved', value: stats.resolved }
  ];

  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen bg-primary-50 p-8">
        <div className="container-minimal">
          <div className="text-center">
            <h1 className="heading-minimal text-3xl mb-8">My Complaints</h1>
            <div className="loading-minimal">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <span>Loading your complaints...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 p-8">
      <div className="container-minimal">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="heading-minimal text-3xl mb-4">My Complaints</h1>
          <div className="text-icon text-icon-primary mb-4">COMPLAINTS</div>
          <p className="body-minimal text-sm text-muted">Track and manage your community issues</p>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8 animate-fade-in">
          <div className="grid-minimal grid-cols-1 md:grid-cols-4 gap-4">
            <div className="minimal-card p-4 text-center">
              <div className="text-icon text-icon-primary text-sm mb-2">TOTAL</div>
              <h3 className="subheading-minimal text-sm mb-2">Total</h3>
              <div className="heading-minimal text-2xl">{stats.total}</div>
            </div>
            <div className="minimal-card p-4 text-center">
              <div className="text-icon text-warning text-sm mb-2">PENDING</div>
              <h3 className="subheading-minimal text-sm mb-2">Pending</h3>
              <div className="heading-minimal text-2xl text-warning">{stats.pending}</div>
            </div>
            <div className="minimal-card p-4 text-center">
              <div className="text-icon text-accent text-sm mb-2">PROGRESS</div>
              <h3 className="subheading-minimal text-sm mb-2">In Progress</h3>
              <div className="heading-minimal text-2xl text-accent">{stats.inProgress}</div>
            </div>
            <div className="minimal-card p-4 text-center">
              <div className="text-icon text-success text-sm mb-2">RESOLVED</div>
              <h3 className="subheading-minimal text-sm mb-2">Resolved</h3>
              <div className="heading-minimal text-2xl text-success">{stats.resolved}</div>
            </div>
          </div>
        </div>

        {/* Data Visualization */}
        <div className="mb-8 animate-fade-in">
          <div className="minimal-card p-6">
            <h3 className="subheading-minimal text-lg mb-4 text-center">Complaint Status Overview</h3>
            <DataVisualization
              type="chart"
              data={chartData}
              config={{ chartType: 'pie', height: 200 }}
            />
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-8 animate-fade-in">
          <div className="minimal-card p-6">
            <EnhancedSearchBar
              placeholder="Search complaints by title, description, or location..."
              onSearch={handleSearch}
              suggestions={[
                'Street light repair',
                'Road maintenance',
                'Water supply issues',
                'Garbage collection',
                'Public safety concerns'
              ]}
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  options: statuses.map(status => ({ value: status, label: status }))
                },
                {
                  key: 'category',
                  label: 'Category',
                  options: categories.map(cat => ({ value: cat, label: cat }))
                }
              ]}
              debounceMs={500}
              className="mb-4"
            />
          </div>
        </div>

        {/* Complaints List */}
        <div className="animate-fade-in">
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-minimal">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <span>Loading complaints...</span>
              </div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-primary-100 rounded flex items-center justify-center mx-auto mb-4">
                <span className="text-icon text-icon-primary text-lg">LIST</span>
              </div>
              <h3 className="subheading-minimal text-lg mb-2">No complaints found</h3>
              <p className="body-minimal text-sm text-muted mb-6">Start by reporting a community issue</p>
              <button
                onClick={() => navigate('/complaint/new')}
                className="minimal-btn minimal-btn-primary"
              >
                <span className="text-icon text-icon-primary">REPORT</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="minimal-card p-6 hover:shadow-minimal-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="subheading-minimal text-lg line-clamp-2">
                          {complaint.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded text-xs font-mono border ${statusColors[complaint.status]}`}>
                            {getStatusIcon(complaint.status)} {complaint.status}
                          </span>
                          {complaint.priority && (
                            <span className={`px-2 py-1 rounded text-xs font-mono border ${priorityColors[complaint.priority]}`}>
                              {getPriorityIcon(complaint.priority)} {complaint.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="body-minimal text-sm text-muted mb-3 line-clamp-2">{complaint.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 caption-minimal text-xs text-muted">
                        <span className="flex items-center">
                          <span className="text-icon text-xs mr-1">LOC</span> {complaint.location || 'Location not specified'}
                        </span>
                        <span className="flex items-center">
                          <span className="text-icon text-xs mr-1">CAT</span> {complaint.category || 'Uncategorized'}
                        </span>
                        <span className="flex items-center">
                          <span className="text-icon text-xs mr-1">DATE</span> {formatDate(complaint.createdAt)}
                        </span>
                        {complaint.assignedTo && (
                          <span className="flex items-center">
                            <span className="text-icon text-xs mr-1">USER</span> Assigned to: {complaint.assignedTo.name || complaint.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                      <button
                        onClick={() => handleEdit(complaint)}
                        className="minimal-btn minimal-btn-secondary text-xs px-3 py-2"
                      >
                        <span className="text-icon text-xs">EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDelete(complaint._id)}
                        className="minimal-btn minimal-btn-danger text-xs px-3 py-2"
                      >
                        <span className="text-icon text-xs">DEL</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center animate-fade-in">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="minimal-btn minimal-btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-icon text-xs">PREV</span>
              </button>
              
              <span className="px-4 py-2 body-minimal text-sm text-muted">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="minimal-btn minimal-btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-icon text-xs">NEXT</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center animate-fade-in">
          <div className="minimal-card p-8">
            <h3 className="heading-minimal text-xl mb-4">Need Help?</h3>
            <div className="text-icon text-icon-primary mb-4">SUPPORT</div>
            <p className="body-minimal text-sm text-muted mb-6">Our team is here to support you with any questions about your complaints</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/complaint/new')}
                className="minimal-btn minimal-btn-primary"
              >
                <span className="text-icon text-icon-primary">REPORT</span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="minimal-btn minimal-btn-secondary"
              >
                <span className="text-icon">CONTACT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsList;
