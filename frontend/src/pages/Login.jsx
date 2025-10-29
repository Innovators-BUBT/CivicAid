import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import '../minimalist-modern.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        showSuccess('Login successful! Welcome back.');
        navigate('/');
      } else {
        showError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      showError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="minimal-card p-8 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-accent-600 rounded flex items-center justify-center mb-6 shadow-minimal">
            </div>
            <h2 className="heading-minimal text-2xl mb-2">
              Welcome Back
            </h2>
            <div className="text-icon text-icon-primary mb-4">LOGIN</div>
            <p className="body-minimal text-sm text-muted mb-6">
              Sign in to your CivicAid account and continue making a difference
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div>
              <label htmlFor="email" className="subheading-minimal text-sm mb-2 block">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="minimal-input"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="subheading-minimal text-sm mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="minimal-input pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="text-icon text-xs">HIDE</span>
                  ) : (
                    <span className="text-icon text-xs">SHOW</span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-primary-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 body-minimal text-sm">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="body-minimal text-sm text-accent-600 hover:text-accent-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full minimal-btn minimal-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="loading-minimal">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <span className="text-icon text-icon-primary">LOGIN</span>
              )}
            </button>

            <div className="text-center">
              <p className="body-minimal text-sm text-muted">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent-600 hover:text-accent-700 transition-colors">
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;