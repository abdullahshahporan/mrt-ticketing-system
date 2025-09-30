import React, { useState, useEffect } from 'react';

interface LoaderProps {
  isVisible: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ isVisible }) => {
  const [loadingText, setLoadingText] = useState('Initializing system...');
  useEffect(() => {
    if (!isVisible) return;
    
    const messages = [
      'Initializing system...',
      'Connecting to MRT network...',
      'Loading stations data...',
      'Ready to board!'
    ];
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingText(messages[messageIndex]);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 to-red-50 dark:from-green-950 dark:to-red-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-gradient-to-r from-green-500/20 via-transparent to-red-500/20 animate-pulse"></div>
      </div>
      
      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* Logo Container with Animation */}
        <div className="relative">
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 w-32 h-32 border-4 border-green-500 rounded-full animate-spin border-t-red-500 border-r-red-500 border-b-green-500 border-l-green-500"></div>
          
          {/* Inner Circle Background */}
          <div className="w-32 h-32 flex items-center justify-center bg-gray-800 rounded-full border-2 border-green-600">
            <div className="relative w-20 h-20">
              {/* Simplified MRT Logo for Circular Design */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Red Arc inside circle */}
                <path d="M 40 100 A 60 60 0 0 1 160 100" 
                      fill="none" stroke="#DC2626" strokeWidth="12" className="animate-pulse" />
                
                {/* Green Train Body - Simplified for circle */}
                <g className="animate-bounce" style={{ animationDuration: '2s' }}>
                  {/* Main train body */}
                  <rect x="60" y="90" width="80" height="20" rx="10" fill="#059669" />
                  
                  {/* Train windows - dots */}
                  <circle cx="75" cy="100" r="2" fill="white" opacity="0.9" />
                  <circle cx="85" cy="100" r="2" fill="white" opacity="0.9" />
                  <circle cx="95" cy="100" r="2" fill="white" opacity="0.9" />
                  <circle cx="105" cy="100" r="2" fill="white" opacity="0.9" />
                  <circle cx="115" cy="100" r="2" fill="white" opacity="0.9" />
                  <circle cx="125" cy="100" r="2" fill="white" opacity="0.9" />
                  
                  {/* Front light */}
                  <circle cx="140" cy="100" r="3" fill="#FCD34D" />
                </g>
                
                {/* Red speed stripes - minimal for circular design */}
                <g className="animate-pulse">
                  <path d="M 120 85 L 135 82 L 137 88 L 122 91 Z" fill="#DC2626" opacity="0.8" />
                  <path d="M 125 112 L 140 109 L 142 115 L 127 118 Z" fill="#DC2626" opacity="0.6" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 animate-pulse">
            MRT Ticketing System
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            {loadingText}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full animate-pulse loading-progress"></div>
        </div>
        
        {/* Loading Dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      
      {/* Custom CSS for progress bar animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .loading-progress {
            animation: loading 2s ease-in-out;
            width: 0%;
          }
          
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 60%; }
            100% { width: 100%; }
          }
        `
      }} />
    </div>
  );
};
