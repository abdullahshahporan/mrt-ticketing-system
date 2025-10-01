import React, { useState } from 'react';

interface VerifyTicketForm {
  pnrNumber: string;
  mobileNumber: string;
}

interface VerificationResult {
  isValid: boolean;
  ticket?: {
    pnr: string;
    passengerName: string;
    from: string;
    to: string;
    journeyDate: string;
    seatNumber: string;
    status: string;
  };
  message?: string;
}

const VerifyTicket: React.FC = () => {
  const [formData, setFormData] = useState<VerifyTicketForm>({
    pnrNumber: '',
    mobileNumber: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.pnrNumber.trim()) {
      newErrors.pnrNumber = 'PNR Number is required';
    } else if (formData.pnrNumber.length < 6) {
      newErrors.pnrNumber = 'PNR Number must be at least 6 characters';
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[0-9]{11}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile Number must be 11 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setVerificationResult(null);
    
    try {
      const response = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({
        isValid: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Ticket</h1>
          <p className="text-gray-600">Enter your PNR number and mobile number to verify your booking</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Verification Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Ticket Verification</h2>
            
            <form onSubmit={handleVerify} className="space-y-6">
              {/* PNR Number Field */}
              <div>
                <label htmlFor="pnrNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  PNR Number *
                </label>
                <input
                  type="text"
                  id="pnrNumber"
                  name="pnrNumber"
                  value={formData.pnrNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your PNR number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.pnrNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pnrNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.pnrNumber}</p>
                )}
              </div>
              
              {/* Mobile Number Field */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                )}
              </div>
              
              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Ticket'
                )}
              </button>
            </form>
            
            {/* Helper Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Need Help?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• PNR number is found on your booking confirmation</li>
                <li>• Mobile number should match your booking details</li>
                <li>• Contact support if you're having trouble verifying</li>
              </ul>
            </div>
          </div>
          
          {/* Right Side - Verification Result */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Verification Result</h2>
            
            {!verificationResult ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Enter your details and verify to see ticket information</p>
              </div>
            ) : verificationResult.isValid ? (
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-green-800 font-medium">Ticket Verified Successfully</span>
                </div>
                
                {verificationResult.ticket && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">PNR Number</p>
                        <p className="font-semibold">{verificationResult.ticket.pnr}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                        <p className="font-semibold text-green-600">{verificationResult.ticket.status}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Passenger Name</p>
                      <p className="font-semibold">{verificationResult.ticket.passengerName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">From</p>
                        <p className="font-semibold">{verificationResult.ticket.from}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">To</p>
                        <p className="font-semibold">{verificationResult.ticket.to}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Journey Date</p>
                        <p className="font-semibold">{verificationResult.ticket.journeyDate}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Seat Number</p>
                        <p className="font-semibold">{verificationResult.ticket.seatNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium mb-2">Verification Failed</p>
                <p className="text-gray-600">{verificationResult.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTicket;