import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardCarousel } from './';
import ApplicationForm from './ApplicationForm';
import UserDashboard from './UserDashboard';
import { AuthMiddleware } from '../../middleware/AuthMiddleware';
import { User } from 'firebase/auth';

interface UserSession {
  email: string;
  isVerified: boolean;
}

const VirtualCard: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize authentication middleware and listen for changes
    const unsubscribe = AuthMiddleware.onAuthStateChange((user: User | null) => {
      if (user && AuthMiddleware.isEmailVerified()) {
        setUserSession({
          email: user.email || '',
          isVerified: user.emailVerified
        });
      } else {
        setUserSession(null);
      }
      setIsLoading(false);
    });

    // Initialize auth middleware
    AuthMiddleware.init();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignUpSuccess = (email: string) => {
    console.log('Sign up successful for:', email);
    // Stay on current screen to show email verification message
  };

  const handleSignOut = () => {
    setUserSession(null);
    // Stay on virtual-card page but show sign up form
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {userSession ? (
          // User is authenticated - Show Dashboard (Full Width)
          <div className="w-full">
            <UserDashboard
              userEmail={userSession.email}
              onSignOut={handleSignOut}
            />
          </div>
        ) : (
          // User not authenticated - Show Sign Up Form with Carousel
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Card Carousel */}
            <div className="order-2 lg:order-1">
              <CardCarousel />
            </div>
            
            {/* Right Side - Sign Up Form */}
            <div className="order-1 lg:order-2">
              <ApplicationForm 
                onSignUpSuccess={handleSignUpSuccess}
                onGoToSignIn={() => navigate('/signin')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualCard;