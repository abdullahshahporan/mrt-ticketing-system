import React from 'react';
import { Button } from '@ui/button';
import { stations } from '../../data/stations';

interface BookingFormProps {
  fromStation: string;
  toStation: string;
  quantity: number;
  totalFare: number;
  isCalculating: boolean;
  onFromStationChange: (station: string) => void;
  onToStationChange: (station: string) => void;
  onQuantityChange: (quantity: number) => void;
  onBookTicket: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  fromStation,
  toStation,
  quantity,
  totalFare,
  isCalculating,
  onFromStationChange,
  onToStationChange,
  onQuantityChange,
  onBookTicket
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ticket Details</h2>

      {/* From Station */}
      <div className="mb-6">
        <label htmlFor="fromStation" className="block text-sm font-semibold text-gray-700 mb-2">
          From Station *
        </label>
        <select
          id="fromStation"
          value={fromStation}
          onChange={(e) => onFromStationChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Select departure station</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id} disabled={station.id === toStation}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      {/* To Station */}
      <div className="mb-6">
        <label htmlFor="toStation" className="block text-sm font-semibold text-gray-700 mb-2">
          To Station *
        </label>
        <select
          id="toStation"
          value={toStation}
          onChange={(e) => onToStationChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Select destination station</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id} disabled={station.id === fromStation}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
          Number of Tickets *
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i + 1 === 1 ? 'Ticket' : 'Tickets'}
            </option>
          ))}
        </select>
      </div>

      {/* Total Fare Display */}
      <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total Fare:</span>
          <div className="text-right">
            {isCalculating ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Calculating...</span>
              </div>
            ) : (
              <div>
                <span className="text-3xl font-bold text-blue-600">৳{totalFare}</span>
                {quantity > 1 && totalFare > 0 && (
                  <div className="text-sm text-gray-600 mt-1">
                    ৳{(totalFare / quantity).toFixed(0)} per ticket
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy Ticket Button */}
      <Button
        onClick={onBookTicket}
        disabled={!fromStation || !toStation || fromStation === toStation || totalFare === 0}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        size="lg"
      >
        {totalFare > 0 ? `Buy Ticket - ৳${totalFare}` : 'Buy Ticket'}
      </Button>

      {/* Info Message */}
      {fromStation && toStation && fromStation === toStation && (
        <p className="mt-4 text-sm text-red-600 text-center">
          Please select different stations for departure and destination
        </p>
      )}
    </div>
  );
};

export default BookingForm;