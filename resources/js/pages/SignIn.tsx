import React, { useEffect } from 'react';
import { SignInScreen } from '../components/virtualcard';
import { useNavigate } from 'react-router-dom';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { debugLog, trackNavigation, trackApiCall, trackAuth } from '../utils/debugHelper';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      debugLog('SignIn', 'Checking existing auth state');
      await AuthMiddleware.init();
      
      if (AuthMiddleware.isAuthenticated()) {
        const email = AuthMiddleware.getCurrentUserEmail();
        trackAuth('Auto-Sign-In', true, { email });
        
        if (email) {
          handleRedirect(email);
        }
      } else {
        debugLog('SignIn', 'No authenticated user found');
      }
    };
    
    checkAuth();
  }, []);
  
  const handleRedirect = async (email: string) => {
    try {
      debugLog('SignIn', `Checking card status for: ${email}`);
      trackApiCall('/api/virtual-card/status', 'GET', { email });
      
      // Check if the user already has an active virtual card
      const response = await fetch(`/api/virtual-card/status?email=${email}`);
      const data = await response.json();
      
      debugLog('SignIn', 'API Response', 'info', data);
      
      if (data.success) {
        // Check the user's status and redirect
        const redirectPath = data.data.redirect || '/virtual-card';
        debugLog('SignIn', `Redirecting to ${redirectPath} based on status: ${data.data.status}`);
        
        // Store user data in localStorage as a backup authentication method
        localStorage.setItem('user', JSON.stringify({
          email: email,
          authenticated: true,
          timestamp: new Date().toISOString()
        }));
        
        // Force navigation with a slight delay to ensure state is updated
        setTimeout(() => {
          debugLog('SignIn', `Executing navigation to ${redirectPath}`);
          trackNavigation('signin', redirectPath, { status: data.data.status });
          
          // Use window.location for more reliable navigation if needed
          if (data.data.status === 'active') {
            // This is the critical path that might be failing
            debugLog('SignIn', 'Using direct navigation for dashboard');
            window.location.href = redirectPath;
          } else {
            navigate(redirectPath, { replace: true });
          }
        }, 200);
      } else {
        debugLog('SignIn', `API error: ${data.message}`, 'error');
        trackNavigation('signin', '/virtual-card', { error: data.message });
        navigate('/virtual-card', { replace: true });
      }
    } catch (error) {
      debugLog('SignIn', 'Error checking virtual card status', 'error', error);
      trackNavigation('signin', '/virtual-card', { error: String(error) });
      navigate('/virtual-card', { replace: true });
    }
  };

  const handleSignInSuccess = async (email: string) => {
    debugLog('SignIn', `Sign in successful for: ${email}`);
    trackAuth('Manual-Sign-In', true, { email });
    handleRedirect(email);
  };

  const handleBackToSignUp = () => {
    debugLog('SignIn', 'Navigating back to sign up');
    trackNavigation('signin', '/virtual-card');
    // Navigate back to virtual card page (sign up)
    navigate('/virtual-card', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <SignInScreen
            onSignInSuccess={handleSignInSuccess}
            onBackToSignUp={handleBackToSignUp}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;