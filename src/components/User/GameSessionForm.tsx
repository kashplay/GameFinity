import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const GAME_TYPES = [
  { value: 'screen1', label: 'Screen 1' },
  { value: 'screen2', label: 'Screen 2' },
  { value: 'screen3', label: 'Screen 3' },
  { value: 'screen4', label: 'Screen 4' },
  { value: 'pool', label: 'Pool' }
];

export function GameSessionForm() {
  const [customerName, setCustomerName] = useState('');
  const [controllerCount, setControllerCount] = useState(1);
  const [gameType, setGameType] = useState<string>('screen1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addGameSession } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    
    try {
      addGameSession({
        customerName: customerName.trim(),
        controllerCount,
        gameType: gameType as any,
        startTime: new Date(),
        calculatedPrice: 0,
        totalPrice: 0,
        cashReceived: 0,
        onlineReceived: 0,
        status: 'ACTIVE'
      });

      // Reset form
      setCustomerName('');
      setControllerCount(1);
      setGameType('screen1');
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Play className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Start Game Session</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name *
          </label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="controllerCount" className="block text-sm font-medium text-gray-700 mb-2">
              Controller Count
            </label>
            <select
              id="controllerCount"
              value={controllerCount}
              onChange={(e) => setControllerCount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {[1, 2, 3, 4].map(count => (
                <option key={count} value={count}>{count} Controller{count > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="gameType" className="block text-sm font-medium text-gray-700 mb-2">
              Game Type
            </label>
            <select
              id="gameType"
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {GAME_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !customerName.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Starting Session...' : 'Start Session'}
        </button>
      </form>
    </div>
  );
}