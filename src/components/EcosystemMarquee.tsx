import React, { useState, useEffect } from 'react';
import { Globe, Medal } from '@phosphor-icons/react';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';
import { getHomepageConfig } from '../data/mockData';
import { MarqueeConfig } from '../types';

export const EcosystemMarquee: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [marqueeConfig, setMarqueeConfig] = useState<MarqueeConfig>(getHomepageConfig().marquee);

  useEffect(() => {
    const handleUpdate = () => {
      setMarqueeConfig(getHomepageConfig().marquee);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const partnersList = marqueeConfig.partners || [];

  const filteredLogos = filter === 'All' 
    ? partnersList 
    : partnersList.filter((p) => p.type.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200 text-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 text-center md:text-left">
          <div>
            <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase block mb-1">
              {marqueeConfig.badgeText}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
              {marqueeConfig.heading}
            </h3>
            {marqueeConfig.subheading && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {marqueeConfig.subheading}
              </p>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['All', 'DMC', 'Tour Operator', 'Travel Agency'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  filter === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Marquee Banner */}
        <div className="relative w-full overflow-hidden py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* Gradient Fades for Smooth Scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee flex items-center gap-6">
            {/* Repeat list for seamless infinite scroll */}
            {(filteredLogos.length > 0 ? [...filteredLogos, ...filteredLogos, ...filteredLogos] : []).map((partner, idx) => (
              <div
                key={`${partner.name}-${idx}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-sky-50/50 transition-all duration-200 shrink-0 group cursor-default shadow-sm"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${partner.bg || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                >
                  {partner.initial || partner.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                    <span>{partner.name}</span>
                    <InstagramVerifiedBadge size={13} title="Verified Partner Agency" />
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Globe size={12} className="text-blue-500" />
                    {partner.location} • {partner.type}
                  </span>
                </div>
                <Medal size={16} weight="fill" className="text-amber-500 ml-1 opacity-80 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
