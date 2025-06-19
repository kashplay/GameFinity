import React from 'react';
import { Loader2, Gamepad2, CheckCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  variant?: 'default' | 'post-login' | 'session-creation' | 'transaction-creation';
  message?: string;
}

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
}

export function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-green-400 hover:text-green-600 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ variant = 'default', message }: LoadingSpinnerProps) {
  const getContent = () => {
    switch (variant) {
      case 'post-login':
        return (
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Gamepad2 className="h-10 w-10 text-white" />
            </div>
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Gamefinity Tracker</h2>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        );
      
      case 'session-creation':
        return (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Creating Session</h2>
            <p className="text-gray-600">Setting up your game session...</p>
          </div>
        );
      
      case 'transaction-creation':
        return (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Processing Transaction</h2>
            <p className="text-gray-600">Adding your cash transaction...</p>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{message || 'Loading...'}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {getContent()}
    </div>
  );
}