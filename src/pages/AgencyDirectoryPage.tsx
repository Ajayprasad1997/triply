import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Buildings,
  ShieldCheck,
  MapPin,
  Star,
  SuitcaseRolling,
  ArrowRight,
  MagnifyingGlass,
  CheckCircle,
  Envelope,
  Phone,
  CaretRight,
  Sparkle,
  SlidersHorizontal,
  Clock,
  UserCheck,
  GlobeHemisphereWest
} from '@phosphor-icons/react';
import { getAgencies, getPackages } from '../data/mockData';
import { AgencyPartner, TravelPackage } from '../types';
import { InstagramVerifiedBadge } from '../components/InstagramVerifiedBadge';
import { LoadMoreButton } from '../components/LoadMoreButton';

export const AgencyDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [topRatedOnly, setTopRatedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'packages' | 'name'>('rating');
  const [visibleCount, setVisibleCount] = useState(6);

  const [agencies, setAgencies] = useState<AgencyPartner[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const refreshData = () => {
      setAgencies(getAgencies());
      setPackages(getPackages());
    };
    refreshData();

    window.addEventListener('triiply_agencies_updated', refreshData);
    window.addEventListener('triiply_packages_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('triiply_agencies_updated', refreshData);
      window.removeEventListener('triiply_packages_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const agencyTypes = ['All', 'DMC', 'Tour Operator', 'B2B Wholesaler', 'Holiday Provider', 'Travel Agency'];

  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        agency.name.toLowerCase().includes(q) ||
        agency.location.toLowerCase().includes(q) ||
        (agency.primaryDestinations && agency.primaryDestinations.some(d => d.toLowerCase().includes(q))) ||
        (agency.licenseNumber && agency.licenseNumber.toLowerCase().includes(q));

      const matchesType = selectedType === 'All' || agency.type === selectedType;
      const matchesVerified = !verifiedOnly || agency.verified;
      const matchesRating = !topRatedOnly || (agency.rating || 4.9) >= 4.8;

      return matchesSearch && matchesType && matchesVerified && matchesRating;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'packages') return (b.totalPackages || 0) - (a.totalPackages || 0);
      return (b.rating || 4.9) - (a.rating || 4.9);
    });
  }, [agencies, searchQuery, selectedType, verifiedOnly, topRatedOnly, sortBy]);

  useEffect(() => setVisibleCount(6), [searchQuery, selectedType, verifiedOnly, topRatedOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Top Breadcrumb & Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300/80 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <CaretRight size={12} />
            <span className="text-white font-bold">Partner Agency Directory</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold mb-4 backdrop-blur-md">
              <ShieldCheck size={14} weight="fill" className="text-sky-300" />
              <span>Blue Shield Verified B2B Ecosystem</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Verified Travel Agencies &{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Ground DMCs Directory
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Browse 1,200+ verified destination management companies, inbound tour operators, and licensed travel partners worldwide with authenticated commercial licenses.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="mt-10 p-3 sm:p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search Bar */}
              <div className="md:col-span-8 relative">
                <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agency name, location, destination (e.g. Apex Emirates, Dubai, Bali)..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/95 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-inner"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="md:col-span-4">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/95 text-slate-800 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-inner"
                >
                  <option value="rating">Highest Rated (4.9+)</option>
                  <option value="packages">Most Packages Published</option>
                  <option value="name">Alphabetical (A - Z)</option>
                </select>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Directory Content & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Type and Verification Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          
          {/* Agency Type Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {agencyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedType === type
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Verification Checkboxes */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-700 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} weight="fill" className="text-blue-600" />
                <span>Verified Partners Only</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={topRatedOnly}
                onChange={(e) => setTopRatedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1">
                <Star size={14} weight="fill" className="text-amber-500" />
                <span>Top Rated (4.8+)</span>
              </span>
            </label>

            <div className="text-xs font-bold text-slate-500 ml-auto">
              Found <span className="text-blue-600 font-extrabold">{filteredAgencies.length}</span> Agencies
            </div>
          </div>

        </div>

        {/* Agency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredAgencies.slice(0, visibleCount).map((agency) => {
            const agencyPackages = packages.filter(p => p.agencyId === agency.id || p.agencyName === agency.name);
            const packageCount = agency.totalPackages || agencyPackages.length || 3;

            return (
              <div
                key={agency.id}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm"
              >
                <div className="p-6 space-y-4">
                  
                  {/* Agency Header with Avatar & Badge */}
                  <div className="flex items-start gap-4">
                    <img
                      src={agency.logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80'}
                      alt={agency.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wide">
                          {agency.type || 'DMC Partner'}
                        </span>
                        {agency.verified && (
                          <span className="inline-flex items-center gap-1 text-sky-600 text-[11px] font-bold">
                            <InstagramVerifiedBadge size={14} />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate mt-1 flex items-center gap-1.5">
                        <span className="truncate">{agency.name}</span>
                        {agency.verified && (
                          <InstagramVerifiedBadge size={15} title="Verified Partner Agency" />
                        )}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{agency.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio / Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {agency.bio || `${agency.name} is a premier licensed DMC specializing in tailored holiday packages, VIP ground handling, and luxury transfers.`}
                  </p>

                  {/* Primary Destinations Tags */}
                  {agency.primaryDestinations && agency.primaryDestinations.length > 0 && (
                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">
                        Primary Destinations Handled
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {agency.primaryDestinations.slice(0, 3).map((dest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                          >
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-black">
                        <Star size={12} weight="fill" />
                        <span>{agency.rating || 4.9}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Rating</div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="text-xs font-black text-slate-800">
                        {packageCount}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Packages</div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="text-xs font-black text-emerald-600">
                        &lt; 2 hrs
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Response</div>
                    </div>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to={`/agency/${agency.id}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-slate-800 hover:text-blue-600 font-bold text-xs text-center transition-all shadow-sm"
                  >
                    View Storefront
                  </Link>

                  <Link
                    to={`/holiday-packages?agencyId=${agency.id}`}
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Packages</span>
                    <ArrowRight size={12} weight="bold" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
        <LoadMoreButton visible={visibleCount} total={filteredAgencies.length} label="agencies" onLoadMore={() => setVisibleCount(count => count + 6)} />

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-bold text-white">
              Want your agency or DMC listed here?
            </h3>
            <p className="text-sm text-slate-300 font-medium max-w-xl">
              Apply for Blue Shield Verification. Get a branded web storefront, interactive package URLs, and zero-commission customer leads.
            </p>
          </div>

          <Link
            to="/benefits#agency-onboarding"
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm text-center shrink-0 shadow-lg transition-all"
          >
            Become a Partner (₹0 First Year)
          </Link>
        </div>

      </div>

    </div>
  );
};
