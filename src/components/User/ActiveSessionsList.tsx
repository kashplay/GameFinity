import React, { useState } from 'react';
import { Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { GameSession } from '../../types';
import { formatTime, formatCurrency, calculateDurationInMinutes, roundToNearestHalfHour, calculatePrice } from '../../utils/priceCalculations';

interface EndSessionModalProps {
  session: GameSession;
  onClose: () => void;
  onSubmit: (sessionId: string, cashReceived: number, onlineReceived: number, mismatchReason?: string) => void;
}

function EndSessionModal({ session, onClose, onSubmit }: EndSessionModalProps) {
  const [cashReceived, setCashReceived] = useState<string>('');
  const [onlineReceived, setOnlineReceived] = useState<string>('');
  const [mismatchReason, setMismatchReason] = useState('');

  const currentTime = new Date();
  const durationMinutes = calculateDurationInMinutes(new Date(session.startTime), currentTime);
  const roundedHours = roundToNearestHalfHour(durationMinutes);
  const calculatedPrice = calculatePrice(session.controllerCount, roundedHours, session.gameType);
  
  const totalReceived = (parseFloat(cashReceived) || 0) + (parseFloat(onlineReceived) || 0);
  const hasMismatch = Math.abs(totalReceived - calculatedPrice) > 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      session.id,
      parseFloat(cashReceived) || 0,
      parseFloat(onlineReceived) || 0,
      hasMismatch ? mismatchReason : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">End Game Session</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Customer:</strong> {session.customerName}</p>
            <p><strong>Duration:</strong> {Math.floor(roundedHours)} hrs {((roundedHours % 1) * 60)} mins</p>
            <p><strong>Calculated Price:</strong> {formatCurrency(calculatedPrice)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash Received
              </label>
              <input
                type="number"
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Online Received
              </label>
              <input
                type="number"
                step="0.01"
                value={onlineReceived}
                onChange={(e) => setOnlineReceived(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {hasMismatch && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center text-yellow-800 text-sm mb-2">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Payment Mismatch Detected
              </div>
              <p className="text-xs text-yellow-700 mb-2">
                Expected: {formatCurrency(calculatedPrice)} | Received: {formatCurrency(totalReceived)}
              </p>
              <input
                type="text"
                value={mismatchReason}
                onChange={(e) => setMismatchReason(e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                placeholder="Reason for mismatch (required)"
                required={hasMismatch}
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              End Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ActiveSessionsList() {
  const { getActiveSessions, updateGameSession, addCashTransaction } = useData();
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null);
  
  const activeSessions = getActiveSessions();

  const handleEndSession = (sessionId: string, cashReceived: number, onlineReceived: number, mismatchReason?: string) => {
    const session = activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    const currentTime = new Date();
    const durationMinutes = calculateDurationInMinutes(new Date(session.startTime), currentTime);
    const roundedHours = roundToNearestHalfHour(durationMinutes);
    const calculatedPrice = calculatePrice(session.controllerCount, roundedHours, session.gameType);
    const totalReceived = cashReceived + onlineReceived;

    // Update session
    updateGameSession(sessionId, {
      endTime: currentTime,
      duration: durationMinutes,
      calculatedPrice,
      totalPrice: totalReceived,
      cashReceived,
      onlineReceived,
      status: 'COMPLETED',
      isMismatch: Math.abs(totalReceived - calculatedPrice) > 0.01,
      mismatchReason
    });

    // Add cash transaction if cash was received
    if (cashReceived > 0) {
      addCashTransaction({
        gameSessionId: sessionId,
        txnAmount: cashReceived,
        totalCurrAmount: 0, // Will be calculated in context
        description: 'Game session cash payment',
        txnType: 'CREDIT',
        txnDate: new Date()
      });
    }
  };

  const getCurrentDuration = (startTime: Date) => {
    const minutes = calculateDurationInMinutes(startTime, new Date());
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (activeSessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
        </div>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No active sessions</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Clock className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
          <span className="ml-auto bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {activeSessions.length} Active
          </span>
        </div>

        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{session.customerName}</h3>
                  <p className="text-sm text-gray-600">
                    {session.gameType.toUpperCase()} • {session.controllerCount} Controller{session.controllerCount > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {getCurrentDuration(new Date(session.startTime))}
                  </p>
                  <p className="text-xs text-gray-500">
                    Started {formatTime(new Date(session.startTime))}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedSession(session)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                End Session
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedSession && (
        <EndSessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSubmit={handleEndSession}
        />
      )}
    </>
  );
}