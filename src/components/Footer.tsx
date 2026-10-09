import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe, 
  Envelope, 
  Phone, 
  MapPin, 
  TwitterLogo, 
  LinkedinLogo, 
  InstagramLogo, 
  FacebookLogo, 
  Lock, 
  CheckCircle 
} from '@phosphor-icons/react';
import { TriiplyLogo } from './TriiplyLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 text-xs border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand Story & Security */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block" aria-label="Triiply Home">
              <TriiplyLogo className="h-10" showTagline={true} />
            </Link>

            <p className="text-slate-600 text-xs leading-relaxed max-w-sm font-medium">
              The premier B2B SaaS platform empowering travel agencies, tour operators, and DMCs to build a verified storefront, publish interactive holiday packages, and scale digital trust.
            </p>

            <div className="flex items-center gap-3 pt-2" aria-label="Triiply social channels coming soon">
              <span className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500" title="LinkedIn channel coming soon">
                <LinkedinLogo size={18} weight="fill" />
              </span>
              <span className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500" title="X channel coming soon">
                <TwitterLogo size={18} weight="fill" />
              </span>
              <span className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500" title="Instagram channel coming soon">
                <InstagramLogo size={18} weight="fill" />
              </span>
              <span className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500" title="Facebook channel coming soon">
                <FacebookLogo size={18} weight="fill" />
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-700 font-bold">
              <ShieldCheck size={18} weight="fill" className="text-emerald-600" />
              <span>Official B2B Partner Verification Ecosystem</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm">Platform</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/explore" className="hover:text-blue-600 transition-colors">Packages &amp; Destinations</Link></li>
              <li><Link to="/photo-library" className="hover:text-blue-600 transition-colors">Photo Library</Link></li>
              <li><Link to="/agencies" className="hover:text-blue-600 transition-colors">Agency Directory</Link></li>
              <li><Link to="/benefits" className="hover:text-blue-600 transition-colors">Agency Benefits</Link></li>
              <li><Link to="/benefits#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition-colors font-bold text-slate-800">Company Profile</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Triply</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources & Trust */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm">Verification & Trust</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">Corporate Registrations & CIN</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">Registered Offices in India</Link></li>
              <li><Link to="/contact#agency-onboarding" className="hover:text-blue-600 transition-colors">Blue Shield Verification</Link></li>
              <li><Link to="/#faq" className="hover:text-blue-600 transition-colors">Partner FAQs</Link></li>
              <li><Link to="/contact#agency-onboarding" className="hover:text-blue-600 transition-colors">DMC Onboarding Desk</Link></li>
              <li><Link to="/contact#agency-onboarding" className="hover:text-blue-600 transition-colors">Founding Partner Perks</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm">Partner Help Desk</h4>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600 shrink-0" />
                <a href="tel:+9477424461" className="hover:text-blue-600 font-bold text-slate-800">+91 9477424461</a>
              </li>
              <li className="flex items-center gap-2">
                <Envelope size={16} className="text-blue-600 shrink-0" />
                <a href="mailto:info@triiply.com" className="hover:text-blue-600">info@triiply.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600 shrink-0" />
                <Link to="/about" className="hover:text-blue-600">HQ:Kolkata</Link>
              </li>
              <li className="flex items-center gap-2">
                <Lock size={16} className="text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/about"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm text-center block"
              >
                View Company Profile
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Triiply Technologies Inc. All rights reserved. B2B Travel Partner Acquisition Platform.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-800 transition-colors">Terms &amp; Conditions</Link>
            <Link to="/about" className="hover:text-slate-800 transition-colors">Security Overview</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
