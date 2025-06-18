import React, { useState } from 'react';
import { Calendar, IndianRupee, Plus, Minus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatDate, formatCurrency, formatTime } from '../../utils/priceCalculations';

export function CashTransactionsList() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const { cashTransactions, gameSessions } = useData();
  
  const getFilteredTransactions = () => {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate + 'T23:59:59') : undefined;
    
    let transactions = [...cashTransactions];
    
    // Filter by date range
    if (start && end) {
      transactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.txnDate);
        return transactionDate >= start && transactionDate <= end;
      });
    } else if (start) {
      transactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.txnDate);
        return transactionDate >= start;
      });
    } else if (end) {
      transactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.txnDate);
        return transactionDate <= end;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      transactions = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredTransactions = getFilteredTransactions();

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, searchTerm]);

  // Calculate summary stats
  const totalCredits = filteredTransactions
    .filter(t => t.txnType === 'CREDIT')
    .reduce((sum, t) => sum + t.txnAmount, 0);
  
  const totalDebits = filteredTransactions
    .filter(t => t.txnType === 'DEBIT')
    .reduce((sum, t) => sum + t.txnAmount, 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to format date and time in AM/PM format
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to get session details
  const getSessionDetails = (sessionId: string) => {
    const session = gameSessions.find(s => s.id === sessionId);
    if (session) {
      return {
        customerName: session.customerName,
        endTime: session.endTime || session.startTime,
        gameType: session.gameType,
        controllerCount: session.controllerCount
      };
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <IndianRupee className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Cash Transactions</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Description
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search transactions..."
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Plus className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">Total Credits</p>
              <p className="text-lg font-semibold text-green-900">{formatCurrency(totalCredits)}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Minus className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">Total Debits</p>
              <p className="text-lg font-semibold text-red-900">{formatCurrency(totalDebits)}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">Net Amount</p>
              <p className={`text-lg font-semibold ${totalCredits - totalDebits >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                {formatCurrency(totalCredits - totalDebits)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No cash transactions found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {paginatedTransactions.map((transaction) => {
              const sessionDetails = transaction.gameSessionId ? getSessionDetails(transaction.gameSessionId) : null;
              const displayDate = sessionDetails ? new Date(sessionDetails.endTime) : new Date(transaction.txnDate);
              
              return (
                <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {transaction.txnType === 'CREDIT' ? (
                          <Plus className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <Minus className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(displayDate)} • {transaction.txnType}
                      </p>
                      {transaction.gameSessionId && sessionDetails && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-500">
                            Session ID: {transaction.gameSessionId}
                          </p>
                          <p className="text-xs text-gray-500">
                            Customer: {sessionDetails.customerName} • {sessionDetails.gameType.toUpperCase()} • {sessionDetails.controllerCount} Controller{sessionDetails.controllerCount > 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.txnType === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.txnType === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.txnAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Balance: {formatCurrency(transaction.totalCurrAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
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