import React from 'react';
import { Play, Clock, IndianRupee, BarChart3, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { user } = useAuth();
  const { getActiveSessions } = useData();
  const activeSessionsCount = getActiveSessions().length;

  const userTabs = [
    { id: 'start', label: 'Start Session', icon: Play },
    { 
      id: 'active', 
      label: 'Active', 
      icon: Clock,
      badge: activeSessionsCount > 0 ? activeSessionsCount : undefined
    },
    { id: 'recent', label: 'Recent', icon: Calendar },
    { id: 'cash', label: 'Cash', icon: IndianRupee }
  ];

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'start', label: 'Start Session', icon: Play },
    { 
      id: 'active', 
      label: 'Active', 
      icon: Clock,
      badge: activeSessionsCount > 0 ? activeSessionsCount : undefined
    },
    { id: 'completed', label: 'Completed', icon: Play },
    { id: 'transactions', label: 'Cash Transactions', icon: IndianRupee }
  ];

  const tabs = user?.role === 'ADMIN' ? adminTabs : userTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/60 shadow-lg safe-area-pb">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-4 px-2 transition-all duration-300 ease-out relative group ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full animate-pulse" />
            )}
            
            {/* Icon container with enhanced styling */}
            <div className={`relative mb-2 p-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-100/80 shadow-sm scale-110'
                : 'group-hover:bg-gray-100/60 group-hover:scale-105'
            }`}>
              <tab.icon className={`h-5 w-5 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-blue-600 drop-shadow-sm'
                  : 'group-hover:text-gray-700'
              }`} />
              
              {/* Badge with enhanced styling */}
              {tab.badge && (
                <span className={`absolute -top-1 -right-1 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-red-500 shadow-md scale-110'
                    : 'bg-red-500 group-hover:scale-110'
                }`}>
                  {tab.badge}
                </span>
              )}
            </div>
            
            {/* Label with enhanced typography */}
            <span className={`text-xs font-semibold text-center leading-tight max-w-full px-1 transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-600 group-hover:text-gray-800'
            }`}>
              {tab.label}
            </span>
            
            {/* Subtle background effect */}
            <div className={`absolute inset-0 rounded-t-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-t from-blue-50/50 to-transparent'
                : 'group-hover:bg-gradient-to-t from-gray-50/30 to-transparent'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}