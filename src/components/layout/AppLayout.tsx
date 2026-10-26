import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CinematicBackgroundVideo } from '../background/CinematicBackgroundVideo';

export const AppLayout: React.FC = () => {
  const { pathname, hash } = useLocation();

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('revatya-theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('revatya-theme', theme);
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [theme]);

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#020305] text-slate-900 dark:text-[#F5F5F7] selection:bg-slate-900/15 dark:selection:bg-white/20 transition-colors duration-300 relative overflow-x-clip">
      {/* Skip to Main Content for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-white focus:text-slate-950 focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Deep Space Vacuum & Subtle Starlight Horizon Atmosphere */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute -top-56 left-1/2 -translate-x-1/2 w-[1100px] h-[540px] rounded-full bg-slate-400/10 dark:bg-white/[0.025] blur-[150px]" />
        <div className="Name-starfield absolute inset-0 architectural-grid-bg opacity-45 dark:opacity-100" />
      </div>

      {/* Persistent Scroll-Responsive Orbital Metropolis Cinematic Video Layer */}
      <CinematicBackgroundVideo />

      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main
        id="main-content"
        key={pathname}
        className="flex-1 relative z-10 pt-24 sm:pt-28 page-transition-enter"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
