import React from 'react';
import { Button } from '@ui/button';

interface OneTimeTicketCardProps {
  onSelect: () => void;
}

const OneTimeTicketCard: React.FC<OneTimeTicketCardProps> = ({ onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-teal-200 group">
      {/* Card Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">One Time Ticket</h3>
        <p className="text-gray-600 text-lg">Perfect for occasional travelers</p>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Instant booking and payment</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">QR code for easy entry</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Valid for single journey</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">No registration required</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-center">
          <span className="text-sm text-gray-500">Starting from</span>
          <div className="text-3xl font-bold text-blue-600">৳20</div>
          <span className="text-sm text-gray-500">per journey</span>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={onSelect}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        Purchase One Time Ticket
      </Button>
    </div>
  );
};

export default OneTimeTicketCard;