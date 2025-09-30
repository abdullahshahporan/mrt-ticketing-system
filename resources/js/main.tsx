import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './bootstrap';
import '../css/app.css';
import { Loader } from '@ui/loader';
import { MainApp } from './components/MainApp';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Always show loader on every page load/refresh
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
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
