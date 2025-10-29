import React, { useState, useEffect, createContext, useContext } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.autoClose !== false) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <span className="w-5 h-5 text-green-500">✓</span>;
      case 'error':
        return <span className="w-5 h-5 text-red-500">✕</span>;
      case 'warning':
        return <span className="w-5 h-5 text-yellow-500">⚠</span>;
      case 'info':
      default:
        return <span className="w-5 h-5 text-blue-500">ℹ</span>;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBackgroundColor()}
        border rounded-lg shadow-lg p-4 mb-3 max-w-sm w-full
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {notification.title}
            </h4>
          )}
          <p className="text-sm text-gray-700">
            {notification.message}
          </p>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="w-4 h-4">×</span>
        </button>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      autoClose: true,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (message, options = {}) => {
    return addNotification({ type: 'success', message, ...options });
  };

  const error = (message, options = {}) => {
    return addNotification({ type: 'error', message, ...options });
  };

  const warning = (message, options = {}) => {
    return addNotification({ type: 'warning', message, ...options });
  };

  const info = (message, options = {}) => {
    return addNotification({ type: 'info', message, ...options });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationProvider;
