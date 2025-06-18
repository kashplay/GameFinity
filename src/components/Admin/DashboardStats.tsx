import React from 'react';
import { TrendingUp, Users, Clock, IndianRupee } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/priceCalculations';

export function DashboardStats() {
  const { getDashboardStats } = useData();
  const { user } = useAuth();
  const stats = getDashboardStats();

  const statCards = [
    {
      name: "Today's Sessions",
      value: stats.todaySessions,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Active Sessions',
      value: stats.activeSessions,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: "Today's Income",
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Only add cash balance card for admin users
  if (user?.role === 'ADMIN') {
    statCards.push({
      name: 'Cash Balance',
      value: formatCurrency(stats.cashBalance),
      icon: IndianRupee,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    });
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`${stat.bgColor} rounded-lg p-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}