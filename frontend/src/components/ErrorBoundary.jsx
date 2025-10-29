import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReportError = () => {
    // In a real app, you would send this to an error reporting service
    const errorReport = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('Error Report:', errorReport);
    
    // You could send this to your backend or error reporting service
    // Example: sendErrorReport(errorReport);
    
    alert('Error has been reported. Thank you for helping us improve!');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="btn-primary w-full"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary w-full"
                >
                  Go to Home
                </button>
                
                <button
                  onClick={this.handleReportError}
                  className="btn-warning w-full"
                >
                  Report This Error
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-40">
                    <div><strong>Error:</strong> {this.state.error?.toString()}</div>
                    <div className="mt-2"><strong>Stack:</strong></div>
                    <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
                    <div className="mt-2"><strong>Component Stack:</strong></div>
                    <pre className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                  </div>
                </details>
              )}
              
              <div className="mt-6 text-xs text-gray-500">
                <p>If this problem persists, please contact our support team.</p>
                <p className="mt-1">
                  📧 support@civicaid.bd | 📞 +880 1798 585 919
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
