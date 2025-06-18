import React, { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatCurrency, formatTime, formatDate } from '../../utils/priceCalculations';

export function CompletedSessions24Hours() {
  const { getCompletedSessionsLast24Hours } = useData();
  const last24HoursSessions = getCompletedSessionsLast24Hours();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Pagination logic
  const totalPages = Math.ceil(last24HoursSessions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSessions = last24HoursSessions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Completed Sessions</h2>
        </div>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {last24HoursSessions.length} Completed
        </span>
      </div>

      {last24HoursSessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No completed sessions in the last 24 hours</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {paginatedSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-gray-900 mr-2">{session.customerName}</h3>
                      {session.isMismatch ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" title="Payment mismatch" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" title="Payment matched" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {session.gameType.toUpperCase()} • {session.controllerCount} Controller{session.controllerCount > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(new Date(session.createdAt))} • {formatTime(new Date(session.startTime))} - {formatTime(new Date(session.endTime!))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 mb-1">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {startIndex + 1} to {Math.min(endIndex, last24HoursSessions.length)} of {last24HoursSessions.length} sessions
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 