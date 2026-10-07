import React, { useState, useEffect } from 'react';
import { getHomepageConfig } from '../data/mockData';
import { 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight 
} from '@phosphor-icons/react';

interface WhyJoinEarlyProps {
  onOpenRegister: () => void;
}

export const WhyJoinEarly: React.FC<WhyJoinEarlyProps> = ({ onOpenRegister }) => {
  const [config, setConfig] = useState(() => getHomepageConfig().whyJoinEarly);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getHomepageConfig().whyJoinEarly);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const perks = config?.perks || [];

  return (
    <section className="py-16 lg:py-24 bg-slate-50 border-y border-slate-200/80 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-sky-50 text-slate-900 rounded-3xl p-8 sm:p-12 border border-blue-200 shadow-xl relative overflow-hidden">
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            {config.badgeText && (
              <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase block mb-1">
                {config.badgeText}
              </span>
            )}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              {config.headingStart || 'Join the First 100 Verified DMCs with'}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                {config.headingGradient || '12 Months Free Access'}
              </span>
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg font-medium">
              {config.subtitle || 'Founding partners receive lifetime preferential placement, permanent Blue Shield verification status, and $0 platform fees.'}
            </p>
          </div>

          {/* Perks Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {perks.map((p, idx) => (
              <div
                key={p.id || idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 hover:border-blue-500 shadow-sm transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={20} weight="fill" className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{p.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">{p.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Section Bottom Button Area */}
        <div className="mt-10 text-center">
          <button
            onClick={onOpenRegister}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck size={20} weight="fill" className="text-emerald-300" />
            <span>{config.primaryCtaText || 'Claim Founding Partner Access'}</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>

      </div>
    </section>
  );
};
