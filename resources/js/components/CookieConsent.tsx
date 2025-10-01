import React, { useState, useEffect } from 'react';
import { 
  hasGivenConsent, 
  isConsentExpired, 
  setCookieConsent
} from '../utils/cookies';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already given consent and it hasn't expired
    const hasConsent = hasGivenConsent();
    const consentExpired = isConsentExpired();
    
    if (!hasConsent || consentExpired) {
      // Show the consent banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onAccept?.();
    }, 300);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onDecline?.();
    }, 300);
  };

  const handleCustomize = () => {
    // For now, just accept - can be extended later for detailed preferences
    handleAccept();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Cookie Consent Banner */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-500 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              
              {/* Content */}
              <div className="flex-1 lg:pr-8">
                <div className="flex items-start space-x-3">
                  {/* Cookie Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-3 5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🍪 We use cookies to enhance your experience
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We use cookies to provide you with the best possible experience on our MRT Ticketing System. 
                      These cookies help us remember your preferences, analyze site traffic, and improve our services. 
                      By continuing to use our site, you consent to our use of cookies.
                    </p>
                    <div className="mt-2">
                      <a 
                        href="/privacy-policy" 
                        className="text-xs text-green-600 hover:text-green-700 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more about our Privacy Policy
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Decline
                </button>
                
                <button
                  onClick={handleCustomize}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md hover:bg-green-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Customize
                </button>
                
                <button
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;