import React, { useState } from 'react';
import { IndianRupee, Plus, Minus } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/priceCalculations';

export function CashTransactionForm() {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [txnType, setTxnType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addCashTransaction, getCurrentCashBalance } = useData();
  const { user } = useAuth();
  const currentBalance = getCurrentCashBalance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim()) return;

    const amountValue = parseFloat(amount);
    if (amountValue <= 0) return;

    setIsSubmitting(true);
    
    try {
      addCashTransaction({
        txnAmount: amountValue,
        totalCurrAmount: 0, // Will be calculated in context
        description: description.trim(),
        txnType,
        txnDate: new Date()
      });

      // Reset form
      setAmount('');
      setDescription('');
      setTxnType('CREDIT');
    } catch (error) {
      console.error('Error adding cash transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <IndianRupee className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Gamefinity Cash Transaction</h2>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(currentBalance)}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="txnType" className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTxnType('CREDIT')}
              className={`p-3 rounded-lg border-2 transition-all ${
                txnType === 'CREDIT'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              <Plus className="h-5 w-5 mx-auto mb-1" />
              <div className="font-medium">Credit (+)</div>
            </button>
            
            <button
              type="button"
              onClick={() => setTxnType('DEBIT')}
              className={`p-3 rounded-lg border-2 transition-all ${
                txnType === 'DEBIT'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              <Minus className="h-5 w-5 mx-auto mb-1" />
              <div className="font-medium">Debit (-)</div>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <input
            type="number"
            step="0.01"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="What is this transaction for?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !amount || !description.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Transaction...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}