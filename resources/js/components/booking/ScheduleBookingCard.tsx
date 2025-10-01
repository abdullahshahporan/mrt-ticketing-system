import React from 'react';
import { Button } from '@ui/button';

interface ScheduleBookingCardProps {
  onSelect: () => void;
}

const ScheduleBookingCard: React.FC<ScheduleBookingCardProps> = ({ onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200 group">
      {/* Card Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule For Later</h3>
        <p className="text-gray-600 text-lg">Plan your journey in advance</p>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Book up to 30 days ahead</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Choose specific time slots</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Email & SMS reminders</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">Flexible cancellation</span>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-green-800 font-medium">Book up to 30 days in advance</span>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={onSelect}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        Schedule Journey
      </Button>
    </div>
  );
};

export default ScheduleBookingCard;