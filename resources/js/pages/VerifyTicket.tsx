import React, { useState } from 'react';
import { Button } from '@ui/button';

interface IndividualTicket {
  pnr: string;
  ticket_number: number;
  status: string;
  base_fare: number;
  is_expired: boolean;
  used_at: string | null;
  minutes_remaining: number;
}

interface BookingDetails {
  base_pnr: string;
  from_station: string;
  to_station: string;
  total_tickets: number;
  active_tickets: number;
  used_tickets: number;
  expired_tickets: number;
  base_fare: number;
  total_fare: number;
  booking_time: string;
  valid_until: string;
  is_expired: boolean;
  minutes_remaining: number | null;
  tickets: IndividualTicket[];
}

interface VerificationResult {
  success: boolean;
  valid: boolean;
  booking?: BookingDetails;
  message?: string;
}

const VerifyTicket: React.FC = () => {
  const [pnrNumber, setPnrNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPnrNumber(value);
    
    if (error) {
      setError('');
    }
  };

  const validatePNR = (): boolean => {
    if (!pnrNumber.trim()) {
      setError('PNR Number is required');
      return false;
    }
    
    if (!pnrNumber.startsWith('MRT')) {
      setError('PNR must start with MRT');
      return false;
    }
    
    if (pnrNumber.length !== 12) {
      setError('PNR must be 12 characters (MRT + 9 digits)');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePNR()) {
      return;
    }
    
    setIsLoading(true);
    setVerificationResult(null);
    
    try {
      const response = await fetch(`/test-verify/${pnrNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({
        success: false,
        valid: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStationName = (stationId: string): string => {
    const stationNames: { [key: string]: string } = {
      'uttara_north': 'Uttara North',
      'uttara_center': 'Uttara Center',
      'uttara_south': 'Uttara South',
      'pallabi': 'Pallabi',
      'mirpur_11': 'Mirpur 11',
      'mirpur_10': 'Mirpur 10',
      'kazipara': 'Kazipara',
      'shewrapara': 'Shewrapara',
      'agargaon': 'Agargaon',
      'bijoy_sarani': 'Bijoy Sarani',
      'farmgate': 'Farmgate',
      'karwan_bazar': 'Karwan Bazar',
      'shahbag': 'Shahbag',
      'dhaka_university': 'Dhaka University',
      'bangladesh_secretariat': 'Bangladesh Secretariat',
      'motijheel': 'Motijheel'
    };
    return stationNames[stationId] || stationId;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'used': return 'text-blue-600 bg-blue-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Verify Your One Time Ticket</h1>
          <p className="text-lg text-gray-600">Enter your PNR number to verify your instant booking</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Verification Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ticket Verification</h2>
            
            <form onSubmit={handleVerify} className="space-y-6">
              {/* PNR Number Field */}
              <div>
                <label htmlFor="pnrNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  PNR Number *
                </label>
                <input
                  type="text"
                  id="pnrNumber"
                  name="pnrNumber"
                  value={pnrNumber}
                  onChange={handleInputChange}
                  placeholder="Enter PNR (e.g., MRT123456789)"
                  maxLength={12}
                  className={`w-full px-4 py-3 border rounded-lg text-lg font-mono focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>
              
              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify Ticket
                  </div>
                )}
              </Button>
            </form>
            
            {/* Helper Text */}
            <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-sm font-semibold text-teal-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Need Help?
              </h3>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• PNR is found on your booking confirmation</li>
                <li>• Format: MRT followed by 9 digits</li>
                <li>• One-time tickets are valid for 1 hour</li>
                <li>• Contact support if you're having trouble</li>
              </ul>
            </div>
          </div>
          
          {/* Right Side - Verification Result */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Verification Result</h2>
            
            {!verificationResult ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">Enter your PNR and verify to see ticket information</p>
              </div>
            ) : verificationResult.success && verificationResult.valid && verificationResult.booking ? (
              <div className="space-y-4">
                {/* Success Header */}
                <div className="flex items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-green-800 font-bold text-lg">Booking Verified Successfully</span>
                    <p className="text-green-600 text-sm">{verificationResult.booking.total_tickets} {verificationResult.booking.total_tickets === 1 ? 'ticket' : 'tickets'} found</p>
                  </div>
                </div>
                
                {/* Booking Summary */}
                <div className="space-y-3">
                  {/* Base PNR */}
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border-2 border-teal-300">
                    <p className="text-xs text-teal-700 uppercase tracking-wide font-semibold mb-1">Base PNR</p>
                    <p className="font-bold text-2xl font-mono text-teal-800">{verificationResult.booking.base_pnr}</p>
                  </div>
                  
                  {/* Journey Details */}
                  <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-3">Journey Details</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">From</p>
                        <p className="font-bold text-lg text-gray-900">{getStationName(verificationResult.booking.from_station)}</p>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="relative">
                          <div className="h-1 bg-teal-300 rounded"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border-2 border-teal-400">
                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">To</p>
                        <p className="font-bold text-lg text-gray-900">{getStationName(verificationResult.booking.to_station)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ticket Summary Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                      <p className="text-xs text-green-600 font-semibold uppercase">Active</p>
                      <p className="text-2xl font-bold text-green-700">{verificationResult.booking.active_tickets}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                      <p className="text-xs text-blue-600 font-semibold uppercase">Used</p>
                      <p className="text-2xl font-bold text-blue-700">{verificationResult.booking.used_tickets}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                      <p className="text-xs text-red-600 font-semibold uppercase">Expired</p>
                      <p className="text-2xl font-bold text-red-700">{verificationResult.booking.expired_tickets}</p>
                    </div>
                  </div>
                  
                  {/* Fare Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Per Ticket</p>
                      <p className="font-bold text-2xl text-gray-900">৳{verificationResult.booking.base_fare}</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
                      <p className="text-xs text-teal-700 uppercase tracking-wide font-semibold mb-1">Total Fare</p>
                      <p className="font-bold text-2xl text-teal-600">৳{verificationResult.booking.total_fare}</p>
                    </div>
                  </div>
                  
                  {/* Timing Information */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 uppercase tracking-wide font-semibold mb-3">Validity Information</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Booked At:</span>
                        <span className="font-semibold text-gray-900">{formatDateTime(verificationResult.booking.booking_time)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valid Until:</span>
                        <span className="font-semibold text-gray-900">{formatDateTime(verificationResult.booking.valid_until)}</span>
                      </div>
                      {!verificationResult.booking.is_expired && verificationResult.booking.minutes_remaining !== null && (
                        <div className="mt-3 p-3 bg-white rounded border border-blue-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-700">Time Remaining:</span>
                            <span className="text-lg font-bold text-blue-600">{Math.floor(verificationResult.booking.minutes_remaining)} minutes</span>
                          </div>
                          <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((verificationResult.booking.minutes_remaining / 60) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Individual Tickets List */}
                  <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Individual Tickets</h3>
                      <span className="text-sm text-gray-500">Total: {verificationResult.booking.total_tickets}</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {verificationResult.booking.tickets.map((ticket, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg border-2 ${
                            ticket.status === 'active' ? 'bg-green-50 border-green-300' :
                            ticket.status === 'used' ? 'bg-blue-50 border-blue-300' :
                            'bg-red-50 border-red-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-mono font-bold text-sm text-gray-800">{ticket.pnr}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Ticket #{ticket.ticket_number} • ৳{ticket.base_fare}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                {ticket.status.toUpperCase()}
                              </span>
                              {ticket.used_at && (
                                <p className="text-xs text-gray-500 mt-1">Used: {new Date(ticket.used_at).toLocaleTimeString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Expired Warning */}
                  {verificationResult.booking.is_expired && (
                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-semibold text-red-800">Booking Expired</p>
                          <p className="text-sm text-red-600 mt-1">All tickets have exceeded the 1-hour validity period and can no longer be used.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-600 font-semibold text-lg mb-2">Verification Failed</p>
                <p className="text-gray-600">{verificationResult.message || 'Invalid PNR or ticket not found'}</p>
                <p className="text-sm text-gray-500 mt-4">Please check your PNR and try again</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTicket;