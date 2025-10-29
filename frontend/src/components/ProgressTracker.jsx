import React, { useState, useEffect } from 'react';

const ProgressTracker = ({ 
  steps = [], 
  currentStep = 0, 
  onStepClick,
  showLabels = true,
  variant = "default" // default, compact, vertical
}) => {
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStep(currentStep);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const getStepStatus = (index) => {
    if (index < animatedStep) return 'completed';
    if (index === animatedStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (step, status, stepIndex) => {
    if (status === 'completed') {
      return (
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (status === 'current') {
      return (
        <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <span className="text-lg font-semibold text-gray-400">
        {stepIndex + 1}
      </span>
    );
  };

  const getStepClasses = (status) => {
    const baseClasses = "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ease-out transform";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg scale-110`;
      case 'current':
        return `${baseClasses} bg-white border-4 border-indigo-500 shadow-xl scale-125 animate-pulse-slow`;
      case 'pending':
        return `${baseClasses} bg-gray-100 border-2 border-gray-200`;
      default:
        return baseClasses;
    }
  };

  const getConnectorClasses = (status) => {
    const baseClasses = "flex-1 h-1 transition-all duration-500 ease-out";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-r from-emerald-500 to-teal-600`;
      case 'current':
        return `${baseClasses} bg-gradient-to-r from-indigo-500 to-purple-600`;
      case 'pending':
        return `${baseClasses} bg-gray-200`;
      default:
        return `${baseClasses} bg-gray-200`;
    }
  };

  if (variant === 'vertical') {
    return (
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepClick && onStepClick(index)}
                  className={`${getStepClasses(status)} ${onStepClick ? 'cursor-pointer hover:scale-110' : ''}`}
                >
                  {getStepIcon(step, status, index)}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-1 h-8 mt-2 ${getConnectorClasses(status)}`} />
                )}
              </div>
              <div className="flex-1 pt-2">
                <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                  status === 'completed' ? 'text-emerald-600' : 
                  status === 'current' ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                {showLabels && step.description && (
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <React.Fragment key={index}>
              <button
                onClick={() => onStepClick && onStepClick(index)}
                className={`${getStepClasses(status)} w-8 h-8 ${onStepClick ? 'cursor-pointer hover:scale-110' : ''}`}
              >
                {getStepIcon(step, status, index)}
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 ${getConnectorClasses(status)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => onStepClick && onStepClick(index)}
                  className={`${getStepClasses(status)} ${onStepClick ? 'cursor-pointer hover:scale-110' : ''}`}
                >
                  {getStepIcon(step, status, index)}
                </button>
                
                {showLabels && (
                  <div className="mt-3 text-center">
                    <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                      status === 'completed' ? 'text-emerald-600' : 
                      status === 'current' ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                    )}
                  </div>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${getConnectorClasses(status)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
