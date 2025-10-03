import React from 'react';
import { SignInScreen } from '../components/virtualcard';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleSignInSuccess = (email: string) => {
    console.log('Sign in successful for:', email);
    // Redirect to virtual card dashboard after successful sign in
    navigate('/virtual-card');
  };

  const handleBackToSignUp = () => {
    // Navigate back to virtual card page (sign up)
    navigate('/virtual-card');
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