import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1">
        {/* Content will go here */}
      </main>
      
      <Footer />
    </div>
  );
};