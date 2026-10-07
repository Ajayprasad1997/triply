import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AGENCY_PARTNERS } from '../data/landingData';
import { getAgencies } from '../data/mockData';
import { AgencyPartner } from '../types';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Buildings, 
  SuitcaseRolling, 
  ArrowRight, 
  CheckCircle, 
  Compass, 
  Medal 
} from '@phosphor-icons/react';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';
import { LoadMoreButton } from './LoadMoreButton';

interface AgencyShowcaseProps {
  onOpenRegister: () => void;
}

export const AgencyShowcase: React.FC<AgencyShowcaseProps> = ({ onOpenRegister }) => {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<AgencyPartner[]>(() => {
    const list = getAgencies();
    const verified = list.filter(a => a.verified);
    return verified.length > 0 ? verified : AGENCY_PARTNERS;
  });
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const refreshAgencies = () => {
      const list = getAgencies();
      const verified = list.filter(a => a.verified);
      if (verified.length > 0) {
        setAgencies(verified);
      }
    };

    refreshAgencies();
    window.addEventListener('triiply_agencies_updated', refreshAgencies);
    window.addEventListener('storage', refreshAgencies);
    return () => {
      window.removeEventListener('triiply_agencies_updated', refreshAgencies);
      window.removeEventListener('storage', refreshAgencies);
    };
  }, []);

  const handleNavigateToAgency = (agencyId: string) => {
    navigate(`/agency/${agencyId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="agencies" className="py-16 lg:py-24 bg-slate-50 border-y border-slate-200/80 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3 border border-blue-200">
              <ShieldCheck size={14} weight="fill" className="text-blue-600" />
              <span>Blue Shield Authenticated Directory</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Featured Verified Travel Agencies &{' '}
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                Ground DMCs
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl">
              Like Booking.com property listings, but built for verified travel agencies and DMCs to build public brand credibility and publish packages directly.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <Link
              to="/agencies"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Browse All Agencies</span>
              <ArrowRight size={14} weight="bold" />
            </Link>

            <button
              onClick={onOpenRegister}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck size={18} weight="fill" className="text-emerald-300" />
              <span>List Your Agency Free</span>
            </button>
          </div>
        </div>

        {/* Agency Cards Grid (Booking.com style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agencies.slice(0, visibleCount).map((agency) => (
            <div
              key={agency.id}
              onClick={() => handleNavigateToAgency(agency.id)}
              className="group rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Cover Image & Logo */}
              <div className="h-44 relative overflow-hidden">
                <img
                  src={agency.bannerUrl || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'}
                  alt={agency.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>

                {/* Verified Shield Badge */}
                {agency.verified && (
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-sky-500/30 px-2.5 py-1 rounded-full text-slate-800 font-extrabold text-[10px] flex items-center gap-1.5 shadow">
                    <InstagramVerifiedBadge size={14} />
                    <span>Verified Partner</span>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-600 font-bold text-[10px] flex items-center gap-1 border border-slate-200 shadow">
                  <Star size={12} weight="fill" className="text-amber-400" />
                  <span>{agency.rating || 4.9}</span>
                  <span className="text-slate-500 font-normal">({agency.reviewCount || 120})</span>
                </div>

                {/* Floating Logo */}
                <div className="absolute -bottom-5 left-4">
                  <img
                    src={agency.logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80'}
                    alt={agency.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 pt-8 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold mb-1">
                    <MapPin size={12} />
                    <span>{agency.location}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{agency.type}</span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span>{agency.name}</span>
                    {agency.verified && (
                      <InstagramVerifiedBadge size={16} title="Verified Partner Agency" />
                    )}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    "{agency.tagline || agency.bio || `${agency.name} specializes in verified holiday packages and VIP ground hospitality.`}"
                  </p>
                </div>

                {/* Destinations Handled Chips */}
                {((agency.destinations && agency.destinations.length > 0) || (agency.primaryDestinations && agency.primaryDestinations.length > 0)) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(agency.destinations || agency.primaryDestinations || []).slice(0, 3).map((d, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {/* Owner info */}
                {agency.ownerName && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={agency.ownerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                        alt={agency.ownerName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{agency.ownerName}</p>
                        <p className="text-[9px] text-slate-500">{agency.ownerRole || 'Lead Operator'}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {agency.packageCount || 10}+ Packages
                    </span>
                  </div>
                )}

                {/* View Profile CTA */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToAgency(agency.id);
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  <span>View Verified Profile</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>

            </div>
          ))}
        </div>
        <LoadMoreButton visible={visibleCount} total={agencies.length} label="agencies" onLoadMore={() => setVisibleCount(count => count + 6)} />

      </div>
    </section>
  );
};
