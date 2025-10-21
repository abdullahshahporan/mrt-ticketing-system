import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expecting state: { pnr: string, message?: string }
  const { pnr, message } = (location.state || {}) as { pnr?: string; message?: string };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Booking Confirmed!</h2>
        <p className="text-lg mb-6">{message || 'Your ticket has been booked successfully.'}</p>
        {pnr && (
          <div className="mb-6">
            <div className="text-gray-700 text-lg font-semibold">Your Ticket PNR:</div>
            <div className="text-2xl font-mono text-blue-700 bg-blue-50 rounded-lg px-4 py-2 mt-2 inline-block border border-blue-200">{pnr}</div>
          </div>
        )}
        <button
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
