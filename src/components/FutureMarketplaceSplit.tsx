import React, { useState, useEffect } from 'react';
import { Users, Buildings, ArrowRight, ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import { getHomepageConfig } from '../data/mockData';
import { MarketplaceSplitConfig } from '../types';

interface FutureMarketplaceSplitProps {
  onOpenRegister: () => void;
}

export const FutureMarketplaceSplit: React.FC<FutureMarketplaceSplitProps> = ({ onOpenRegister }) => {
  const [marketConfig, setMarketConfig] = useState<MarketplaceSplitConfig>(getHomepageConfig().marketplace);

  useEffect(() => {
    const handleUpdate = () => {
      setMarketConfig(getHomepageConfig().marketplace);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-slate-50 border-y border-slate-200/80 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Column: Traveler Side */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 space-y-6 relative overflow-hidden text-slate-900 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <Users size={24} weight="duotone" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase border border-blue-200">
              {marketConfig.travelerColumnSubtitle || 'For Travelers & Retail Agents'}
            </span>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              {marketConfig.travelerColumnTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {marketConfig.subtitle}
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              {(marketConfig.travelerFeatures || []).map((f) => (
                <li key={f.id} className="flex items-start gap-2">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 font-bold">{f.title}: </strong>
                    <span>{f.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Travel Agency Side */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-emerald-50 border border-blue-200 space-y-6 relative overflow-hidden shadow-lg text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Buildings size={24} weight="duotone" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase border border-emerald-200">
              {marketConfig.agencyColumnSubtitle || 'For Verified Travel Partners'}
            </span>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              {marketConfig.agencyColumnTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Build your online presence today so when travelers search for holiday packages in world hotspots, your agency's verified page shows up first.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              {(marketConfig.agencyFeatures || []).map((f) => (
                <li key={f.id} className="flex items-start gap-2">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 font-bold">{f.title}: </strong>
                    <span>{f.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className="mt-8 text-center">
          <button
            onClick={onOpenRegister}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 hover:from-blue-700 hover:to-sky-500 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <ShieldCheck size={18} weight="fill" className="text-emerald-300" />
            <span>Claim Your Agency Storefront</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
};
