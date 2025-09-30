import React from 'react';
import { Button } from '@ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo, Title and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo and Title */}
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
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="default" className="text-green-600 bg-green-50 text-base font-medium px-4 py-2">
                Home
              </Button>
              <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-base font-medium px-4 py-2">
                Verify Ticket
              </Button>
              <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-base font-medium px-4 py-2">
                Route Info
              </Button>
            </nav>
          </div>
          
          {/* Right side - Auth buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="default" className="text-blue-600 hover:text-green-600 blink font-semibold text-base px-4 py-2">
              Contact Us
            </Button>
            <Button variant="outline" size="default" className="text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-600 h-10 text-base font-medium px-4 py-2">
              Sign In
            </Button>
            <Button size="default" className="bg-green-600 hover:bg-green-700 text-white h-10 text-base font-medium px-4 py-2">
              Admin Login
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 border-t border-gray-100 pt-3">
          <nav className="flex items-center space-x-1 overflow-x-auto">
            <Button variant="ghost" size="sm" className="text-green-600 bg-green-50 text-sm font-medium whitespace-nowrap px-3 py-2">
              Home
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600 text-sm font-medium whitespace-nowrap px-3 py-2">
              Verify Ticket
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600 text-sm font-medium whitespace-nowrap px-3 py-2">
              Route Info
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-green-600 text-sm font-semibold whitespace-nowrap blink px-3 py-2">
              Contact Us
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export { Header };
export default Header;