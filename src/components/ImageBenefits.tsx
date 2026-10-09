import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight,
  Compass,
  TreePalm,
  Mountains,
  Sun,
  MapTrifold,
  Waves,
  SunHorizon
} from '@phosphor-icons/react';
import { getHomepageConfig } from '../data/mockData';
import { BenefitsSectionConfig } from '../types';

interface ImageBenefitsProps {
  onOpenRegister: () => void;
}

export const ImageBenefits: React.FC<ImageBenefitsProps> = ({ onOpenRegister }) => {
  const [benefitsConfig, setBenefitsConfig] = useState<BenefitsSectionConfig>(getHomepageConfig().benefits);

  useEffect(() => {
    const handleUpdate = () => {
      setBenefitsConfig(getHomepageConfig().benefits);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const BENEFIT_CARDS = [
    {
      title: 'Promote Luxury Beach Holidays',
      subtitle: 'Showcase beautiful packages with professional galleries',
      dest: 'Maldives & Tropical Atolls',
      img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85',
      badgeLabel: 'Tropical Luxury',
      badgeIcon: Waves,
      desc: 'High-res photo sliders, water villa inclusions, speed boat transfers, and instant WhatsApp inquiry routing for your resort itineraries.',
      icon: TreePalm,
    },
    {
      title: 'Reach Travelers Looking For Mountain Adventures',
      subtitle: 'Attract high-intent trek & nature enthusiasts',
      dest: 'Kashmir, Himalayas & Swiss Alps',
      img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
      badgeLabel: 'Alpine & Treks',
      badgeIcon: Mountains,
      desc: 'Highlight houseboats, snow gondolas, skiing passes, and custom group quotes with professional day-wise itinerary pages.',
      icon: Mountains,
    },
    {
      title: 'Publish International Tours & Safaris',
      subtitle: 'Position your agency as a premier outbound specialist',
      dest: 'Dubai, Europe & Middle East',
      img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
      badgeLabel: 'Safaris & Skyline',
      badgeIcon: Sun,
      desc: 'Present desert dune bashing, yacht cruises, theme park passes, and multi-destination European train packages without sending heavy PDFs.',
      icon: Sun,
    },
    {
      title: 'Highlight Exotic Island & Honeymoon Escape Packages',
      subtitle: 'Convert high-margin romantic getaway leads',
      dest: 'Bali, Phuket & Santorini',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
      badgeLabel: 'Island Escapes',
      badgeIcon: SunHorizon,
      desc: 'Publish romantic private pool villa packages, flower baths, candlelit beach dinners, and full honeymoon inclusions.',
      icon: Compass,
    },
    {
      title: 'Offer Coastal Getaways & Cultural Heritage Expeditions',
      subtitle: 'Engage domestic and weekend holiday seekers',
      dest: 'Goa, Kerala & Rajasthan',
      img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
      badgeLabel: 'Coastal & Culture',
      badgeIcon: Waves,
      desc: 'Feature heritage palace stays, backwater houseboats, beach shacks, and group party itineraries with instant mobile booking links.',
      icon: MapTrifold,
    },
    {
      title: 'Build Verified Brand Credibility Across All Channels',
      subtitle: 'Receive the official Triiply Blue Shield Trust Badge',
      dest: 'Global Ground DMCs & Agencies',
      img: 'https://images.unsplash.com/photo-1506665531195-3566af294e99?auto=format&fit=crop&w=1200&q=85',
      badgeLabel: 'Blue Shield Verified',
      badgeIcon: ShieldCheck,
      desc: 'Your commercial license, office address, and tax ID are verified so travelers and B2B retail agents wire deposits with 100% confidence.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="benefits" className="py-16 lg:py-24 bg-white text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase block mb-1">
            {benefitsConfig.badgeText || 'SOLVING LEGACY TRAVEL INDUSTRY BOTTLENECKS'}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            {benefitsConfig.headingStart}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              {benefitsConfig.headingGradient}
            </span>
          </h2>

          <p className="mt-4 text-base text-slate-600 font-medium">
            {benefitsConfig.subtitle}
          </p>
        </div>

        {/* 6 Rich Travel Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {BENEFIT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            const BadgeIcon = card.badgeIcon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 h-[420px] shadow-lg hover:border-blue-500 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image Background */}
                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />

                {/* Soft Gradient Overlay for Photo Visibility and Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

                {/* Top Badge */}
                <div className="relative z-10 p-5 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                    <BadgeIcon size={14} weight="duotone" className="text-sky-300" />
                    <span>{card.badgeLabel}</span>
                  </span>

                  <div className="w-10 h-10 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700 flex items-center justify-center text-sky-400">
                    <Icon size={20} weight="duotone" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-6 space-y-2 text-white">
                  <p className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                    {card.dest}
                  </p>

                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {card.desc}
                  </p>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={onOpenRegister}
                      className="text-xs font-bold text-sky-300 hover:text-white transition-colors flex items-center gap-1 group/btn cursor-pointer"
                    >
                      <span>List Packages Free</span>
                      <ArrowRight size={14} weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
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
