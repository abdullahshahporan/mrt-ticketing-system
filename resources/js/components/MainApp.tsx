import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import CookieConsent from './CookieConsent';
import VerifyTicket from '../pages/VerifyTicket';
import OneTimeTicketCard from './cards/OneTimeTicketCard';
import VirtualMRTCard from './cards/VirtualMRTCard';

// Home Page Component
const HomePage: React.FC = () => {
  const handleOneTimeTicketSelect = () => {
    console.log('One Time Ticket selected');
    // TODO: Navigate to one-time ticket booking page
  };

  const handleVirtualCardSelect = () => {
    console.log('Virtual MRT Card selected');
    // TODO: Navigate to virtual card registration/management page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
              MRT Journey
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience seamless metro rail travel with our digital ticketing solutions. 
            Choose the option that best fits your travel needs.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <OneTimeTicketCard onSelect={handleOneTimeTicketSelect} />
          <VirtualMRTCard onSelect={handleVirtualCardSelect} />
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose MRT Digital Ticketing?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Skip the queues with instant digital booking and contactless entry</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">Advanced encryption and secure payment processing for peace of mind</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Savings</h3>
              <p className="text-gray-600">Get discounts with virtual cards and real-time fare calculations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MainApp: React.FC = () => {
  const handleCookieAccept = () => {
    console.log('User accepted cookies');
    // You can add analytics tracking or other logic here
  };

  const handleCookieDecline = () => {
    console.log('User declined cookies');
    // You can add logic for declined cookies here
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        {/* Main Content Area with Routing */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/verify-ticket" element={<VerifyTicket />} />
            <Route path="/route-info" element={<HomePage />} />
          </Routes>
        </main>
        
        <Footer />
        
        {/* Cookie Consent Banner */}
        <CookieConsent 
          onAccept={handleCookieAccept}
          onDecline={handleCookieDecline}
        />
      </div>
    </Router>
  );
};