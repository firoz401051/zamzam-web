'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AutomatedMonitoring from '@/lib/monitoring/automated';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Report to monitoring system
    AutomatedMonitoring.reportError(error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="font-semibold">Something went wrong</h2>
              </div>
              <div className="mt-2 text-red-700">
                An unexpected error occurred while rendering this page.
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer font-medium">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800">
                      <div className="font-medium">{this.state.error.name}</div>
                      <div className="mt-1">{this.state.error.message}</div>
                      {this.state.error.stack && (
                        <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to report errors
export const useErrorReporting = () => {
  return {
    reportError: (error: Error, context?: Record<string, any>) => {
      AutomatedMonitoring.reportError(error, { context });
    }
  };
};

export default ErrorBoundary;