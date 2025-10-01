import React from 'react';
import { stations } from '../../data/stations';

interface RouteVisualizationProps {
  fromStation: string;
  toStation: string;
}

const RouteVisualization: React.FC<RouteVisualizationProps> = ({ fromStation, toStation }) => {
  const getStationStatus = (stationId: string): 'origin' | 'destination' | 'active' | 'inactive' => {
    if (stationId === fromStation) return 'origin';
    if (stationId === toStation) return 'destination';
    
    if (!fromStation || !toStation) return 'inactive';
    
    const fromIndex = stations.findIndex(s => s.id === fromStation);
    const toIndex = stations.findIndex(s => s.id === toStation);
    const currentIndex = stations.findIndex(s => s.id === stationId);
    
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);
    
    if (currentIndex > minIndex && currentIndex < maxIndex) {
      return 'active';
    }
    
    return 'inactive';
  };

  const isLineActive = (index: number): boolean => {
    if (!fromStation || !toStation) return false;
    
    const fromIndex = stations.findIndex(s => s.id === fromStation);
    const toIndex = stations.findIndex(s => s.id === toStation);
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);
    
    return index >= minIndex && index < maxIndex;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Route Map</h2>
      
      {/* Route Info */}
      {fromStation && toStation && fromStation !== toStation ? (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold text-gray-700">From:</span>
              <span className="ml-2 text-blue-600 font-medium">
                {stations.find(s => s.id === fromStation)?.name}
              </span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div>
              <span className="font-semibold text-gray-700">To:</span>
              <span className="ml-2 text-red-600 font-medium">
                {stations.find(s => s.id === toStation)?.name}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
          Select departure and destination to see the route
        </div>
      )}

      {/* Station List with Visual Route */}
      <div className="relative space-y-0">
        {stations.map((station, index) => {
          const status = getStationStatus(station.id);
          const isActive = status !== 'inactive';
          
          return (
            <div key={station.id} className="relative">
              {/* Station Item */}
              <div className="flex items-center py-3">
                {/* Station Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border-4 transition-all duration-300 ${
                      status === 'origin'
                        ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-200'
                        : status === 'destination'
                        ? 'bg-red-500 border-red-500 ring-4 ring-red-200'
                        : status === 'active'
                        ? 'bg-blue-400 border-blue-400'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {status === 'origin' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                    {status === 'destination' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Station Name */}
                <div className="ml-4 flex-1">
                  <span
                    className={`font-medium transition-all duration-300 ${
                      status === 'origin'
                        ? 'text-blue-600 text-lg font-semibold'
                        : status === 'destination'
                        ? 'text-red-600 text-lg font-semibold'
                        : status === 'active'
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {station.name}
                  </span>
                  {(status === 'origin' || status === 'destination') && (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {status === 'origin' ? 'Start' : 'End'}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {index < stations.length - 1 && (
                <div className="absolute left-[11px] top-[32px] w-0.5 h-12 -mt-1">
                  <div
                    className={`w-full h-full transition-all duration-300 ${
                      isLineActive(index) ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Departure</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Destination</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
            <span className="text-gray-600">Route Path</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
            <span className="text-gray-600">Not in Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;