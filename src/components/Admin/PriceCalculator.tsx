import React, { useState } from 'react';
import { Calculator, Clock, Gamepad2, IndianRupee } from 'lucide-react';
import { calculatePrice, roundToNearestHalfHour, formatCurrency } from '../../utils/priceCalculations';

export function PriceCalculator() {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [controllerCount, setControllerCount] = useState<number>(1);
  const [gameType, setGameType] = useState<'screen1' | 'screen2' | 'screen3' | 'screen4' | 'pool'>('screen1');

  // Calculate total minutes
  const totalMinutes = hours * 60 + minutes;
  
  // Calculate rounded hours for pricing
  const roundedHours = roundToNearestHalfHour(totalMinutes);
  
  // Calculate price
  const calculatedPrice = calculatePrice(controllerCount, roundedHours, gameType);

  const handleHoursChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setHours(Math.max(0, numValue));
  };

  const handleMinutesChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setMinutes(Math.max(0, Math.min(59, numValue)));
  };

  const handleControllerChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    setControllerCount(Math.max(1, Math.min(4, numValue)));
  };

  const getPricingInfo = () => {
    if (gameType === 'pool') {
      return {
        basePrice: 250,
        description: 'Pool games: ₹250 per hour (₹150 for 0.5 hours)'
      };
    }

    const pricing = {
      1: { basePrice: 150, description: '1 Controller: ₹150 per hour' },
      2: { basePrice: 250, description: '2 Controllers: ₹250 per hour' },
      3: { basePrice: 400, description: '3 Controllers: ₹400 per hour' },
      4: { basePrice: 450, description: '4 Controllers: ₹450 per hour' }
    };

    return pricing[controllerCount as keyof typeof pricing];
  };

  const pricingInfo = getPricingInfo();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Price Calculator</h2>
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Admin Tool:</strong> Test the pricing logic by entering duration and controller count. This calculator uses the same logic as the actual session pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Type
            </label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="screen1">Screen 1</option>
              <option value="screen2">Screen 2</option>
              <option value="screen3">Screen 3</option>
              <option value="screen4">Screen 4</option>
              <option value="pool">Pool</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Controllers
            </label>
            <select
              value={controllerCount}
              onChange={(e) => handleControllerChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={gameType === 'pool'}
            >
              <option value={1}>1 Controller</option>
              <option value={2}>2 Controllers</option>
              <option value={3}>3 Controllers</option>
              <option value={4}>4 Controllers</option>
            </select>
            {gameType === 'pool' && (
              <p className="text-xs text-gray-500 mt-1">Pool games don't use controllers</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours
              </label>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => handleHoursChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => handleMinutesChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Duration:</span>
            <span className="text-sm text-gray-900">
              {hours}h {minutes}m ({totalMinutes} minutes)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Rounded Duration:</span>
            <span className="text-sm text-gray-900">
              {roundedHours} hours
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Base Rate:</span>
            <span className="text-sm text-gray-900">
              ₹{pricingInfo.basePrice}/hour
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Calculated Price:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(calculatedPrice)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">
              <strong>Pricing Logic:</strong>
            </p>
            <p className="text-xs text-gray-600 mb-1">
              {pricingInfo.description}
            </p>
            {gameType === 'pool' && (
              <p className="text-xs text-gray-600">
                Special pricing for 0.5 hours: ₹150
              </p>
            )}
            {gameType !== 'pool' && controllerCount <= 2 && (
              <p className="text-xs text-gray-600">
                Special pricing for 0.5 hours: {controllerCount === 1 ? '₹100' : '₹150'}
              </p>
            )}
            {gameType !== 'pool' && controllerCount === 2 && (
              <p className="text-xs text-gray-600">
                Special pricing for 1.5 hours: ₹400
              </p>
            )}
            <p className="text-xs text-gray-600 mt-2">
              Duration rounding: &lt;20min = 0h, 20-40min = 0.5h, 41-75min = 1h, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing Reference</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Game Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Controllers
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Rate/Hour
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  0.5h Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Pool</td>
                <td className="px-4 py-2 text-sm text-gray-600">-</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹250</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹150</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Screen</td>
                <td className="px-4 py-2 text-sm text-gray-600">1</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹150</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹100</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Screen</td>
                <td className="px-4 py-2 text-sm text-gray-600">2</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹250</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹150</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Screen</td>
                <td className="px-4 py-2 text-sm text-gray-600">2</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹400</td>
                <td className="px-4 py-2 text-sm text-gray-900">1.5h Rate</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Screen</td>
                <td className="px-4 py-2 text-sm text-gray-600">3</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹400</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹200</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Screen</td>
                <td className="px-4 py-2 text-sm text-gray-600">4</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹450</td>
                <td className="px-4 py-2 text-sm text-gray-900">₹225</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 