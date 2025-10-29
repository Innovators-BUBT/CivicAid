import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../minimalist-modern.css';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/complaints');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="minimal-card p-10 text-center max-w-lg w-full mx-4 animate-fade-in">
          <div className="h-16 w-16 bg-success-600 rounded flex items-center justify-center mx-auto mb-6 shadow-minimal">
            <span className="text-white font-bold text-lg font-mono">✓</span>
          </div>
          <h2 className="heading-minimal text-2xl mb-4">Complaint Submitted Successfully!</h2>
          <div className="text-icon text-icon-success mb-6">SUCCESS</div>
          <p className="body-minimal text-sm text-muted mb-6">
            Your complaint has been submitted and will be reviewed by our team. 
            You will be redirected to your complaints page shortly.
          </p>
          <div className="loading-minimal">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container-minimal py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mx-auto h-16 w-16 bg-accent-600 rounded flex items-center justify-center mb-6 shadow-minimal">
            <span className="text-white font-bold text-lg font-mono">+</span>
          </div>
          <h1 className="heading-minimal text-3xl mb-4">
            Submit a Complaint
          </h1>
          <div className="text-icon text-icon-primary mb-4">REPORT ISSUE</div>
          <p className="body-minimal text-sm text-muted max-w-2xl mx-auto">
            Help improve your community by reporting issues that need attention.
          </p>
        </div>
        <div className="minimal-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="minimal-card-subtle border-error-200 p-4 animate-fade-in">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-icon text-error text-sm">ERROR</span>
                  </div>
                  <p className="ml-3 body-minimal text-sm text-error">{error}</p>
                </div>
              </div>
            )}
            <div className="grid-minimal grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="subheading-minimal text-sm">
                  Complaint Title *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-icon text-xs text-muted">TITLE</span>
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="minimal-input pl-12"
                    placeholder="Brief title for your complaint"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="subheading-minimal text-sm">
                  Category *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-icon text-xs text-muted">CAT</span>
                  </div>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="minimal-input pl-12"
                  >
                    <option value="">Select a category</option>
                    <option value="Road">Road Issues</option>
                    <option value="Water">Water Supply</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="subheading-minimal text-sm mb-2 block">
                Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="4"
                className="minimal-input"
                placeholder="Provide detailed information about the issue..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="subheading-minimal text-sm mb-2 block">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="minimal-input"
                placeholder="Street address or area"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="priority" className="subheading-minimal text-sm mb-2 block">
                Priority Level
              </label>
              <div className="grid-minimal grid-cols-2 md:grid-cols-4 gap-3">
                {['Low', 'Medium', 'High', 'Urgent'].map((priority) => (
                  <label key={priority} className="relative">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`cursor-pointer px-3 py-2 rounded border text-center transition-all duration-200 text-xs ${
                      formData.priority === priority
                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                        : 'border-primary-200 bg-white text-primary-700 hover:border-primary-300'
                    }`}>
                      {priority}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="minimal-card-subtle border-accent-200 p-4">
              <div className="flex items-start">
                <div className="h-6 w-6 bg-accent-600 rounded flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white font-bold text-xs font-mono">i</span>
                </div>
                <div>
                  <h3 className="subheading-minimal text-sm mb-2">Tips for better complaint resolution:</h3>
                  <ul className="body-minimal text-xs text-muted space-y-1">
                    <li>• Provide specific location details</li>
                    <li>• Include relevant photos if possible</li>
                    <li>• Be clear and descriptive about the issue</li>
                    <li>• Set appropriate priority level</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/complaints')}
                className="minimal-btn minimal-btn-secondary flex-1"
              >
                <span className="text-icon">CANCEL</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="minimal-btn minimal-btn-primary flex-1"
              >
                {loading ? (
                  <div className="loading-minimal">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <span className="text-icon text-icon-primary">SUBMIT</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
