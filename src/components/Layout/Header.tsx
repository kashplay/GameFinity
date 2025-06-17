import React from 'react';
import { LogOut, User, GamepadIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              Gamefinity Tracker
              <GamepadIcon className="h-5 w-5 ml-2 text-blue-600" />
            </h1>
            {user?.role === 'ADMIN' && (
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Admin
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <User className="h-4 w-4 mr-1" />
              {user?.username}
            </div>
            <button
              onClick={logout}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}