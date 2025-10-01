import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './bootstrap';
import '../css/app.css';
import { Loader } from '@ui/loader';
import { MainApp } from './components/MainApp';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisitedBefore = localStorage.getItem('mrt_has_visited');
    
    if (!hasVisitedBefore) {
      // First time visitor - show loader
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Mark as visited so loader won't show again
        localStorage.setItem('mrt_has_visited', 'true');
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
    // If user has visited before, don't show loader
  }, []);

  return (
    <>
      <Loader isVisible={isLoading} />
      {!isLoading && <MainApp />}
    </>
  );
};

const el = document.getElementById('app');
if (el) createRoot(el).render(<App />);
