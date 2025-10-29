import React, { useState, useEffect } from 'react';

const EnhancedNotification = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  showCloseButton = true,
  className = '',
  icon = null
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-800',
          icon: 'text-emerald-600',
          iconBg: 'bg-emerald-100'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-800',
          icon: 'text-amber-600',
          iconBg: 'bg-amber-100'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        ${styles.bg} border rounded-2xl shadow-2xl
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
        ${className}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            {icon || getDefaultIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`text-sm font-semibold ${styles.text} mb-1`}>
                {title}
              </h4>
            )}
            {message && (
              <p className={`text-sm ${styles.text}`}>
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className={`
                flex-shrink-0 w-6 h-6 rounded-full
                ${styles.iconBg} ${styles.icon}
                hover:bg-opacity-80 transition-colors duration-200
                flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
              `}
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {duration > 0 && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full ${styles.icon} transition-all duration-300 ease-linear`}
              style={{
                width: isExiting ? '0%' : '100%',
                transitionDuration: `${duration}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Notification Container for managing multiple notifications
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <EnhancedNotification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const showSuccess = (message, title = 'Success') => {
    return addNotification({ type: 'success', title, message });
  };

  const showError = (message, title = 'Error') => {
    return addNotification({ type: 'error', title, message });
  };

  const showWarning = (message, title = 'Warning') => {
    return addNotification({ type: 'warning', title, message });
  };

  const showInfo = (message, title = 'Info') => {
    return addNotification({ type: 'info', title, message });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default EnhancedNotification;
