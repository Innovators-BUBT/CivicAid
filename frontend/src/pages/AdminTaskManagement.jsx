import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTaskManagement = () => {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [availableAssignees, setAvailableAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    adminNotes: '',
    estimatedResolutionTime: ''
  });
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  });
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingRes, assignedRes, assigneesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/complaints/admin/pending', { headers }),
        axios.get('http://localhost:5000/api/complaints/admin/assigned', { headers }),
        axios.get('http://localhost:5000/api/complaints/admin/assignees', { headers })
      ]);

      setPendingComplaints(pendingRes.data);
      setAssignedComplaints(assignedRes.data);
      setAvailableAssignees(assigneesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignComplaint = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/complaints/admin/${selectedComplaint._id}/assign`,
        {
          assignedToId: selectedAssignee._id,
          adminNotes: assignmentForm.adminNotes,
          estimatedResolutionTime: parseInt(assignmentForm.estimatedResolutionTime)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAssignmentModal(false);
      setSelectedComplaint(null);
      setSelectedAssignee(null);
      setAssignmentForm({ adminNotes: '', estimatedResolutionTime: '' });
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign complaint');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/complaints/admin/${selectedComplaint._id}/status`,
        {
          status: statusForm.status,
          adminNotes: statusForm.adminNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowStatusModal(false);
      setSelectedComplaint(null);
      setStatusForm({ status: '', adminNotes: '' });
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Flood': '🌊',
      'Earthquake': '🌋',
      'Landslide': '🏔️',
      'Drought': '☀️',
      'Storm': '⛈️',
      'Wildfire': '🔥',
      'Road': '🛣️',
      'Water': '💧',
      'Electricity': '⚡',
      'Sanitation': '🧹',
      'Education': '📚',
      'Healthcare': '🏥',
      'Environment': '🌱',
      'Traffic Accident': '🚗',
      'Building Collapse': '🏢',
      'Gas Leak': '💨',
      'Fire Incident': '🔥',
      'Medical Emergency': '🚑',
      'Other': '📋'
    };
    return icons[category] || '📋';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Assign tasks to volunteers and NGOs, monitor progress</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in-up">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{pendingComplaints.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{assignedComplaints.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{availableAssignees.filter(a => a.role === 'volunteer').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available NGOs</p>
                <p className="text-2xl font-bold text-gray-900">{availableAssignees.filter(a => a.role === 'ngo').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Tasks ({pendingComplaints.length})
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assigned Tasks ({assignedComplaints.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' ? (
              <div className="space-y-4">
                {pendingComplaints.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks!</h3>
                    <p className="text-gray-600">All tasks have been assigned or resolved.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pendingComplaints.map((complaint) => (
                      <div key={complaint._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{getCategoryIcon(complaint.category)}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{complaint.title}</h3>
                              <p className="text-sm text-gray-600">{complaint.category}</p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span className="flex items-center">
                            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {complaint.location}
                          </span>
                          <span className="flex items-center">
                            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {complaint.user.name}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setShowAssignmentModal(true);
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                          >
                            Assign Task
                          </button>
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setShowStatusModal(true);
                            }}
                            className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                          >
                            Update Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {assignedComplaints.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned tasks</h3>
                    <p className="text-gray-600">Tasks will appear here once they are assigned.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {assignedComplaints.map((complaint) => (
                      <div key={complaint._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{getCategoryIcon(complaint.category)}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{complaint.title}</h3>
                              <p className="text-sm text-gray-600">{complaint.category}</p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

                        <div className="space-y-2 text-xs text-gray-500 mb-3">
                          <div className="flex justify-between">
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {complaint.location}
                            </span>
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              {complaint.user.name}
                            </span>
                          </div>
                          {complaint.assignedTo && (
                            <div className="flex justify-between">
                              <span className="flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                                {complaint.assignedTo.name}
                              </span>
                              <span className="flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {complaint.assignedTo.role}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowStatusModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
                        >
                          Update Status
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Available Assignees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Available Volunteers & NGOs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {availableAssignees.map((assignee) => (
              <div key={assignee._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    assignee.role === 'volunteer' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{assignee.name}</h3>
                    <p className="text-xs text-gray-600 capitalize">{assignee.role}</p>
                  </div>
                </div>

                {assignee.organizationName && (
                  <p className="text-xs text-gray-600 mb-2 flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {assignee.organizationName}
                  </p>
                )}

                {assignee.location && (
                  <p className="text-xs text-gray-600 mb-2 flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {assignee.location}
                  </p>
                )}

                {assignee.skills && assignee.skills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignee.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {assignee.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{assignee.skills.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                {assignee.bio && (
                  <p className="text-xs text-gray-600 line-clamp-2">{assignee.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Assign Task</h3>
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Assignee:</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const assignee = availableAssignees.find(a => a._id === e.target.value);
                    setSelectedAssignee(assignee);
                  }}
                >
                  <option value="">Choose an assignee...</option>
                  {availableAssignees.map((assignee) => (
                    <option key={assignee._id} value={assignee._id}>
                      {assignee.name} ({assignee.role}) - {assignee.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes:</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  value={assignmentForm.adminNotes}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, adminNotes: e.target.value })}
                  placeholder="Add notes for the assignee..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Resolution Time (hours):</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={assignmentForm.estimatedResolutionTime}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, estimatedResolutionTime: e.target.value })}
                  placeholder="24"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignComplaint}
                  disabled={!selectedAssignee}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Update Status</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status:</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                >
                  <option value="">Select status...</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes:</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  value={statusForm.adminNotes}
                  onChange={(e) => setStatusForm({ ...statusForm, adminNotes: e.target.value })}
                  placeholder="Add notes about the status change..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!statusForm.status}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTaskManagement; 