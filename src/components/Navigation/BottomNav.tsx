import React from 'react';
import { Play, Clock, IndianRupee, BarChart3 } from 'lucide-react';
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
    { id: 'cash', label: 'Cash', icon: IndianRupee }
  ];

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { 
      id: 'active', 
      label: 'Active', 
      icon: Clock,
      badge: activeSessionsCount > 0 ? activeSessionsCount : undefined
    },
    { id: 'completed', label: 'Completed', icon: Play }
  ];

  const tabs = user?.role === 'ADMIN' ? adminTabs : userTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <tab.icon className="h-5 w-5 mb-1" />
              {tab.badge && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full h-3 w-3 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}