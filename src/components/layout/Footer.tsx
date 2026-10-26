import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONTENT } from '../../data/siteContent';
import { RevatyaLogo } from '../ui/RevatyaLogo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-slate-900/10 dark:border-white/[0.08] bg-white/60 dark:bg-[#020305]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Positioning Column */}
          <div className="lg:col-span-6 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <RevatyaLogo className="w-10 h-10" />
              <div>
                <span className="font-serif-display text-2xl sm:text-3xl tracking-tight text-slate-950 dark:text-[#F5F5F7] block leading-none">
                  {BRAND_CONTENT.name}
                </span>
                <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mt-1 block">
                  {BRAND_CONTENT.primaryLine}
                </span>
              </div>
            </Link>
          </div>

          {/* Column 1: Architecture & Systems */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="font-mono-tech text-xs uppercase tracking-[0.18em] text-slate-900 dark:text-[#F5F5F7] font-semibold">
              Architecture
            </h3>
            <ul className="space-y-2.5 text-base text-slate-600 dark:text-zinc-400">
              <li>
                <Link to="/vision" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Vision
                </Link>
              </li>
              <li>
                <Link to="/city" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  The City
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Applications
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Collaboration & Legal */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="font-mono-tech text-xs uppercase tracking-[0.18em] text-slate-900 dark:text-[#F5F5F7] font-semibold">
              Engage
            </h3>
            <ul className="space-y-2.5 text-base text-slate-600 dark:text-zinc-400">
              <li>
                <Link to="/partners" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Partners & Institutions
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Join / Contributors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Contact Revatya
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-slate-950 dark:hover:text-[#F5F5F7] transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Telemetry Line */}
        <div className="mt-12 pt-8 border-t border-slate-900/8 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-tech text-xs text-slate-500 dark:text-zinc-400">
          <span>© {currentYear} Revatya · Long Horizon Orbital Architecture Initiative</span>
          <span>ORBITAL SYSTEMS · HUMAN HABITATION · RESEARCH & INDUSTRY</span>
        </div>
      </div>
    </footer>
  );
};
