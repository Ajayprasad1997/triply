import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  MagnifyingGlass,
  ArrowRight,
  List,
  X,
  Sparkle,
  Globe,
  CaretRight
} from '@phosphor-icons/react';
import { TriiplyLogo } from './TriiplyLogo';

interface NavbarProps {
  onOpenRegister?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-2.5 shadow-md'
        : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <TriiplyLogo className="h-11-logo sm:h-10" showTagline={true}/>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <Link to="/explore" className="hover:text-blue-600 transition-colors font-bold text-slate-800">
              Packages &amp; Destinations
            </Link>
            <Link to="/agencies" className="hover:text-blue-600 transition-colors font-bold text-slate-800">
              Agency Directory
            </Link>
            <Link to="/photo-library" className="hover:text-blue-600 transition-colors font-bold text-slate-800">
              Photo Library
            </Link>
            <Link to="/benefits" className="hover:text-blue-600 transition-colors font-bold text-slate-800">
              Agency Benefits
            </Link>
            <Link to="/subscription" className="hover:text-blue-600 transition-colors font-bold text-slate-800">
              Subscription
            </Link>
            
            <Link to="/about" className="hover:text-blue-600 transition-colors font-bold text-slate-800">
              Company Profile
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/contact#agency-onboarding"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-extrabold shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Become a Partner</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <List size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Floating Dropdown Card */}
          <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xl z-50 animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-extrabold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close navigation menu"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <nav className="flex flex-col text-sm font-bold text-slate-800 divide-y divide-slate-100">
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 hover:bg-blue-50 hover:text-blue-600 text-blue-600 font-extrabold rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Packages &amp; Destinations</span>
                <CaretRight size={14} className="text-blue-600" />
              </Link>
              <Link
                to="/photo-library"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Photo Library</span>
                <CaretRight size={14} className="text-slate-400" />
              </Link>
              <Link
                to="/agencies"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Agency Directory</span>
                <CaretRight size={14} className="text-slate-400" />
              </Link>
              <Link
                to="/benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Agency Benefits</span>
                <CaretRight size={14} className="text-slate-400" />
              </Link>
              <Link
                to="/benefits#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>How It Works</span>
                <CaretRight size={14} className="text-slate-400" />
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Company Profile &amp; Contact</span>
                <CaretRight size={14} className="text-slate-400" />
              </Link>
            </nav>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/contact#agency-onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 text-white font-extrabold text-xs text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Become a Verified Travel Partner</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
