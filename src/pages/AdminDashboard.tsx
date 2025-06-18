import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Navigation/BottomNav';
import { DashboardStats } from '../components/Admin/DashboardStats';
import { ActiveSessionsList } from '../components/User/ActiveSessionsList';
import { CompletedSessionsList } from '../components/Admin/CompletedSessionsList';
import { CashTransactionsList } from '../components/Admin/CashTransactionsList';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <ActiveSessionsList />
          </div>
        );
      case 'active':
        return <ActiveSessionsList />;
      case 'completed':
        return <CompletedSessionsList />;
      case 'transactions':
        return <CashTransactionsList />;
      default:
        return (
          <div className="space-y-6">
            <DashboardStats />
            <ActiveSessionsList />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}