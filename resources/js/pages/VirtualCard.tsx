import React from 'react';
import { VirtualCard as VirtualCardComponent } from '../components/virtualcard';

const VirtualCard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content - Complete Authentication Flow */}
      <div className="py-8">
        <VirtualCardComponent />
      </div>
    </div>
  );
};

export default VirtualCard;