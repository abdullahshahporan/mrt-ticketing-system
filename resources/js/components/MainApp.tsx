import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import NotificationSlider from './NotificationSlider';
import CookieConsent from './CookieConsent';
import VerifyTicket from '../pages/VerifyTicket';
import OneTimeTicket from '../pages/OneTimeTicket';
import InstantBooking from '../pages/InstantBooking';
import ScheduleBooking from '../pages/ScheduleBooking';
import FareCalculator from '../pages/FareCalculator';
import RouteMap from '../pages/RouteMap';
import VirtualCard from '../pages/VirtualCard';
import VirtualCardDashboard from '../pages/VirtualCardDashboard';
import Payment from './virtualcard/Payment';
import SignIn from '../pages/SignIn';
import OneTimeTicketCard from './cards/OneTimeTicketCard';
import VirtualMRTCard from './cards/VirtualMRTCard';

// Simple Support Page Components
const HelpCenter = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Help Center</h1>
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">How do I book a ticket?</h3>
            <p className="text-gray-600">Select your stations, choose travel time, and proceed with payment through our booking system.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Can I cancel my booking?</h3>
            <p className="text-gray-600">Yes, you can cancel bookings up to 30 minutes before departure time.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">What payment methods are accepted?</h3>
            <p className="text-gray-600">We accept bKash, Nagad, Rocket, and major credit/debit cards.</p>
          </div>
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Need More Help?</h2>
        <p className="text-gray-600">Contact us at <span className="font-medium text-green-600">09666778899</span> or email <span className="font-medium text-green-600">support@mrtticket.gov.bd</span></p>
      </div>
    </div>
  </div>
);

const ContactUs = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Customer Care</h3>
            <p className="text-green-600 font-medium">09666778899</p>
            <p className="text-sm text-gray-500">24/7 Available</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Emergency Helpline</h3>
            <p className="text-red-600 font-medium">16263</p>
            <p className="text-sm text-gray-500">Emergency Support</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Email Support</h3>
            <p className="text-blue-600 font-medium">support@mrtticket.gov.bd</p>
            <p className="text-sm text-gray-500">Response within 24 hours</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Office Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Address</h3>
            <p className="text-gray-600">Dhaka Mass Transit Company Limited<br/>Sher-e-Bangla Nagar, Dhaka-1207</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Office Hours</h3>
            <p className="text-gray-600">Saturday - Thursday: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TermsOfService = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Service Usage</h2>
          <p className="text-gray-600">By using our MRT Ticketing System, you agree to these terms. Tickets are valid for the specified journey and time period only.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Booking Terms</h2>
          <p className="text-gray-600">All bookings are subject to availability. Payments must be completed to confirm reservations.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Payment</h2>
          <p className="text-gray-600">All payments are processed securely through our payment gateway. Refunds are processed as per our cancellation policy.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Responsibilities</h2>
          <p className="text-gray-600">Users must provide accurate information and comply with metro regulations during travel.</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">For questions about these terms, contact us at legal@mrtticket.gov.bd</p>
      </div>
    </div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
          <p className="text-gray-600">We collect personal information you provide directly, such as name, email, phone number, and payment information for ticket booking purposes.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
          <p className="text-gray-600">Your information is used to process bookings, provide customer support, and improve our services.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
          <p className="text-gray-600">We implement appropriate security measures to protect your personal information against unauthorized access and disclosure.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h2>
          <p className="text-gray-600">You have the right to access, update, or delete your personal information. Contact us for any privacy-related requests.</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">For privacy questions, contact us at privacy@mrtticket.gov.bd</p>
      </div>
    </div>
  </div>
);

// Home Page Component
const HomePage: React.FC = () => {
  const handleOneTimeTicketSelect = () => {
    // Navigate to one-time ticket page
    window.location.href = '/one-time-ticket';
  };

  const handleVirtualCardSelect = () => {
    window.location.href = '/virtual-card';
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
        <NotificationSlider />
        
        {/* Main Content Area with Routing */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/verify-ticket" element={<VerifyTicket />} />
            <Route path="/one-time-ticket" element={<OneTimeTicket />} />
            {/* Canonical path for instant booking (server-side routes point here) */}
            <Route path="/one-time-ticket/instant" element={<InstantBooking />} />
            {/* Compatibility redirect: old path -> canonical path */}
            <Route path="/instant-booking" element={<Navigate to="/one-time-ticket/instant" replace />} />
            {/* Canonical path for schedule booking */}
            <Route path="/one-time-ticket/schedule-booking" element={<ScheduleBooking />} />
            {/* Compatibility redirect: old path -> canonical path */}
            <Route path="/schedule-booking" element={<Navigate to="/one-time-ticket/schedule-booking" replace />} />
            <Route path="/fare-calculator" element={<FareCalculator />} />
            <Route path="/route-map" element={<RouteMap />} />
            <Route path="/route-info" element={<RouteMap />} />
            <Route path="/virtual-card" element={<VirtualCard />} />
            <Route path="/virtual-card-dashboard" element={<VirtualCardDashboard />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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