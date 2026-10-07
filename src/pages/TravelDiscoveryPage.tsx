import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  MagnifyingGlass,
  MapPin,
  SuitcaseRolling,
  X
} from '@phosphor-icons/react';
import CustomerBookingPage from './CustomerBookingPage';
import { DestinationsPage } from './DestinationsPage';

type DiscoveryView = 'packages' | 'destinations';

export const TravelDiscoveryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedView = searchParams.get('view');
  const initialView: DiscoveryView =
    requestedView === 'destinations' || location.pathname === '/destinations'
      ? 'destinations'
      : 'packages';

  const [activeView, setActiveView] = useState<DiscoveryView>(initialView);
  const [searchType, setSearchType] = useState<DiscoveryView>(initialView);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showSearchPopup, setShowSearchPopup] = useState(
    !searchParams.get('search') && !searchParams.get('packageId') && !searchParams.get('bookingId')
  );
  const switcherRef = useRef<HTMLDivElement | null>(null);
  const [showFloatingSwitcher, setShowFloatingSwitcher] = useState(false);

  useEffect(() => {
    setActiveView(initialView);
    setSearchType(initialView);
  }, [initialView]);

  useEffect(() => {
    const switcher = switcherRef.current;
    if (!switcher) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingSwitcher(!entry.isIntersecting && entry.boundingClientRect.top < 72),
      { threshold: 0, rootMargin: '-72px 0px 0px' }
    );
    observer.observe(switcher);
    return () => observer.disconnect();
  }, [activeView]);

  const openView = (view: DiscoveryView) => {
    setActiveView(view);
    setSearchTerm('');
    const next = new URLSearchParams(searchParams);
    next.set('view', view);
    next.delete('search');
    next.delete('destination');
    navigate(`/explore?${next.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams();
    next.set('view', searchType);
    if (searchTerm.trim()) next.set('search', searchTerm.trim());
    setActiveView(searchType);
    setShowSearchPopup(false);
    navigate(`/explore?${next.toString()}`);
  };

  const discoverySwitcher = (floating = false) => (
    <div
      ref={floating ? undefined : switcherRef}
      className={`${floating ? 'fixed top-[72px] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl shadow-xl' : 'w-full lg:w-auto min-w-0 lg:min-w-[360px] shadow-lg'} rounded-2xl border border-slate-200 bg-white/95 p-1.5 backdrop-blur-xl`}
    >
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => openView('packages')}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-extrabold transition-all ${activeView === 'packages' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <SuitcaseRolling size={18} weight="duotone" /> Holiday Packages
        </button>
        <button
          type="button"
          onClick={() => openView('destinations')}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-extrabold transition-all ${activeView === 'destinations' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <MapPin size={18} weight="duotone" /> Destinations
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {showFloatingSwitcher && discoverySwitcher(true)}

      {activeView === 'packages'
        ? <CustomerBookingPage discoveryNavigation={discoverySwitcher()} />
        : <DestinationsPage discoveryNavigation={discoverySwitcher()} />}

      <button
        onClick={() => setShowSearchPopup(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-2xl hover:bg-blue-700 transition-colors"
      >
        <MagnifyingGlass size={18} weight="bold" /> Search trips
      </button>

      {showSearchPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="travel-search-title">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-blue-700 via-sky-700 to-slate-900 px-6 py-7 text-white sm:px-8">
              <button onClick={() => setShowSearchPopup(false)} className="absolute right-5 top-5 rounded-full bg-white/15 p-2 hover:bg-white/25" aria-label="Close search">
                <X size={20} />
              </button>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold">
                <Compass size={15} /> Start your next trip
              </div>
              <h2 id="travel-search-title" className="font-heading text-2xl font-black sm:text-3xl">How would you like to search?</h2>
              <p className="mt-2 text-sm font-medium text-sky-100">Find a specific holiday package or explore everything available in a destination.</p>
            </div>

            <form onSubmit={submitSearch} className="space-y-5 p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setSearchType('packages')} className={`rounded-2xl border-2 p-4 text-left transition-all ${searchType === 'packages' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-200 hover:border-blue-300'}`}>
                  <SuitcaseRolling size={26} className="mb-2 text-blue-600" weight="duotone" />
                  <div className="font-extrabold text-slate-900">Search by holiday package</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">Name, activity, feature, itinerary, inclusion, theme, or agency</div>
                </button>
                <button type="button" onClick={() => setSearchType('destinations')} className={`rounded-2xl border-2 p-4 text-left transition-all ${searchType === 'destinations' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-200 hover:border-blue-300'}`}>
                  <MapPin size={26} className="mb-2 text-blue-600" weight="duotone" />
                  <div className="font-extrabold text-slate-900">Search by destination</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">City, country, region, landmark, experience, season, or trip style</div>
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">What are you looking for?</span>
                <div className="relative">
                  <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={searchType === 'packages' ? 'e.g. snorkeling, breakfast, family, desert safari' : 'e.g. beaches, winter, temples, Dubai'} className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </div>
              </label>

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700">
                Search {searchType === 'packages' ? 'Holiday Packages' : 'Destinations'} <ArrowRight size={18} weight="bold" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
