import React, { useState, useEffect } from 'react';
import UserPortal from './components/UserPortal';
import AdminPanel from './components/AdminPanel';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path === '/' || path === '/login') {
      setShowSplash(true);
    }
  };

  const isAdmin = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900">
      {/* Navigation Header (ONLY shown when inside Admin Panel for exit button) */}
      {isAdmin && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('/login')}
                title="Exit Admin Panel"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <span className="font-bold text-base text-slate-800">Admin Dashboard</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Body */}
      <main className="flex-1 flex flex-col justify-between bg-white">
        {isAdmin ? (
          <div className="w-full max-w-6xl mx-auto p-4 flex-1">
            <AdminPanel />
          </div>
        ) : (
          <>
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            <UserPortal onOpenAdmin={() => navigateTo('/admin')} />
          </>
        )}
      </main>
    </div>
  );
}
