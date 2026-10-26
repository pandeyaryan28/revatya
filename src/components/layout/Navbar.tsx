import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { MAIN_NAVIGATION } from '../../data/siteContent';
import { RevatyaLogo } from '../ui/RevatyaLogo';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // If mobile menu is expanded, keep topbar visible
          if (mobileMenuOpen) {
            setIsVisible(true);
            lastScrollY = currentScrollY;
            ticking = false;
            return;
          }

          // Top of the page: always keep topbar visible
          if (currentScrollY <= 24) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY + 8) {
            // Scrolling down: hide topbar
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY - 8) {
            // Scrolling up: show topbar
            setIsVisible(true);
          }

          lastScrollY = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobileMenuOpen]);

  return (
    <header
      data-testid="main-navbar-header"
      className={`fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className={`max-w-7xl mx-auto ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <nav
          aria-label="Primary Orbital Navigation"
          className="liquid-glass-island rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 transition-all duration-300"
        >
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none rounded-xl pr-2 py-0.5"
            aria-label="Revatya Home · A city beyond Earth"
          >
            <RevatyaLogo className="w-9 h-9 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-serif-display text-xl sm:text-2xl tracking-tight text-slate-950 dark:text-[#F5F5F7] leading-none whitespace-nowrap">
              Revatya
            </span>
          </Link>

          {/* Desktop Primary Links */}
          <div className="hidden xl:flex items-center gap-0.5">
            {MAIN_NAVIGATION.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900/10 dark:bg-white/[0.11] text-slate-950 dark:text-[#F5F5F7] font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-[#F5F5F7] hover:bg-slate-900/5 dark:hover:bg-white/[0.05]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Controls: Theme Toggle, Contact CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light clean room theme' : 'Switch to deep space dark theme'}
              className="p-2.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-900/6 dark:hover:bg-white/[0.08] transition-colors cursor-pointer tactile-press"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-zinc-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium bg-slate-950 text-white dark:bg-[#F5F5F7] dark:text-[#020305] hover:bg-slate-800 dark:hover:bg-white transition-all tactile-press shadow-sm"
            >
              Contact
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="xl:hidden p-2 rounded-xl text-slate-700 dark:text-zinc-200 hover:bg-slate-900/8 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile / Tablet Expandable Sheet */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-2 rounded-3xl liquid-glass-island p-5 shadow-2xl border border-slate-900/10 dark:border-white/[0.1] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {MAIN_NAVIGATION.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900/10 dark:bg-white/[0.12] text-slate-950 dark:text-[#F5F5F7] font-semibold'
                        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-900/5 dark:hover:bg-white/[0.06]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-900/10 dark:border-white/[0.08] flex flex-wrap items-center justify-end gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 text-white dark:bg-[#F5F5F7] dark:text-[#020305]"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
