import React from 'react';
import { Button } from '@ui/button';

interface VirtualMRTCardProps {
  onSelect: () => void;
}

const VirtualMRTCard: React.FC<VirtualMRTCardProps> = ({ onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-teal-200 group">
      {/* Card Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Virtual MRT Card</h3>
        <p className="text-gray-600 text-lg">Best for regular commuters</p>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Rechargeable digital wallet</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Discounted fares (5% off)</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Travel history & analytics</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Auto-recharge available</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-center">
          <span className="text-sm text-gray-500">Starting from</span>
          <div className="text-3xl font-bold text-teal-600">৳19</div>
          <span className="text-sm text-gray-500">per journey</span>
        </div>
        <div className="text-center mt-2">
          <span className="inline-block bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
            5% Discount Applied
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={onSelect}
        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        Get Virtual MRT Card
      </Button>
    </div>
  );
};

export default VirtualMRTCard;