import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { LoginForm } from './components/Auth/LoginForm';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoadingSpinner } from './components/Layout/LoadingSpinner';
import { ErrorMessage } from './components/Layout/ErrorMessage';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const { loading, error } = useData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return user?.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;