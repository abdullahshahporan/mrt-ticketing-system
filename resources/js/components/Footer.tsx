import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* MRT Logo */}
              <div className="w-8 h-8">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#10B981" strokeWidth="8" />
                  <path d="M 40 100 A 60 60 0 0 1 160 100" 
                        fill="none" stroke="#DC2626" strokeWidth="6" />
                  <rect x="60" y="90" width="80" height="20" rx="10" fill="#059669" />
                  <circle cx="75" cy="100" r="2" fill="white" />
                  <circle cx="90" cy="100" r="2" fill="white" />
                  <circle cx="105" cy="100" r="2" fill="white" />
                  <circle cx="120" cy="100" r="2" fill="white" />
                  <circle cx="135" cy="100" r="2" fill="white" />
                  <circle cx="145" cy="100" r="3" fill="#FCD34D" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">MRT Ticketing System</h3>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              Your convenient and efficient way to travel across the metro rail network. Book tickets, plan your journey, and enjoy seamless travel experience.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link to="/one-time-ticket/instant" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Book Tickets</Link></li>
              <li><Link to="/route-map" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Route Map</Link></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Schedules</a></li>
              <li><Link to="/fare-calculator" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Fare Calculator</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Help Center</Link></li>
              <li><Link to="/contact-us" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Unified Footer Section - Always Visible */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Left side - Logo and Title (visible on all screens) */}
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <div className="w-5 h-5">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#10B981" strokeWidth="8" />
                  <path d="M 40 100 A 60 60 0 0 1 160 100" 
                        fill="none" stroke="#DC2626" strokeWidth="6" />
                  <rect x="60" y="90" width="80" height="20" rx="10" fill="#059669" />
                  <circle cx="75" cy="100" r="2" fill="white" />
                  <circle cx="90" cy="100" r="2" fill="white" />
                  <circle cx="105" cy="100" r="2" fill="white" />
                  <circle cx="120" cy="100" r="2" fill="white" />
                  <circle cx="135" cy="100" r="2" fill="white" />
                  <circle cx="145" cy="100" r="3" fill="#FCD34D" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-gray-900">MRT Ticketing</h3>
            </div>
            
            {/* Center - Copyright */}
            <p className="text-gray-600 text-xs text-center mb-2 sm:mb-0">
              © 2025 MRT Ticketing System. All rights reserved.
            </p>
            
            {/* Right side - Developer Credit */}
            <div className="flex items-center space-x-1">
              <span className="text-gray-600 text-xs">Developed By:</span>
              <a 
                href="https://github.com/abdullahshahporan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium text-xs transition-colors duration-200 hover:underline"
              >
                Abdullah Md. Shahporan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
export default Footer;