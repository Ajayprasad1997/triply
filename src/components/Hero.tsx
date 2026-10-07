import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Camera 
} from '@phosphor-icons/react';
import { getHomepageConfig } from '../data/mockData';
import { HeroConfig } from '../types';

interface HeroProps {
  onOpenRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister }) => {
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(getHomepageConfig().hero);
  const [activeBg, setActiveBg] = useState(heroConfig.hotspots[0] || {
    id: 'maldives',
    name: 'Maldives',
    tagline: 'Luxury Water Villas & Crystal Lagoons',
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=85',
    agencyCount: '140+ DMCs',
  });

  useEffect(() => {
    const handleUpdate = () => {
      const cfg = getHomepageConfig().hero;
      setHeroConfig(cfg);
      if (cfg.hotspots && cfg.hotspots.length > 0) {
        setActiveBg(prev => cfg.hotspots.find(h => h.id === prev.id) || cfg.hotspots[0]);
      }
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  return (
    <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 bg-slate-900 text-white overflow-hidden min-h-[85vh] flex flex-col justify-between">
      
      {/* Dynamic Background Hero Travel Imagery */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          key={activeBg.id}
          src={activeBg.img}
          alt={activeBg.name}
          className="w-full h-full object-cover object-center opacity-85 transition-opacity duration-1000 scale-105"
        />
        {/* Soft Vignette Overlay for Crisp Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-slate-950/15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-2">
        
        {/* Headline & Subtitle */}
        <div className="text-center max-w-5xl mx-auto space-y-6">
          <h1 className="font-heading text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold tracking-tight leading-[1.08] text-balance">
            <span className="block">{heroConfig.headlineStart}</span>
            <span className="mt-1 block bg-gradient-to-r from-sky-300 via-sky-200 to-emerald-300 bg-clip-text pb-[0.08em] text-transparent sm:mt-2">
              {heroConfig.headlineGradient}
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow">
            {heroConfig.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 text-white font-extrabold text-base shadow-xl shadow-sky-500/30 hover:shadow-sky-500/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
            >
              <ShieldCheck size={22} weight="fill" className="text-emerald-300" />
              <span>{heroConfig.primaryCtaText}</span>
              <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#packages"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/90 hover:bg-white text-slate-900 font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Camera size={20} weight="duotone" className="text-blue-600" />
              <span>{heroConfig.secondaryCtaText}</span>
            </a>
          </div>
        </div>

        {/* Interactive Destination Backdrop Switcher Tabs */}
        {heroConfig.hotspots && heroConfig.hotspots.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 drop-shadow">
                <MapPin size={16} className="text-sky-300" />
                {heroConfig.hotspotsTitle || 'Explore Hotspot Destinations'} ({activeBg.name} - {activeBg.tagline}):
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {heroConfig.hotspots.map((bg) => {
                const isActive = activeBg.id === bg.id;
                return (
                  <button
                    key={bg.id}
                    onClick={() => setActiveBg(bg)}
                    onMouseEnter={() => setActiveBg(bg)}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 border-sky-400 shadow-xl scale-105'
                        : 'bg-white/80 hover:bg-white text-slate-800 border-white/40 hover:border-white shadow-md'
                    }`}
                  >
                    <div className="h-14 rounded-xl overflow-hidden mb-2 relative">
                      <img
                        src={bg.img}
                        alt={bg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/5 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <h4 className={`font-bold text-xs ${isActive ? 'text-blue-700' : 'text-slate-900'} group-hover:text-blue-600`}>
                      {bg.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{bg.agencyCount}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
