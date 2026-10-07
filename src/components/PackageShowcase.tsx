import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../data/mockData';
import { syncPackagesFromBackend } from '../data/packageService';
import { TravelPackage } from '../types';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';
import { LoadMoreButton } from './LoadMoreButton';
import { 
  SuitcaseRolling, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Sparkle, 
  Eye, 
  PaperPlaneTilt 
} from '@phosphor-icons/react';

interface PackageShowcaseProps {
  onSelectPackage: (pkg: TravelPackage) => void;
  onOpenRegister: () => void;
}

export const PackageShowcase: React.FC<PackageShowcaseProps> = ({ onSelectPackage, onOpenRegister }) => {
  const [packages, setPackages] = useState<TravelPackage[]>(() => {
    const list = getPackages();
    return list.filter(p => (p.status || 'APPROVED') === 'APPROVED');
  });
  const [activeTheme, setActiveTheme] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const refreshPackages = () => {
    const list = getPackages();
    const approved = list.filter(p => (p.status || 'APPROVED') === 'APPROVED');
    setPackages(approved);
  };

  useEffect(() => {
    refreshPackages();

    // Sync from backend in background
    syncPackagesFromBackend().then(() => {
      refreshPackages();
    }).catch(() => {});

    // Listen for package updates across windows / components
    const handleUpdate = () => refreshPackages();
    window.addEventListener('triiply_packages_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('triiply_packages_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute available themes dynamically from published packages
  const defaultThemes = ['All', 'Luxury & Desert', 'Honeymoon & Nature', 'Luxury & Rail', 'Mountains & Culture', 'Cultural & Heritage'];
  const packageThemes = Array.from(new Set(packages.map(p => p.theme || p.category).filter(Boolean))) as string[];
  const themes = Array.from(new Set([...defaultThemes, ...packageThemes]));

  const filteredPackages = activeTheme === 'All' 
    ? packages 
    : packages.filter((p) => (p.theme === activeTheme || p.category === activeTheme));

  useEffect(() => setVisibleCount(6), [activeTheme]);

  return (
    <section id="packages" className="py-16 lg:py-24 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Featured Verified Package{' '}
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                Itineraries
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl">
              Published directly by verified ground operators and DMCs. Every package includes full inclusions, high-res photos, and direct WhatsApp inquiry links.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="self-start md:self-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer hover:shadow-lg transition-all"
          >
            <span>Publish Your Packages Free</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setActiveTheme(theme)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTheme === theme
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Package Cards Grid */}
        {filteredPackages.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <SuitcaseRolling size={40} className="mx-auto text-slate-400 mb-3" />
            <h3 className="font-heading text-lg font-bold text-slate-700">No packages in this category yet</h3>
            <p className="text-xs text-slate-500 mt-1">Select "All" or browse other themes to view verified itineraries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPackages.slice(0, visibleCount).map((pkg) => {
              const displayDuration = pkg.duration || `${pkg.days || 5} Days / ${pkg.nights || 4} Nights`;
              const displayTheme = pkg.theme || pkg.category || 'Curated Package';
              const displayPrice = pkg.priceEstimate || `${pkg.currency || '$'}${pkg.startingPrice ? pkg.startingPrice.toLocaleString() : '1,850'}`;
              const displayLogo = pkg.agencyLogo || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80';
              const displayHighlights = pkg.highlights && pkg.highlights.length > 0 
                ? pkg.highlights.slice(0, 3)
                : (pkg.itinerary && pkg.itinerary.length > 0 
                    ? pkg.itinerary.slice(0, 3).map(it => it.title || `Day ${it.day}: ${it.activities?.[0] || 'Guided Tour'}`)
                    : ['Luxury Accommodation', 'Private Airport Transfers', 'Dedicated Local Guide']);

              return (
                <div
                  key={pkg.id}
                  className="group rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row shadow-sm"
                >
                  {/* Left Image Column */}
                  <div className="sm:w-2/5 h-60 sm:h-auto relative overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={pkg.imageUrl || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1000&q=80'}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/70 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow">
                      {displayTheme}
                    </div>

                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-md">
                      <Clock size={14} className="text-sky-400" />
                      <span>{displayDuration}</span>
                    </div>
                  </div>

                  {/* Right Content Column */}
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-1">
                        <MapPin size={14} />
                        <span>{pkg.destination}</span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {pkg.title}
                      </h3>

                      {/* Agency Provider Badge */}
                      <Link
                        to={pkg.agencyId ? `/agency/${pkg.agencyId}` : `/agencies`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-2 pt-2 border-t border-slate-100 hover:text-blue-600 transition-colors group/agency"
                      >
                        <img
                          src={displayLogo}
                          alt={pkg.agencyName || 'Partner DMC'}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 group-hover/agency:scale-105 transition-transform"
                        />
                        <span className="text-xs font-semibold text-slate-700 group-hover/agency:text-blue-600 flex items-center gap-1">
                          {pkg.agencyName || 'Verified Partner DMC'}
                          {(pkg.agencyVerified ?? true) && (
                            <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                          )}
                        </span>
                      </Link>
                    </div>

                    {/* Key Highlights */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highlights:</p>
                      <ul className="grid grid-cols-1 gap-1 text-xs text-slate-600 font-medium">
                        {displayHighlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span className="truncate">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rate & Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Rate Estimate</span>
                        <span className="text-xs font-extrabold text-blue-600">{displayPrice}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectPackage(pkg)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>

                        <Link
                          to={`/holiday-packages?packageId=${pkg.id}`}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>Book</span>
                          <ArrowRight size={14} weight="bold" />
                        </Link>
                      </div>
                    </div>


                  </div>

                </div>
              );
            })}
          </div>
        )}
        <LoadMoreButton visible={visibleCount} total={filteredPackages.length} label="packages" onLoadMore={() => setVisibleCount(count => count + 6)} />

      </div>
    </section>
  );
};
