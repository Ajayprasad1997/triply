import React, { useState, useEffect } from 'react';
import { getHomepageConfig } from '../data/mockData';
import { Star, TrendUp } from '@phosphor-icons/react';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';

interface AgencyTestimonialsProps {
  onOpenRegister: () => void;
}

export const AgencyTestimonials: React.FC<AgencyTestimonialsProps> = () => {
  const [config, setConfig] = useState(() => getHomepageConfig().testimonials);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getHomepageConfig().testimonials);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const testimonials = config?.testimonials || [];

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {config.badgeText && (
            <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase block mb-1">
              {config.badgeText}
            </span>
          )}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {config.headingStart || 'Trusted by Premier DMCs and'}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              {config.headingGradient || 'Global Tour Operators'}
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            {config.subtitle || 'Hear from our founding partners who transitioned from messy WhatsApp PDFs to professional Triiply storefronts.'}
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => {
            const author = t.authorName || (t as any).ownerName || 'Agency Leader';
            const role = t.authorRole || (t as any).ownerRole || 'Managing Director';
            const photo = t.avatarUrl || (t as any).ownerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
            const metric = t.metricBadge || (t as any).growthStat || 'Verified Partner';

            return (
              <div
                key={t.id}
                className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-lg relative"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Metric Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={16} weight="fill" className="text-amber-400" />
                      ))}
                    </div>

                    {metric && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] flex items-center gap-1 shrink-0">
                        <TrendUp size={14} weight="bold" className="text-emerald-600" />
                        {metric}
                      </span>
                    )}
                  </div>

                  {/* Quote text */}
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={photo}
                    alt={author}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/40"
                  />
                  <div className="min-w-0">
                    <h4 className="font-heading font-extrabold text-slate-900 text-sm truncate">
                      {author}
                    </h4>
                    <p className="text-xs text-blue-600 font-bold flex items-center gap-1 truncate">
                      <span className="truncate">{t.agencyName}</span>
                      <InstagramVerifiedBadge size={13} title="Verified Partner Agency" />
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{role} • {t.location}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
