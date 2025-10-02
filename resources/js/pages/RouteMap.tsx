import React, { useState, useEffect } from 'react';

interface RouteMapData {
  title: string;
  subtitle: string;
  image_path: string;
  description: string;
  features: string[];
  stations: { name: string; order: number }[];
  safety_guidelines: string[];
}

const RouteMap: React.FC = () => {
  const [routeMapData, setRouteMapData] = useState<RouteMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  useEffect(() => {
    fetchRouteMapData();
  }, []);

  const fetchRouteMapData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/route-map/data');
      const data = await response.json();
      
      if (data.success) {
        setRouteMapData(data.data);
      } else {
        setError('Failed to load route map data');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Route map data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading route map...</p>
        </div>
      </div>
    );
  }

  if (error || !routeMapData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{routeMapData.title}</h1>
          <p className="text-xl text-gray-600">{routeMapData.subtitle}</p>
        </div>

        {/* Route Map Image */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interactive Route Map</h2>
              <p className="text-gray-600">Click on any station to see more details</p>
            </div>
            
            <div className="relative bg-gray-50 rounded-xl p-4 overflow-hidden">
              <img 
                src={routeMapData.image_path}
                alt="MRT Route Map"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Grid Layout for Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">About the Metro Line</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{routeMapData.description}</p>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">Key Features</h4>
              {routeMapData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stations List */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">All Stations</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {routeMapData.stations.map((station, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedStation === station.order 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                  }`}
                  onClick={() => setSelectedStation(selectedStation === station.order ? null : station.order)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {station.order}
                    </div>
                    <span className="font-medium text-gray-800">{station.name}</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      selectedStation === station.order ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;