import React, { useState } from 'react';
import { Button } from '@ui/button';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo, Title and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 flex-shrink-0">
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
              
              <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
                MRT Ticketing System
              </h1>
              <h1 className="text-lg font-semibold text-gray-900 sm:hidden">
                MRT
              </h1>
            </div>
            
            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
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
          
          {/* Right side - Auth buttons and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
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
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 bg-white shadow-lg rounded-b-lg">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-2 mb-4">
              <Button variant="ghost" size="default" className="text-green-600 bg-green-50 text-base font-medium px-4 py-3 justify-start">
                🏠 Home
              </Button>
              <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-base font-medium px-4 py-3 justify-start">
                ✓ Verify Ticket
              </Button>
              <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-base font-medium px-4 py-3 justify-start">
                🗺️ Route Info
              </Button>
              <Button variant="ghost" size="default" className="text-blue-600 hover:text-green-600 blink font-semibold text-base px-4 py-3 justify-start">
                📞 Contact Us
              </Button>
            </nav>
            
            {/* Quick Links Section */}
            <div className="border-t border-gray-200 pt-3 mb-4">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2 px-4">Quick Links</h4>
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  🎫 Book Tickets
                </Button>
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  🗺️ Route Map
                </Button>
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  ⏰ Schedules
                </Button>
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  💰 Fare Calculator
                </Button>
              </div>
            </div>
            
            {/* Support Section */}
            <div className="border-t border-gray-200 pt-3 mb-4">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2 px-4">Support</h4>
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  ❓ Help Center
                </Button>
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  📧 Contact Us
                </Button>
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  📄 Terms of Service
                </Button>
                <Button variant="ghost" size="default" className="text-gray-600 hover:text-green-600 text-sm font-medium px-4 py-2 justify-start">
                  🔒 Privacy Policy
                </Button>
              </div>
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 px-4 border-t border-gray-200 pt-3">
              <Button variant="outline" size="default" className="text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-600 text-base font-medium py-3 w-full">
                👤 Sign In
              </Button>
              <Button size="default" className="bg-green-600 hover:bg-green-700 text-white text-base font-medium py-3 w-full">
                🔐 Admin Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;