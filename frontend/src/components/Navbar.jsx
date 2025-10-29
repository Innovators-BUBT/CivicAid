// frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../minimalist-modern.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: 'HOME' },
    { to: '/services', label: 'Services', icon: 'SERVICES' },
    { to: '/about', label: 'About', icon: 'ABOUT' },
    { to: '/contact', label: 'Contact', icon: 'CONTACT' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'minimal-nav shadow-minimal' 
        : 'bg-transparent'
    }`}>
      <div className="container-minimal">
        <div className="flex items-center justify-between h-16">
          {/* Minimalist Logo */}
          <Link to="/" className="flex items-center space-x-3 group animate-fade-in">
            <div className="w-8 h-8 bg-accent-600 rounded flex items-center justify-center shadow-minimal group-hover:shadow-minimal-lg transition-all duration-300">
            </div>
            <div className="hidden sm:block">
              <h1 className="heading-minimal text-lg text-primary-900">
                CivicAid
              </h1>
              <p className="caption-minimal text-xs text-muted">CIVIC PLATFORM</p>
            </div>
          </Link>

          {/* Minimalist Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                className={`minimal-nav-link ${
                  isActive(link.to) ? 'active' : ''
                } animate-fade-in`}
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <span className="text-icon text-xs">{link.icon}</span>
              </Link>
            ))}
          </div>

          {/* Minimalist Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-3 animate-fade-in">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard" className="minimal-btn minimal-btn-primary text-xs">
                  <span className="text-icon text-icon-primary">DASH</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded hover:bg-primary-100 transition-all duration-200">
                    <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-icon text-xs">▼</span>
                  </button>
                  
                  {/* Minimalist Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 minimal-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-2">
                      <div className="px-3 py-2 border-b border-primary-200">
                        <p className="subheading-minimal text-xs">{user?.name || 'User'}</p>
                        <p className="caption-minimal text-xs text-muted">{user?.email || 'user@example.com'}</p>
                      </div>
                      <Link to="/profile" className="block px-3 py-2 body-minimal text-sm text-primary-600 hover:bg-primary-100 transition-colors">
                        <span className="text-icon text-xs">PROFILE</span>
                      </Link>
                      <Link to="/settings" className="block px-3 py-2 body-minimal text-sm text-primary-600 hover:bg-primary-100 transition-colors">
                        <span className="text-icon text-xs">SETTINGS</span>
                      </Link>
                      <div className="divider"></div>
                      <button
                        onClick={() => {
                          logout();
                          window.location.reload();
                        }}
                        className="block w-full text-left px-3 py-2 body-minimal text-sm text-error-600 hover:bg-error-50 transition-colors"
                      >
                        <span className="text-icon text-icon-error text-xs">LOGOUT</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="minimal-btn minimal-btn-secondary text-xs">
                  <span className="text-icon">LOGIN</span>
                </Link>
                <Link to="/register" className="minimal-btn minimal-btn-primary text-xs">
                  <span className="text-icon text-icon-primary">SIGNUP</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 font-medium ${
                  isActive(link.to) ? 'bg-violet-50 text-violet-600' : ''
                }`}
              >
                <span className="text-icon text-xs">{link.icon}</span>
              </Link>
            ))}
            
            <hr className="border-gray-200 my-2" />
            
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-semibold text-center"
                >
                  <span className="text-icon text-xs">DASH</span>
                </Link>
                <div className="flex items-center px-4 py-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    window.location.reload();
                  }}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <span className="text-icon text-xs">LOGOUT</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 bg-white border-2 border-violet-300 text-violet-700 rounded-xl font-semibold text-center hover:bg-violet-50 transition-colors"
                >
                  <span className="text-icon text-xs">LOGIN</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-semibold text-center"
                >
                  <span className="text-icon text-xs">SIGNUP</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
