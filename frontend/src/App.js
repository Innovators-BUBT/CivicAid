import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import NotificationProvider from './components/NotificationSystem';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// import ComplaintForm from './pages/ComplaintForm';
import ComplaintsList from './pages/ComplaintsList';
import AdminDashboard from './pages/AdminDashboard';
import AdminTaskManagement from './pages/AdminTaskManagement';
import ViewComplaints from './pages/ViewComplaints';
import ManageUsers from './pages/ManageUsers';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import SubmitComplaint from './pages/SubmitComplaint';
import UserDashboard from './pages/UserDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <Router>
              <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
                               <Route path="/about" element={<About />} />
                   <Route path="/contact" element={<Contact />} />
                   <Route path="/services" element={<Services />} />
            
            {/* Protected Routes */}
            <Route 
              path="/complaint/new" 
              element={
                <ProtectedRoute>
                  <SubmitComplaint />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaints" 
              element={
                <ProtectedRoute>
                  <ComplaintsList />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/tasks" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminTaskManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/complaints" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <ViewComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <ManageUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
