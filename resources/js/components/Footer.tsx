import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <p className="text-gray-600 max-w-md">
              Your convenient and efficient way to travel across the metro rail network. 
              Book tickets, plan your journey, and enjoy seamless travel experience.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Book Tickets</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Route Map</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Schedules</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Fare Calculator</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Empty div for spacing balance - Left */}
            <div className="hidden sm:block w-48"></div>
            
            {/* Copyright - Center */}
            <p className="text-gray-600 text-sm text-center mb-4 sm:mb-0">
              © 2025 MRT Ticketing System. All rights reserved.
            </p>
            
            {/* Developer Credit - Right */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">Developed By:</span>
              <a 
                href="https://github.com/abdullahshahporan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200 hover:underline"
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