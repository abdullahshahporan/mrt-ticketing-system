import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';

interface CardDetails {
  cardNumber: string;
  balance: number;
  holdBalance: number;
  name: string;
  isActive: boolean;
  expiryDate?: string;
  lastRecharge?: string;
  lastUsed?: string;
  recentTransactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'RECHARGE' | 'TRIP' | 'REFUND';
  amount: number;
  date: string;
  description: string;
  station?: string;
}

const VirtualCardDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'recharge'>('overview');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (!user) {
          navigate('/signin');
          return;
        }
        
        setUserEmail(user.email || '');
        fetchCardDetails(user.email || '');
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/signin');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchCardDetails = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/virtual-card/details?email=${encodeURIComponent(email)}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch card details');
      }

      const data = await response.json();
      if (data.success) {
        setCardDetails(data.data);
      } else {
        throw new Error(data.message || 'Failed to load card details');
      }
    } catch (error) {
      console.error('Error fetching card details:', error);
      alert('Failed to load your card details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleRecharge = () => {
    // Navigate to recharge page
    navigate('/virtual-card/recharge');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your Virtual MRT Card...</p>
        </div>
      </div>
    );
  }

  if (!cardDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Card Found</h2>
          <p className="text-gray-600 mb-6">You don't have an active Virtual MRT Card. Would you like to apply for one?</p>
          <button 
            onClick={() => navigate('/virtual-card')} 
            className="w-full bg-teal-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-teal-700 transition-colors"
          >
            Apply for Virtual MRT Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with card preview */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center">
            {/* Card Info */}
            <div className="text-white mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Virtual MRT Card</h1>
              <p className="opacity-80 text-sm sm:text-base">Welcome, {cardDetails.name}</p>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Card Display */}
          <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur px-6 py-8 sm:p-8">
            <div className="max-w-md mx-auto bg-gradient-to-r from-blue-800 to-indigo-900 rounded-xl p-6 shadow-lg relative overflow-hidden">
              {/* Card Design Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 bg-opacity-20 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400 bg-opacity-20 rounded-full -ml-12 -mb-12"></div>
              
              {/* Card Logo */}
              <div className="flex items-center mb-6">
                <div className="bg-white bg-opacity-90 rounded-lg p-2 mr-2">
                  <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm opacity-80">Bangladesh</p>
                  <h3 className="text-white font-bold">DHAKA MRT</h3>
                </div>
              </div>
              
              {/* Card Number */}
              <div className="mb-6">
                <p className="text-blue-200 text-xs mb-1">Card Number</p>
                <p className="text-white text-xl font-mono font-semibold tracking-wider">
                  {cardDetails.cardNumber.match(/.{1,4}/g)?.join(' ')}
                </p>
              </div>
              
              {/* Card Holder & Expiry */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-blue-200 text-xs mb-1">Card Holder</p>
                  <p className="text-white font-medium">{cardDetails.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-xs mb-1">Available Balance</p>
                  <p className="text-white font-bold">৳ {cardDetails.balance.toFixed(2)}</p>
                  <p className="text-blue-200 text-xs mt-1">Hold Balance</p>
                  <p className="text-white font-medium">৳ {cardDetails.holdBalance.toFixed(2)}</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-1 ${cardDetails.isActive ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-white opacity-90">
                    {cardDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg shadow-sm mb-1">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'overview'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'trips'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
              onClick={() => setActiveTab('trips')}
            >
              Trip History
            </button>
            <button
              className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'recharge'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
              onClick={() => setActiveTab('recharge')}
            >
              Recharge
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Balance */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Card Balance</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Available Balance:</span>
                      <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded font-medium">Available</span>
                    </div>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-bold text-gray-900">৳{cardDetails.balance.toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-500">BDT</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Hold Balance:</span>
                      <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded font-medium">Security Hold</span>
                    </div>
                    <div className="flex items-baseline mt-1">
                      <span className="text-xl font-semibold text-gray-700">৳{cardDetails.holdBalance.toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-500">BDT</span>
                    </div>
                  </div>
                  <button
                    onClick={handleRecharge}
                    className="mt-4 w-full bg-teal-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-teal-700 transition-colors"
                  >
                    Recharge Now
                  </button>
                </div>

                {/* Card Info */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Number:</span>
                      <span className="font-medium text-gray-900">{cardDetails.cardNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${cardDetails.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {cardDetails.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {cardDetails.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry Date:</span>
                        <span className="font-medium text-gray-900">{cardDetails.expiryDate}</span>
                      </div>
                    )}
                    {cardDetails.lastRecharge && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Recharged:</span>
                        <span className="font-medium text-gray-900">{cardDetails.lastRecharge}</span>
                      </div>
                    )}
                    {cardDetails.lastUsed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Used:</span>
                        <span className="font-medium text-gray-900">{cardDetails.lastUsed}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                {cardDetails.recentTransactions.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cardDetails.recentTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{transaction.description}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${transaction.type === 'RECHARGE' ? 'bg-green-100 text-green-800' : 
                                transaction.type === 'REFUND' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'}`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right
                              ${transaction.type === 'RECHARGE' || transaction.type === 'REFUND' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'RECHARGE' || transaction.type === 'REFUND' ? '+' : '-'}৳{transaction.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No recent transactions</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip History</h3>
              {cardDetails.recentTransactions.filter(t => t.type === 'TRIP').length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fare</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cardDetails.recentTransactions
                        .filter(t => t.type === 'TRIP')
                        .map((trip) => (
                        <tr key={trip.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{trip.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{trip.station}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{trip.description}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right text-red-600">
                            -৳{trip.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No trip history available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recharge' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Recharge Your Card</h3>
              <div className="max-w-lg mx-auto">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                  <h4 className="font-medium text-gray-800 mb-4">Card Balance Details</h4>
                  
                  <div className="mb-4">
                    <span className="text-gray-600 text-sm">Available Balance:</span>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-bold text-gray-900">৳{cardDetails.balance.toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-500">BDT</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 text-sm">Hold Balance:</span>
                    <div className="flex items-baseline mt-1">
                      <span className="text-xl font-semibold text-gray-700">৳{cardDetails.holdBalance.toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-500">BDT</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recharge Amount (৳)
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      placeholder="Enter amount (minimum ৳100)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Minimum recharge amount: ৳100</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50">
                        <img src="/images/payment/bkash.png" alt="bKash" className="h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium text-gray-800">bKash</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50">
                        <img src="/images/payment/nagad.png" alt="Nagad" className="h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium text-gray-800">Nagad</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      className="w-full bg-teal-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-teal-700 transition-colors"
                    >
                      Proceed to Recharge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualCardDashboard;