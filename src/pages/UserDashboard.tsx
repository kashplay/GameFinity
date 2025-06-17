import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Navigation/BottomNav';
import { GameSessionForm } from '../components/User/GameSessionForm';
import { ActiveSessionsList } from '../components/User/ActiveSessionsList';
import { CashTransactionForm } from '../components/User/CashTransactionForm';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState('start');

  const renderContent = () => {
    switch (activeTab) {
      case 'start':
        return <GameSessionForm />;
      case 'active':
        return <ActiveSessionsList />;
      case 'cash':
        return <CashTransactionForm />;
      default:
        return <GameSessionForm />;
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