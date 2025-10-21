import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';

interface PaymentData {
  amount: number | string;
  paymentMethod: string;
  userEmail: string;
  cardNumber: string;
}

interface PaymentOptions {
  minimum_amount: number;
  block_money: number;
  currency: string;
  payment_methods: {
    [key: string]: {
      name: string;
      fee: number;
      available: boolean;
    };
  };
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string>('');
  const cardNumberFromState = location.state?.cardNumber || '';
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 200,
    paymentMethod: '',
    userEmail: '',
    cardNumber: cardNumberFromState
  });
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Check authentication
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/signin');
      return;
    }
    
    // Handle nullable email from Firebase auth
    const email = user.email || '';
    setUserEmail(email);
    setPaymentData(prev => ({ ...prev, userEmail: email }));
    
    // Verify user has completed profile
    verifyProfileStatus(email);
    
    // Fetch payment options
    fetchPaymentOptions();
  }, [navigate]);
  
  const verifyProfileStatus = async (email: string) => {
    try {
      const response = await fetch(`/api/virtual-card/status?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success) {
        // If profile doesn't exist, redirect to virtual card page to create profile
        if (!data.data.profileCompleted) {
          navigate('/virtual-card');
          return;
        }
        
        // If card is already active, redirect to dashboard
        if (data.data.hasActiveCard) {
          navigate('/virtual-card-dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Error verifying profile status:', error);
    }
  };

  const fetchPaymentOptions = async () => {
    try {
      const response = await fetch('/api/payment/options');
      const result = await response.json();
      
      if (result.success) {
        setPaymentOptions(result.data);
        setPaymentData(prev => ({ ...prev, amount: result.data.minimum_amount }));
      }
    } catch (error) {
      console.error('Error fetching payment options:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value) || 0) : value
    }));

    // Clear errors for this field
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentData(prev => ({ ...prev, paymentMethod: method }));
    if (errors.paymentMethod) {
      setErrors((prev: any) => ({ ...prev, paymentMethod: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    // Validate required fields before submission
    const validationErrors: {[key: string]: string} = {};
    
    // Check for empty amount or invalid amount
    if (paymentData.amount === '' || paymentData.amount === 0) {
      validationErrors.amount = 'Amount is required';
    } else if (paymentOptions && typeof paymentData.amount === 'number' && paymentData.amount < paymentOptions.minimum_amount) {
      validationErrors.amount = `Minimum amount is ৳${paymentOptions.minimum_amount}`;
    }
    
    // Check for payment method
    if (!paymentData.paymentMethod) {
      validationErrors.paymentMethod = 'Please select a payment method';
    }
    
    // If validation fails, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    
    // Convert amount to number for backend if it's a string
    const submitData = {
      ...paymentData,
      amount: typeof paymentData.amount === 'string' ? parseFloat(paymentData.amount) : paymentData.amount,
      card_number: paymentData.cardNumber
    };

    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`Payment successful! 🎉\n\nCard Number: ${result.data.card_number}\nBalance: ৳${result.data.balance}\nTransaction ID: ${result.data.transaction_id}`);
        // Redirect to dashboard if there's a redirect in the response or default to dashboard
        if (result.redirect) {
          navigate(result.redirect);
        } else {
          navigate('/virtual-card-dashboard');
        }
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.message || 'Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (field: string): string => {
    const error = errors[field];
    if (Array.isArray(error)) {
      return error[0];
    }
    return error || '';
  };

  if (!paymentOptions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual MRT Card Payment</h1>
          <p className="text-gray-600">Complete your payment to activate your Virtual MRT Card</p>
        </div>
        
        {/* Profile Status Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your profile has been created but payment is required to activate your Virtual MRT Card.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Payment Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Amount Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-semibold">৳</span>
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handleInputChange}
                  min={paymentOptions.minimum_amount}
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    getErrorMessage('amount')
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                  }`}
                />
              </div>
              {getErrorMessage('amount') && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {getErrorMessage('amount')}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Minimum amount: ৳{paymentOptions.minimum_amount} (includes ৳{paymentOptions.block_money} block money)
              </p>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(paymentOptions.payment_methods).map(([key, method]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePaymentMethodSelect(key)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentData.paymentMethod === key
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{method.name}</div>
                    {method.fee > 0 && (
                      <div className="text-sm text-gray-500">Fee: ৳{method.fee}</div>
                    )}
                  </button>
                ))}
              </div>
              {getErrorMessage('paymentMethod') && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {getErrorMessage('paymentMethod')}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Card Amount:</span>
                  <span>৳{paymentData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>৳0</span>
                </div>
                <div className="border-t pt-1 mt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>৳{paymentData.amount}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !paymentData.paymentMethod}
              className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                isLoading || !paymentData.paymentMethod
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Apply For Virtual MRT Card</span>
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate('/virtual-card')}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-300"
            >
              Back to Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;