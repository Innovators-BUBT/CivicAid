// src/pages/ViewComplaints.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

const ViewComplaints = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    area: '',
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);
  const [selectedComplaints, setSelectedComplaints] = useState([]);

  const statuses = ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Cancelled'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const categories = ['Natural Disasters', 'Local Issues', 'Accidents', 'Other'];
  const areas = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];

  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, [currentPage, filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `/api/complaints/admin/all?page=${currentPage}&limit=20`;
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url += `&${key}=${filters[key]}`;
        }
      });

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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (complaintId, newStatus, adminNotes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/complaints/admin/${complaintId}/status`, {
        status: newStatus,
        adminNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showToast('Status updated successfully', 'success');
        fetchComplaints();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating status';
      showToast(message, 'error');
    }
  };

  const handleAssignment = async (complaintId, assignedTo, notes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/complaints/admin/${complaintId}/assign`, {
        assignedTo,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showToast('Complaint assigned successfully', 'success');
        fetchComplaints();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error assigning complaint';
      showToast(message, 'error');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedComplaints.length === 0) {
      showToast('Please select complaints first', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      for (const complaintId of selectedComplaints) {
        if (action === 'delete') {
          await axios.delete(`/api/complaints/${complaintId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (action === 'status') {
          const newStatus = prompt('Enter new status (Pending, Under Review, Assigned, In Progress, Resolved, Cancelled):');
          if (newStatus && statuses.includes(newStatus)) {
            await handleStatusUpdate(complaintId, newStatus);
          }
        }
      }

      showToast(`Bulk ${action} completed`, 'success');
      setSelectedComplaints([]);
      fetchComplaints();
    } catch (error) {
      showToast(`Error during bulk ${action}`, 'error');
    }
  };

  const toggleComplaintSelection = (complaintId) => {
    setSelectedComplaints(prev => 
      prev.includes(complaintId) 
        ? prev.filter(id => id !== complaintId)
        : [...prev, complaintId]
    );
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

  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Complaints</h1>
              <p className="text-gray-600 mt-2">View and manage all citizen complaints</p>
            </div>
            <div className="flex space-x-3">
              {selectedComplaints.length > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction('status')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Status ({selectedComplaints.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete ({selectedComplaints.length})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Areas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Assignees</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedComplaints(complaints.map(c => c._id));
                            } else {
                              setSelectedComplaints([]);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
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
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {complaints.map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedComplaints.includes(complaint._id)}
                            onChange={() => toggleComplaintSelection(complaint._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        
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
                          <select
                            value={complaint.status}
                            onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${getStatusColor(complaint.status)}`}
                          >
                            {statuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{complaint.user?.name}</div>
                          <div className="text-sm text-gray-500">{complaint.user?.email}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <select
                            value={complaint.assignedTo?._id || ''}
                            onChange={(e) => handleAssignment(complaint._id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="">Unassigned</option>
                            {users.filter(u => ['admin', 'volunteer'].includes(u.role)).map(user => (
                              <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                          </select>
                        </td>
                        
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/admin/complaints/${complaint._id}/edit`)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this complaint?')) {
                                  handleStatusUpdate(complaint._id, 'Cancelled');
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewComplaints;
