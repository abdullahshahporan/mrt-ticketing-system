import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';
import ProfileForm from './ProfileForm';

interface UserDashboardProps {
  userEmail: string;
  onSignOut: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userEmail, onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      console.log('User signed out successfully');
      onSignOut();
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleProfileComplete = (data: any) => {
    console.log('Profile completed with data:', data);
    // You can add additional logic here when profile is completed
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-6 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Virtual MRT Dashboard</h2>
            <p className="text-teal-50 text-sm sm:text-base">Welcome back, {userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="group bg-white text-teal-600 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 hover:bg-teal-50 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Form Component */}
      <ProfileForm 
        userEmail={userEmail} 
        onProfileComplete={handleProfileComplete}
      />
    </div>
  );
};

export default UserDashboard;