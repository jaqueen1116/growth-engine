import React, { useEffect, useState } from 'react';
import { LandingPage } from './LandingPage';
import { Dashboard } from './Dashboard';
import { StorageService } from './storage';

export const App: React.FC = () => {
  // Support both hash routing and query param routing: #/dashboard or pathname /dashboard
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'dashboard'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('dashboard') || hash.includes('dashboard')) {
      return 'dashboard';
    }
    return 'landing';
  });

  const [referralParam, setReferralParam] = useState<string>(() => {
    // Check search params or hash params
    const searchParams = new URLSearchParams(window.location.search);
    const searchRef = searchParams.get('ref');
    if (searchRef) return searchRef.toUpperCase();

    if (window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      const hashRef = hashParams.get('ref');
      if (hashRef) return hashRef.toUpperCase();
    }
    return '';
  });

  useEffect(() => {
    // Record visit analytics
    StorageService.recordVisit();

    const readReferral = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const searchRef = searchParams.get('ref');
      if (searchRef) {
        setReferralParam(searchRef.toUpperCase());
        return;
      }

      if (window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        const hashRef = hashParams.get('ref');
        if (hashRef) {
          setReferralParam(hashRef.toUpperCase());
        }
      }
    };

    readReferral();

    // Listen for hash and popstate changes
    const handleLocationChange = () => {
      readReferral();
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('dashboard')) {
        setCurrentRoute('dashboard');
      } else {
        setCurrentRoute('landing');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateToDashboard = () => {
    window.location.hash = '#/dashboard';
    setCurrentRoute('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    window.location.hash = '';
    setCurrentRoute('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100">
      {currentRoute === 'dashboard' ? (
        <Dashboard onNavigateToLanding={navigateToLanding} />
      ) : (
        <LandingPage
          onNavigateToDashboard={navigateToDashboard}
          referralCodeParam={referralParam}
        />
      )}
    </div>
  );
};

export default App;
