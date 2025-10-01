import React from 'react';
import InstantBookingCard from '../components/booking/InstantBookingCard';
import ScheduleBookingCard from '../components/booking/ScheduleBookingCard';

const OneTimeTicket: React.FC = () => {
  const handleInstantBooking = () => {
    console.log('Instant Booking selected');
    // TODO: Navigate to instant booking flow
  };

  const handleScheduleBooking = () => {
    console.log('Schedule Booking selected');
    // TODO: Navigate to schedule booking flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            One Time Ticket Booking
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred booking method for a convenient metro rail journey
          </p>
        </div>

        {/* Booking Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <InstantBookingCard onSelect={handleInstantBooking} />
          <ScheduleBookingCard onSelect={handleScheduleBooking} />
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need Help Choosing?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Booking</h3>
              <p className="text-gray-600">Perfect for immediate travel within the next 1 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule For Later</h3>
              <p className="text-gray-600">Plan your journey up to 30 days in advance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneTimeTicket;