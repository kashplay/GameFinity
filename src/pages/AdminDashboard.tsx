import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Navigation/BottomNav';
import { DashboardStats } from '../components/Admin/DashboardStats';
import { ActiveSessionsList } from '../components/User/ActiveSessionsList';
import { CompletedSessionsList } from '../components/Admin/CompletedSessionsList';
import { CashTransactionsList } from '../components/Admin/CashTransactionsList';
import { PriceCalculator } from '../components/Admin/PriceCalculator';
import { GameSessionForm } from '../components/User/GameSessionForm';
import { Play } from 'lucide-react';
import { SuccessNotification } from '../components/Layout/LoadingSpinner';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSessionSuccess = (customerName: string) => {
    setSuccessMessage(`Session for ${customerName} has been started and added to active sessions!`);
    setShowSuccess(true);
    setShowSessionForm(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
              <button
                onClick={() => setShowSessionForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </button>
            </div>
            {showSessionForm ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Start New Session</h3>
                  <button
                    onClick={() => setShowSessionForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <GameSessionForm onSuccess={handleSessionSuccess} />
              </div>
            ) : (
              <ActiveSessionsList />
            )}
          </div>
        );
      case 'start':
        return <GameSessionForm onSuccess={(customerName) => handleSessionSuccess(customerName)} />;
      case 'active':
        return <ActiveSessionsList />;
      case 'completed':
        return <CompletedSessionsList />;
      case 'transactions':
        return <CashTransactionsList />;
      case 'calculator':
        return <PriceCalculator />;
      default:
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
              <button
                onClick={() => setShowSessionForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </button>
            </div>
            {showSessionForm ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Start New Session</h3>
                  <button
                    onClick={() => setShowSessionForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <GameSessionForm onSuccess={handleSessionSuccess} />
              </div>
            ) : (
              <ActiveSessionsList />
            )}
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
      
      {showSuccess && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}