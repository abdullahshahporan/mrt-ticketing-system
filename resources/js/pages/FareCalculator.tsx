import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface Station {
  id: string;
  name: string;
  order: number;
}

const FareCalculator: React.FC = () => {
  const [fromStation, setFromStation] = useState<string>('');
  const [toStation, setToStation] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [stations, setStations] = useState<Station[]>([]);
  const [fareResult, setFareResult] = useState<{
    base_fare: number;
    total_fare: number;
    quantity: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch stations on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  // Calculate fare when stations or quantity change
  useEffect(() => {
    if (fromStation && toStation && fromStation !== toStation) {
      calculateFare();
    } else {
      setFareResult(null);
    }
  }, [fromStation, toStation, quantity]);

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/instant-booking/stations');
      const data = await response.json();
      if (data.success) {
        setStations(data.stations);
      }
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const calculateFare = async () => {
    if (!fromStation || !toStation || fromStation === toStation) {
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      const response = await fetch('/api/instant-booking/calculate-fare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          from_station: fromStation,
          to_station: toStation,
          quantity: quantity
        })
      });

      const data = await response.json();
      if (data.success) {
        setFareResult(data);
      } else {
        setError('Failed to calculate fare');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Fare calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getStationName = (stationId: string): string => {
    const station = stations.find(s => s.id === stationId);
    return station ? station.name : stationId;
  };

  const resetCalculator = () => {
    setFromStation('');
    setToStation('');
    setQuantity(1);
    setFareResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fare Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your journey fare between any two MRT stations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Calculate Journey Fare</h2>
            
            <div className="space-y-6">
              {/* From Station */}
              <div>
                <label htmlFor="fromStation" className="block text-sm font-semibold text-gray-700 mb-2">
                  From Station *
                </label>
                <select
                  id="fromStation"
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select departure station</option>
                  {stations.map((station) => (
                    <option 
                      key={station.id} 
                      value={station.id}
                      disabled={station.id === toStation}
                    >
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Station */}
              <div>
                <label htmlFor="toStation" className="block text-sm font-semibold text-gray-700 mb-2">
                  To Station *
                </label>
                <select
                  id="toStation"
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select destination station</option>
                  {stations.map((station) => (
                    <option 
                      key={station.id} 
                      value={station.id}
                      disabled={station.id === fromStation}
                    >
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Passengers */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Passengers *
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {[...Array(10)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1} {index + 1 === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={calculateFare}
                  disabled={!fromStation || !toStation || fromStation === toStation || isCalculating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Calculating...
                    </div>
                  ) : (
                    'Calculate Fare'
                  )}
                </Button>
                
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="px-6 py-3 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg transition-all"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Fare Result */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Fare Calculation Result</h2>
            
            {fareResult ? (
              <div className="space-y-6">
                {/* Journey Summary */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">Journey Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-semibold text-gray-900">{getStationName(fromStation)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-semibold text-gray-900">{getStationName(toStation)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-semibold text-gray-900">{quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Fare Breakdown */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fare per person:</span>
                      <span className="text-xl font-bold text-gray-900">৳{fareResult.base_fare}</span>
                    </div>
                  </div>

                  {quantity > 1 && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Calculation:</span>
                        <span className="text-blue-800 font-medium">৳{fareResult.base_fare} × {quantity} = ৳{fareResult.total_fare}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-800">Total Fare:</span>
                      <span className="text-3xl font-bold text-green-600">৳{fareResult.total_fare}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      onClick={() => window.location.href = '/instant-booking'}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                      Book Now
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/schedule-booking'}
                      variant="outline"
                      className="border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                      Schedule Later
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">Select stations to calculate fare</p>
                <p className="text-gray-400 text-sm">Choose your departure and destination stations to see the fare calculation</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fare Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Affordable Fares</h3>
              <p className="text-gray-600">Starting from ৳20 for short distances with distance-based pricing</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Travel</h3>
              <p className="text-gray-600">Quick and efficient travel across Dhaka with modern MRT system</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book instantly or schedule your journey in advance with our simple system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FareCalculator;