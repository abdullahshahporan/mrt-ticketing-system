import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileStatusProps {
  email: string;
  onComplete?: (status: string) => void;
}

/**
 * ProfileStatus component - Checks the user's profile and card status
 * and redirects accordingly:
 * - If profile exists and card is active -> virtual-card-dashboard
 * - If profile exists but card is inactive -> payment
 * - If profile doesn't exist -> stays on current page for profile creation
 */
const ProfileStatus: React.FC<ProfileStatusProps> = ({ email, onComplete }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const response = await fetch(`/api/virtual-card/status?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.success) {
          setStatus(data.data.status);
          
          // Handle redirection based on status
          if (data.data.hasActiveCard) {
            // Has active card - redirect to dashboard
            navigate('/virtual-card-dashboard');
          } else if (data.data.paymentRequired) {
            // Profile exists but payment required
            navigate('/payment');
          } 
          // Otherwise stay on current page for profile creation
          
          // Notify parent component if callback provided
          if (onComplete) {
            onComplete(data.data.status);
          }
        } else {
          console.error('Failed to check profile status:', data.message);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (email) {
      checkProfileStatus();
    } else {
      setIsChecking(false);
    }
  }, [email, navigate, onComplete]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
        <span className="ml-2 text-sm text-gray-600">Checking account status...</span>
      </div>
    );
  }

  // Different status messages based on status
  if (status === 'payment_required') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-yellow-800 font-semibold">Payment Required</p>
            <p className="text-sm text-yellow-700">
              Your profile is complete, but payment is required to activate your Virtual MRT Card.
            </p>
            <button 
              onClick={() => navigate('/payment')}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
            >
              Go to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Don't show anything for other states
};

export default ProfileStatus;