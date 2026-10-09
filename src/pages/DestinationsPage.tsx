import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Buildings,
  SuitcaseRolling,
  ArrowRight,
  MagnifyingGlass,
  SlidersHorizontal,
  Sparkle,
  Globe,
  AirplaneTakeoff,
  Sun,
  ShieldCheck,
  Compass,
  Star,
  CaretRight,
  CheckCircle,
  Clock
} from '@phosphor-icons/react';
import { getPackages, getAgencies } from '../data/mockData';
import { TravelPackage, AgencyPartner } from '../types';
import { getPackageLocation } from '../utils/destinationLocation';

interface ExtendedDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  imageUrl: string;
  agencyCount: number;
  packageCount: number;
  featuredTag?: string;
  bestSeason: string;
  weather: string;
  startingPrice: number;
  highlights: string[];
  description: string;
}

const ALL_DESTINATIONS: ExtendedDestination[] = [
  {
    id: 'dest-1',
    name: 'Dubai & UAE',
    country: 'United Arab Emirates',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    agencyCount: 210,
    packageCount: 680,
    featuredTag: 'Top Selling',
    bestSeason: 'Nov - Apr',
    weather: '26°C Sunny',
    startingPrice: 599,
    highlights: ['Burj Khalifa & Sky Views', 'Red Dunes VIP Desert Safari', 'Dubai Marina Luxury Yacht', 'Palm Jumeirah'],
    description: 'Futuristic skyscrapers meet Arabian heritage and world-class luxury shopping and desert safaris.'
  },
  {
    id: 'dest-2',
    name: 'Maldives Overwater',
    country: 'Maldives',
    region: 'Island Getaways',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    agencyCount: 145,
    packageCount: 420,
    featuredTag: 'Honeymoon Choice',
    bestSeason: 'Dec - Apr',
    weather: '29°C Tropical',
    startingPrice: 1299,
    highlights: ['Overwater Pool Villas', 'Manta Ray Coral Snorkeling', 'Sunset Seaplane Flights', 'Private Sandbank Dining'],
    description: 'Turquoise lagoons, coral reefs, and ultra-private luxury villas over crystal clear waters.'
  },
  {
    id: 'dest-3',
    name: 'Bali & Nusa Penida',
    country: 'Indonesia',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    agencyCount: 180,
    packageCount: 530,
    featuredTag: 'Trending',
    bestSeason: 'Apr - Oct',
    weather: '28°C Warm',
    startingPrice: 489,
    highlights: ['Ubud Rice Terraces & Jungle Swings', 'Nusa Penida Kelingking Beach', 'Uluwatu Sunset Temple', 'Mount Batur Sunrise'],
    description: 'Lush tropical valleys, spiritual temples, vibrant nightlife, and iconic cliffside island beaches.'
  },
  {
    id: 'dest-4',
    name: 'Swiss Alps & Zurich',
    country: 'Switzerland',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    agencyCount: 95,
    packageCount: 310,
    featuredTag: 'Scenic Luxury',
    bestSeason: 'May - Oct & Dec - Mar',
    weather: '18°C Alpine',
    startingPrice: 1699,
    highlights: ['Glacier Express Scenic Train', 'Jungfraujoch Top of Europe', 'Matterhorn Zermatt Excursions', 'Lake Geneva Cruise'],
    description: 'Snow-capped peaks, scenic panoramic railways, serene alpine lakes, and historic Swiss villages.'
  },
  {
    id: 'dest-5',
    name: 'Thailand & Phuket',
    country: 'Thailand',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1506665531195-3566af294e99?auto=format&fit=crop&w=800&q=80',
    agencyCount: 160,
    packageCount: 490,
    featuredTag: 'Value Leisure',
    bestSeason: 'Nov - Apr',
    weather: '30°C Tropical',
    startingPrice: 429,
    highlights: ['Phi Phi Islands Speedboat', 'Bangkok Grand Palace', 'Elephant Sanctuaries Chiang Mai', 'Floating Night Markets'],
    description: 'World-famous street food, golden Buddhist temples, warm hospitality, and emerald island coves.'
  },
  {
    id: 'dest-6',
    name: 'Kashmir & Himalayas',
    country: 'India',
    region: 'India',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    agencyCount: 115,
    packageCount: 340,
    featuredTag: 'Paradise on Earth',
    bestSeason: 'Mar - Oct & Winter Snow',
    weather: '16°C Fresh',
    startingPrice: 349,
    highlights: ['Dal Lake Houseboat & Shikara', 'Gulmarg Gondola Phase 2', 'Pahalgam Valley of Shepherds', 'Sonamarg Glaciers'],
    description: 'Snowy Himalayan summits, blooming saffron fields, Mughal gardens, and peaceful pine valleys.'
  },
  {
    id: 'dest-7',
    name: 'Goa Coastal Getaways',
    country: 'India',
    region: 'India',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    agencyCount: 130,
    packageCount: 375,
    featuredTag: 'Sun & Sand',
    bestSeason: 'Oct - May',
    weather: '29°C Coastal',
    startingPrice: 289,
    highlights: ['North Goa Beach Clubs', 'South Goa Heritage Villas', 'Dudhsagar Waterfalls Jeep Safari', 'Mandovi River Cruises'],
    description: 'Golden sands, Portuguese colonial architecture, seaside shacks, water sports, and vibrant music festivals.'
  },
  {
    id: 'dest-8',
    name: 'Tokyo & Kyoto',
    country: 'Japan',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    agencyCount: 88,
    packageCount: 260,
    featuredTag: 'Cultural Wonder',
    bestSeason: 'Mar - May & Sep - Nov',
    weather: '20°C Mild',
    startingPrice: 1450,
    highlights: ['Shibuya Crossing & Shinjuku', 'Fushimi Inari Shrine Gates', 'Bullet Train to Mount Fuji', 'Arashiyama Bamboo Forest'],
    description: 'Ancient tea ceremonies and shrines blended seamlessly with high-tech neon metropolises.'
  },
  {
    id: 'dest-9',
    name: 'Santorini & Greek Isles',
    country: 'Greece',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    agencyCount: 74,
    packageCount: 215,
    featuredTag: 'Romantic Views',
    bestSeason: 'May - Oct',
    weather: '25°C Mediterranean',
    startingPrice: 1380,
    highlights: ['Oia Sunset Caldera Views', 'Red Beach Catamaran Cruises', 'Akrotiri Archaeological Ruins', 'Fira Cliffside Cafes'],
    description: 'Iconic whitewashed cubic villages, blue-domed churches, and volcanic cliffs overlooking the Aegean Sea.'
  }
];

interface DestinationsPageProps {
  discoveryNavigation?: React.ReactNode;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ discoveryNavigation }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'priceAsc' | 'packages'>('popularity');
  const [visibleDestinationCount, setVisibleDestinationCount] = useState(6);
  const destinationLoadMoreRef = useRef<HTMLDivElement | null>(null);

  // Dynamic packages & agencies from storage to show live counts
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [agencies, setAgencies] = useState<AgencyPartner[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPackages(getPackages());
    setAgencies(getAgencies());
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const connectedDestinations = useMemo(() => {
    const liveAgencies = new Map<string, AgencyPartner>(agencies.map(agency => [agency.id, agency]));
    const groups = new Map<string, { location: ReturnType<typeof getPackageLocation>; packages: TravelPackage[] }>();

    packages.forEach(pkg => {
      if (pkg.status !== 'APPROVED' || pkg.deletedAt || !pkg.agencyId) return;
      const agency = liveAgencies.get(pkg.agencyId);
      if (!agency) return;
      const location = getPackageLocation(pkg, agency);
      const group = groups.get(location.key) || { location, packages: [] };
      group.packages.push(pkg);
      groups.set(location.key, group);
    });

    return [...groups.values()].map(({ location, packages: relatedPackages }) => {
      const metadata = ALL_DESTINATIONS.find(item =>
        item.country.toLowerCase() === location.country.toLowerCase() &&
        (item.name.toLowerCase().includes(location.place.toLowerCase()) || location.place.toLowerCase().includes(item.name.split(/[&,]/)[0].trim().toLowerCase()))
      ) || ALL_DESTINATIONS.find(item => item.country.toLowerCase() === location.country.toLowerCase());
      const prices = relatedPackages.map(pkg => pkg.startingPrice).filter((price): price is number => typeof price === 'number');
      const firstPackage = relatedPackages[0];

      return {
        id: location.key,
        name: location.place,
        country: location.country,
        region: location.region,
        imageUrl: firstPackage.imageUrl || metadata?.imageUrl || '',
        agencyCount: new Set(relatedPackages.map(pkg => pkg.agencyId)).size,
        packageCount: relatedPackages.length,
        featuredTag: relatedPackages.some(pkg => pkg.featured) ? 'Featured' : undefined,
        bestSeason: firstPackage.season || metadata?.bestSeason || 'See package details',
        weather: metadata?.weather || 'Travel Ready',
        startingPrice: prices.length ? Math.min(...prices) : 0,
        highlights: [...new Set(relatedPackages.flatMap(pkg => pkg.highlights || []))].slice(0, 4),
        description: firstPackage.overview || metadata?.description || `Explore verified packages for ${location.place}, ${location.country}.`
      } satisfies ExtendedDestination;
    });
  }, [agencies, packages]);

  const regions = useMemo(() => ['All', ...new Set(connectedDestinations.map(destination => destination.region))], [connectedDestinations]);

  const filteredDestinations = useMemo(() => {
    return connectedDestinations.filter(dest => {
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const destinationSearchText = [
        dest.name,
        dest.country,
        dest.region,
        dest.featuredTag,
        dest.bestSeason,
        dest.weather,
        dest.description,
        ...dest.highlights
      ].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => destinationSearchText.includes(term));

      const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;

      return matchesSearch && matchesRegion;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.startingPrice - b.startingPrice;
      if (sortBy === 'packages') return b.packageCount - a.packageCount;
      return b.agencyCount - a.agencyCount;
    });
  }, [connectedDestinations, searchQuery, selectedRegion, sortBy]);

  const visibleDestinations = useMemo(
    () => filteredDestinations.slice(0, visibleDestinationCount),
    [filteredDestinations, visibleDestinationCount]
  );

  useEffect(() => {
    setVisibleDestinationCount(6);
  }, [searchQuery, selectedRegion, sortBy]);

  useEffect(() => {
    const target = destinationLoadMoreRef.current;
    if (!target || visibleDestinationCount >= filteredDestinations.length) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setVisibleDestinationCount(count => Math.min(count + 6, filteredDestinations.length));
        }
      },
      { rootMargin: '240px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredDestinations.length, visibleDestinationCount]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Top Breadcrumb & Hero Header */}
      <div className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white relative overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300/80 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <CaretRight size={12} />
            <span className="text-white font-bold">Global Destinations</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold mb-4 backdrop-blur-md">
              <Compass size={14} className="animate-spin-slow" />
              <span>{connectedDestinations.length} Connected Travel Destinations</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Explore Verified Travel{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Destinations & DMCs
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Discover verified local ground operators, high-performing destination management companies, and authentic curated holiday packages worldwide.
            </p>
          </div>
          <div className="w-full lg:w-auto shrink-0">{discoveryNavigation}</div>
          </div>

          {/* Quick Search & Filter Toolbar */}
          <div className="mt-10 p-3 sm:p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search Bar */}
              <div className="md:col-span-7 relative">
                <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destination, country, or landmark (e.g. Dubai, Bali, Alps)..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/95 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-inner"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/95 text-slate-800 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-inner"
                >
                  <option value="popularity">Most Popular DMCs</option>
                  <option value="packages">Most Packages Listed</option>
                  <option value="priceAsc">Lowest Starting Price</option>
                </select>
              </div>

              {/* View Holiday Packages Button */}
              <div className="md:col-span-2">
                <Link
                  to="/explore?view=packages"
                  className="w-full h-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all"
                >
                  <span>Book Trips</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Region Tabs & Live Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Region Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-blue-600 font-extrabold">{Math.min(visibleDestinationCount, filteredDestinations.length)}</span> of {filteredDestinations.length} Destinations
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {visibleDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Hero Destination Image */}
                <div className="h-60 relative overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    {dest.featuredTag && (
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow">
                        {dest.featuredTag}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                      {dest.region}
                    </span>
                  </div>

                  {/* Weather / Season Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-extrabold shadow">
                    <Sun size={14} className="text-amber-500" weight="fill" />
                    <span>{dest.weather}</span>
                  </div>

                  {/* Bottom Image Destination Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-sky-300 font-bold mb-1">
                      <MapPin size={14} weight="fill" />
                      <span>{dest.country}</span>
                    </div>
                    <h3 className="font-heading text-2xl font-black text-white group-hover:text-sky-300 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Description & Key Highlights */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {dest.description}
                  </p>

                  {/* Highlights Tags */}
                  <div>
                    <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
                      Top Highlights & Sights
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Sparkle size={10} className="text-blue-500" />
                          <span>{highlight}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Best Season & Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Best Season</div>
                        <div className="font-bold text-slate-800">{dest.bestSeason}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Buildings size={16} className="text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Verified DMCs</div>
                        <div className="font-bold text-slate-800">{dest.agencyCount}+ Partners</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Footer with Price & Actions */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Packages From</div>
                  <div className="text-lg font-black text-slate-900">
                    ₹{dest.startingPrice}{' '}
                    <span className="text-xs font-normal text-slate-500">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/explore?view=packages&destination=${encodeURIComponent(dest.id)}`}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>View Trips</span>
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {visibleDestinationCount < filteredDestinations.length && (
          <div ref={destinationLoadMoreRef} className="flex min-h-24 items-center justify-center" aria-live="polite">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Loading more destinations…
            </div>
          </div>
        )}

        {/* Global Partner & DMC Callout Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-sky-300 text-xs font-bold mb-3">
              <ShieldCheck size={14} weight="fill" className="text-sky-300" />
              <span>DMC Partner Acquisition Program</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-4xl font-black text-white leading-tight">
              Are you a licensed DMC or Tour Operator in one of these destinations?
            </h3>
            <p className="mt-3 text-sm text-slate-300 font-medium">
              Join our verified destination management companies. Publish connected holiday packages, showcase your commercial license, and receive direct inquiries with 0% platform commission.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full lg:w-auto">
            <Link
              to="/benefits#agency-onboarding"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm text-center shadow-lg transition-all"
            >
              List Your DMC on Triiply
            </Link>
            <Link
              to="/benefits"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm text-center backdrop-blur-md transition-all"
            >
              See Partner Benefits
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
