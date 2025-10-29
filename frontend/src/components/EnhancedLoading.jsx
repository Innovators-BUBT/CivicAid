import React from 'react';

const EnhancedLoading = ({ 
  type = 'spinner', 
  size = 'medium', 
  text = 'Loading...', 
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-violet-200 border-t-violet-600 ${className}`}>
      <span className="sr-only">Loading</span>
    </div>
  );

  const renderDots = () => (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} bg-violet-600 rounded-full animate-pulse ${className}`}>
      <span className="sr-only">Loading</span>
    </div>
  );

  const renderSkeleton = () => (
    <div className={`${sizeClasses[size]} skeleton-loading rounded ${className}`}>
      <span className="sr-only">Loading</span>
    </div>
  );

  const renderRing = () => (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-violet-200 border-t-violet-600 ${className}`}>
      <span className="sr-only">Loading</span>
    </div>
  );

  const renderLoadingContent = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'ring':
        return renderRing();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoadingContent()}
      {showText && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default EnhancedLoading;
