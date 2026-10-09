import React, { useState, useEffect } from 'react';
import { MapPin, Buildings, SuitcaseRolling, ArrowRight } from '@phosphor-icons/react';
import { getHomepageConfig } from '../data/mockData';
import { DestinationsSectionConfig } from '../types';
import { LoadMoreButton } from './LoadMoreButton';

interface FeaturedDestinationsProps {
  onOpenRegister: () => void;
}

export const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({ onOpenRegister }) => {
  const [destConfig, setDestConfig] = useState<DestinationsSectionConfig>(getHomepageConfig().destinations);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const handleUpdate = () => {
      setDestConfig(getHomepageConfig().destinations);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const destinationsList = destConfig.destinations || [];

  return (
    <section id="destinations" className="py-16 lg:py-24 bg-slate-50 border-y border-slate-200/80 text-slate-900 relative overflow-hidden">
      
      {/* Background Subtle Map Graphic Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              {destConfig.headingStart}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                {destConfig.headingGradient}
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl">
              {destConfig.subtitle}
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="self-start md:self-auto px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 text-slate-900 font-bold text-xs flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>{destConfig.ctaText || 'List Your Destination DMC'}</span>
            <ArrowRight size={16} weight="bold" className="text-blue-600" />
          </button>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinationsList.slice(0, visibleCount).map((dest) => (
            <div
              key={dest.id}
              className="group relative rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              {/* Top Image Box */}
              <div className="h-52 relative overflow-hidden">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                {dest.featuredTag && (
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow">
                    {dest.featuredTag}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-sky-300 font-semibold mb-0.5">
                    <MapPin size={12} className="shrink-0" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-semibold">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Buildings size={16} weight="duotone" className="text-blue-600" />
                  <span>{dest.agencyCount} DMCs</span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <SuitcaseRolling size={16} weight="duotone" className="text-emerald-600" />
                  <span>{dest.packageCount} Packages</span>
                </div>
              </div>

            </div>
          ))}
        </div>
        <LoadMoreButton visible={visibleCount} total={destinationsList.length} label="destinations" onLoadMore={() => setVisibleCount(count => count + 6)} />

      </div>
    </section>
  );
};
