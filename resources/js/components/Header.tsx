import React from 'react';
import { Button } from '@ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-3">
            {/* MRT Logo */}
            <div className="w-8 h-8">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Simplified circular logo for header */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#10B981" strokeWidth="8" />
                
                {/* Red arc */}
                <path d="M 40 100 A 60 60 0 0 1 160 100" 
                      fill="none" stroke="#DC2626" strokeWidth="6" />
                
                {/* Green train */}
                <rect x="60" y="90" width="80" height="20" rx="10" fill="#059669" />
                
                {/* Train windows */}
                <circle cx="75" cy="100" r="2" fill="white" />
                <circle cx="90" cy="100" r="2" fill="white" />
                <circle cx="105" cy="100" r="2" fill="white" />
                <circle cx="120" cy="100" r="2" fill="white" />
                <circle cx="135" cy="100" r="2" fill="white" />
                
                {/* Front light */}
                <circle cx="145" cy="100" r="3" fill="#FCD34D" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900">
              MRT Ticketing System
            </h1>
          </div>
          
          {/* Right side - Navigation buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
export default Header;