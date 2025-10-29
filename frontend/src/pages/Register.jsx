import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import '../minimalist-modern.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    // Admin code validation
    if (formData.role === 'admin' && formData.adminCode !== '01642406871') {
      showError('Invalid admin registration code');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });

      if (response.data) {
        showSuccess('Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-accent-600 rounded flex items-center justify-center mb-6 shadow-minimal">
            <span className="text-white font-bold text-sm font-mono">C</span>
          </div>
          <h2 className="heading-minimal text-2xl mb-2">
            Join CivicAid
          </h2>
          <div className="text-icon text-icon-primary mb-4">REGISTER</div>
          <p className="body-minimal text-sm text-muted mb-2">
            Start making a difference in your community today.
          </p>
          <p className="subheading-minimal text-sm text-accent-600">
            Free for all Bangladeshi citizens!
          </p>
        </div>

        <div className="minimal-card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="subheading-minimal text-sm mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="minimal-input"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="subheading-minimal text-sm mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="minimal-input"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="subheading-minimal text-sm mb-2 block">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="minimal-input"
                placeholder="01XXXXXXXXX"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="subheading-minimal text-sm mb-2 block">
                I am a
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="minimal-input"
              >
                <option value="citizen">Citizen</option>
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO Representative</option>
                <option value="authority">Local Authority</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Admin Code (only show for admin role) */}
            {formData.role === 'admin' && (
              <div>
                <label className="subheading-minimal text-sm mb-2 block">
                  Admin Registration Code
                </label>
                <input
                  type="text"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                  className="minimal-input"
                  placeholder="Enter admin code"
                />
                <p className="caption-minimal text-xs text-muted mt-1">
                  Contact the team at +880 1798 585 919 for admin access
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="subheading-minimal text-sm mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="minimal-input pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                >
                  {showPassword ? (
                    <span className="text-icon text-xs">HIDE</span>
                  ) : (
                    <span className="text-icon text-xs">SHOW</span>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="subheading-minimal text-sm mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="minimal-input pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                >
                  {showConfirmPassword ? (
                    <span className="text-icon text-xs">HIDE</span>
                  ) : (
                    <span className="text-icon text-xs">SHOW</span>
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-accent-600 focus:ring-accent-500 border-primary-300 rounded"
              />
              <div className="body-minimal text-xs text-muted">
                I agree to the{' '}
                <a href="#" className="text-accent-600 hover:text-accent-700 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent-600 hover:text-accent-700 transition-colors">
                  Privacy Policy
                </a>
                . I understand that CivicAid services are free for Bangladeshi citizens.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="minimal-btn minimal-btn-primary w-full"
            >
              {loading ? (
                <div className="loading-minimal">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span className="text-icon text-icon-primary">CREATE</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="body-minimal text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-600 hover:text-accent-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="minimal-card-subtle p-4 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <h3 className="subheading-minimal text-sm mb-3">Why Join CivicAid?</h3>
          <ul className="body-minimal text-xs text-muted space-y-1">
            <li>• Report and track community issues</li>
            <li>• Connect with local authorities</li>
            <li>• Volunteer for community projects</li>
            <li>• 100% free for Bangladeshi citizens</li>
            <li>• Available in all 64 districts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;