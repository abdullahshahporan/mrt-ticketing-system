import React, { useState, useEffect } from 'react';

const NotificationSlider: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);
  
  const notifications = [
    "Emergency Helpline: 16263 | Available 24/7 for immediate assistance and safety support",
    "Service Update: Regular maintenance scheduled every Sunday 2:00 AM - 4:00 AM for optimal performance", 
    "Customer Care: 09666778899 | For booking support, inquiries, and technical assistance"
  ];

  // Create a continuous string with all notifications separated by icons
  const continuousText = notifications.join(" ★ ") + " ★ ";

  useEffect(() => {
    // Reset animation every 81 seconds (80s animation + 1s pause)
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 81000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-blue-900 bg-opacity-80 text-white">
      <div className="flex items-center h-10">
        {/* NEWS Label */}
        <div className="bg-black bg-opacity-30 px-4 py-2 flex-shrink-0 h-full flex items-center">
          <span className="text-sm font-bold tracking-wider">NEWS</span>
        </div>
        
        {/* Sliding Content Container */}
        <div className="flex-1 overflow-hidden h-full flex items-center">
          {/* Moving Text */}
          <div className="marquee-container">
            <div 
              key={animationKey}
              className="marquee-content-with-pause"
            >
              <span className="text-sm font-medium whitespace-nowrap">
                {continuousText}
              </span>
              <span className="text-sm font-medium whitespace-nowrap">
                {continuousText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSlider;