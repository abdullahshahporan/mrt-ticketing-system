import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AuthService } from '../services/AuthService';
import { debugLog, trackNavigation, trackApiCall } from '../utils/debugHelper';

// Local helper to get current user info for this page (does not conflict with global AuthService)
const LocalAuthHelper = {
  getCurrentUserInfo: () => {
    debugLog('Dashboard', 'Getting current user info');

    // First check Firebase auth
    const user = AuthMiddleware.getCurrentUser();
    if (user && user.email) {
      debugLog('Dashboard', `Found authenticated user: ${user.email}`);
      return {
        email: user.email,
        name: user.displayName || 'MRT User'
      };
    }

    // Fallback to localStorage (for demo purposes)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        debugLog('Dashboard', 'Found user in localStorage', 'info', userData);
        return userData;
      } catch (e) {
        debugLog('Dashboard', 'Error parsing user from localStorage', 'error', e);
        return null;
      }
    }

    debugLog('Dashboard', 'No authenticated user found', 'warn');
    return null;
  }
};

interface CardDetail {
  cardNumber: string;
  balance: number;
  holdBalance: number;
  name: string;
  isActive: boolean;
  expiryDate: string;
  lastRecharge: string;
  lastUsed: string;
}

interface Transaction {
  id: string;
  type: 'RECHARGE' | 'TRIP';
  amount: number;
  date: string;
  description: string;
  station: string | null;
}

const VirtualCardDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'card' | 'transactions' | 'trips' | 'recharge'>('card');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<CardDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rechargeAmount, setRechargeAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      debugLog('Dashboard', 'Initializing auth');
      // Initialize auth middleware
      await AuthMiddleware.init();
      
      // Check authentication
  const user = LocalAuthHelper.getCurrentUserInfo();
      
      debugLog('Dashboard', 'Auth check result', 'info', user);
      
      if (!user) {
        debugLog('Dashboard', 'No authenticated user, redirecting to signin', 'warn');
        trackNavigation('dashboard', '/signin', { reason: 'unauthenticated' });
        navigate('/signin', { replace: true });
        return;
      }
      
      const userEmail = user.email;
      if (!userEmail) {
        debugLog('Dashboard', 'User missing email, redirecting to signin', 'warn');
        trackNavigation('dashboard', '/signin', { reason: 'missing_email' });
        navigate('/signin', { replace: true });
        return;
      }
      
      debugLog('Dashboard', 'User authenticated, fetching card details');
      // Fetch card details
  fetchCardDetails(userEmail);
    };
    
    initializeAuth();
  }, [navigate]);

  const fetchCardDetails = async (email: string) => {
    debugLog('Dashboard', `Fetching card details for: ${email}`);
    trackApiCall('/api/virtual-card/details', 'GET', { email });
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/virtual-card/details?email=${email}`);
      const data = await response.json();
      
      debugLog('Dashboard', 'Card details API response', 'info', data);
      
      if (!data.success) {
        debugLog('Dashboard', 'API returned error', 'error', data);
        throw new Error(data.message || 'Failed to fetch card details');
      }
      
      // Check if the card is active
      if (!data.data.isActive) {
        debugLog('Dashboard', 'Card is not active, redirecting to payment', 'warn');
        trackNavigation('dashboard', '/payment', { reason: 'inactive_card' });
        navigate('/payment', { replace: true });
        return;
      }
      
      // Store user email in localStorage as a fallback mechanism
      localStorage.setItem('user', JSON.stringify({
        email: email,
        name: data.data.name,
        authenticated: true,
        timestamp: new Date().toISOString()
      }));
      
      setCardDetails({
        cardNumber: data.data.cardNumber,
        balance: data.data.balance,
        holdBalance: data.data.holdBalance,
        name: data.data.name,
        isActive: data.data.isActive,
        expiryDate: data.data.expiryDate,
        lastRecharge: data.data.lastRecharge,
        lastUsed: data.data.lastUsed
      });
      
      setTransactions(data.data.recentTransactions);
      setIsLoading(false);
    } catch (err: any) {
      debugLog('Dashboard', 'Error fetching card details', 'error', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      // clear any fallback localStorage user info
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error signing out:', err);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rechargeAmount < 50) {
      setError('Minimum recharge amount is ৳50');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, you would call your API to process the payment
      const user = AuthService.getCurrentUserInfo();
      if (!user || !user.email) {
        setError('Unable to determine user email for payment. Please sign in again.');
        setIsLoading(false);
        return;
      }
      const userEmail = user.email;

      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          amount: rechargeAmount,
          paymentMethod: paymentMethod,
          userEmail: userEmail
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to process recharge');
      }
      
  // Refresh card details
  fetchCardDetails(userEmail);
      
      // Reset form
      setRechargeAmount(0);
      
      // Switch to card tab
      setActiveTab('card');
      
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Occurred</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cardDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Card Found</h2>
          <p className="text-gray-600 mb-6">You don't have an active Virtual MRT Card. Please create one first.</p>
          <button 
            onClick={() => navigate('/virtual-card')} 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Create Virtual Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Virtual MRT Card Dashboard</h1>
          <div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'card' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('card')}
          >
            Card Details
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'transactions' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transaction History
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'trips' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('trips')}
          >
            Trip History
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'recharge' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('recharge')}
          >
            Recharge Card
          </button>
        </div>

        {/* Card Details Tab */}
        {activeTab === 'card' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Virtual MRT Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-medium text-white mb-1">Virtual MRT Card</h2>
                      <p className="text-xs text-green-100">Dhaka Mass Rapid Transit</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${cardDetails.isActive ? 'bg-green-300' : 'bg-red-400'} mr-2`}></div>
                      <span className="text-xs font-medium text-green-100">
                        {cardDetails.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-xs text-green-100 mb-1">Card Number</p>
                    <div className="text-xl text-white font-mono tracking-wider">
                      {cardDetails.cardNumber.match(/.{1,4}/g)?.join(' ')}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-green-100 mb-1">Card Holder</p>
                        <p className="text-sm text-white">{cardDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-100 mb-1">Expires</p>
                        <p className="text-sm text-white">{new Date(cardDetails.expiryDate).toLocaleDateString('en-GB', {month: '2-digit', year: '2-digit'})}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-800 p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-green-100 mb-1">Available Balance</p>
                        <p className="text-xl text-white font-bold">৳{cardDetails.balance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-100 mb-1">Hold Balance</p>
                        <p className="text-sm text-white">৳{cardDetails.holdBalance.toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('recharge')}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Recharge Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Summary Info */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Card Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Last Recharge</p>
                    <p className="font-medium text-gray-900">{formatDate(cardDetails.lastRecharge)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Used</p>
                    <p className="font-medium text-gray-900">{formatDate(cardDetails.lastUsed)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Card Status</p>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full ${cardDetails.isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                      <p className="font-medium text-gray-900">{cardDetails.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Transaction History Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'RECHARGE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={transaction.type === 'RECHARGE' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.type === 'RECHARGE' ? '+' : '-'}৳{transaction.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {transaction.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Trip History Tab */}
        {activeTab === 'trips' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Trips</h3>
              
              {transactions.filter(t => t.type === 'TRIP').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No trip history found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trip ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fare
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions
                        .filter(transaction => transaction.type === 'TRIP')
                        .map(trip => (
                        <tr key={trip.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {trip.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {trip.station}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(trip.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            ৳{trip.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Recharge Card Tab */}
        {activeTab === 'recharge' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recharge Your Card</h3>
              
              <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Current Card Balance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Available Balance:</p>
                    <p className="text-lg font-bold text-gray-900">৳{cardDetails.balance.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hold Balance:</p>
                    <p className="text-base font-medium text-gray-700">৳{cardDetails.holdBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleRecharge}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Recharge Amount (৳)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      min="50"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Minimum recharge amount: ৳50</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <input
                          type="radio"
                          id="bkash"
                          name="paymentMethod"
                          value="bkash"
                          className="sr-only peer"
                          checked={paymentMethod === 'bkash'}
                          onChange={() => setPaymentMethod('bkash')}
                        />
                        <label
                          htmlFor="bkash"
                          className="flex cursor-pointer items-center justify-center rounded-md border py-3 px-4 text-sm font-medium shadow-sm peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-600"
                        >
                          bKash
                        </label>
                      </div>
                      
                      <div>
                        <input
                          type="radio"
                          id="nagad"
                          name="paymentMethod"
                          value="nagad"
                          className="sr-only peer"
                          checked={paymentMethod === 'nagad'}
                          onChange={() => setPaymentMethod('nagad')}
                        />
                        <label
                          htmlFor="nagad"
                          className="flex cursor-pointer items-center justify-center rounded-md border py-3 px-4 text-sm font-medium shadow-sm peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-600"
                        >
                          Nagad
                        </label>
                      </div>
                      
                      <div>
                        <input
                          type="radio"
                          id="rocket"
                          name="paymentMethod"
                          value="rocket"
                          className="sr-only peer"
                          checked={paymentMethod === 'rocket'}
                          onChange={() => setPaymentMethod('rocket')}
                        />
                        <label
                          htmlFor="rocket"
                          className="flex cursor-pointer items-center justify-center rounded-md border py-3 px-4 text-sm font-medium shadow-sm peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-600"
                        >
                          Rocket
                        </label>
                      </div>
                      
                      <div>
                        <input
                          type="radio"
                          id="bank_card"
                          name="paymentMethod"
                          value="bank_card"
                          className="sr-only peer"
                          checked={paymentMethod === 'bank_card'}
                          onChange={() => setPaymentMethod('bank_card')}
                        />
                        <label
                          htmlFor="bank_card"
                          className="flex cursor-pointer items-center justify-center rounded-md border py-3 px-4 text-sm font-medium shadow-sm peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-600"
                        >
                          Card
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || rechargeAmount < 50}
                      className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isLoading || rechargeAmount < 50 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Recharge ৳${rechargeAmount || 0}`
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualCardDashboard;