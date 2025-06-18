import React from 'react';
import { Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatCurrency, formatTime, formatDate } from '../../utils/priceCalculations';

export function CompletedSessions24Hours() {
  const { getCompletedSessionsLast24Hours } = useData();
  const last24HoursSessions = getCompletedSessionsLast24Hours();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Calendar className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Completed Sessions</h3>
        <span className="ml-2 text-sm text-gray-500">(Last 24 hours • {last24HoursSessions.length} sessions)</span>
      </div>

      {last24HoursSessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No completed sessions in the last 24 hours</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {last24HoursSessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{session.customerName}</h4>
                  <p className="text-sm text-gray-600">
                    {session.gameType.toUpperCase()} • {session.controllerCount} Controller{session.controllerCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(new Date(session.createdAt))} • {formatTime(new Date(session.startTime))} - {formatTime(new Date(session.endTime!))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(session.totalPrice)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(session.duration! / 60)}h {session.duration! % 60}m
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 