import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  getPackages,
  getAgencies,
  getBookings,
  addBooking,
  getBookingById,
  cancelBooking
} from '../data/mockData';
import { syncPackagesFromBackend } from '../data/packageService';
import { api } from '../services/api';
import { TravelPackage, CustomerBooking, BookingStatus } from '../types';
import { getPackageLocation } from '../utils/destinationLocation';
import { InstagramVerifiedBadge } from '../components/InstagramVerifiedBadge';
import {
  SuitcaseRolling,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle,
  Users,
  Star,
  MagnifyingGlass,
  SlidersHorizontal,
  X,
  CreditCard,
  Printer,
  WhatsappLogo,
  Phone,
  Envelope,
  Check,
  Tag,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  Info,
  WarningCircle,
  Buildings,
  Car,
  FirstAid,
  AirplaneTilt,
  Receipt,
  Bed,
  CaretDown,
  CaretUp,
  ShareNetwork,
  DownloadSimple
} from '@phosphor-icons/react';

const CARDS_PER_PAGE = 6;

const searchableText = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).toLowerCase();
  if (Array.isArray(value)) return value.map(searchableText).join(' ');
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).map(searchableText).join(' ');
  return '';
};

interface CustomerBookingPageProps {
  discoveryNavigation?: React.ReactNode;
}

export default function CustomerBookingPage({ discoveryNavigation }: CustomerBookingPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active View Tab: 'explore' | 'manage' | 'trust'
  const [activeTab, setActiveTab] = useState<'explore' | 'manage' | 'trust'>('explore');

  // Package Data
  const [allPackages, setAllPackages] = useState<TravelPackage[]>(() => {
    const list = getPackages();
    return list.filter(p => (p.status || 'APPROVED') === 'APPROVED');
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [selectedDestination, setSelectedDestination] = useState(searchParams.get('destination') || 'All');
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(
    searchParams.get('agencyId') || searchParams.get('agency') || ''
  );
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [priceLimit, setPriceLimit] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'rating'>('recommended');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visiblePackageCount, setVisiblePackageCount] = useState(CARDS_PER_PAGE);
  const packageLoadMoreRef = useRef<HTMLDivElement | null>(null);

  // Sync state when URL searchParams update
  useEffect(() => {
    const aid = searchParams.get('agencyId') || searchParams.get('agency') || '';
    setSelectedAgencyId(aid);

    const q = searchParams.get('search') || '';
    setSearchQuery(q);
    setSelectedDestination(searchParams.get('destination') || 'All');
  }, [searchParams]);

  // Selected Package for Quick View Preview
  const [quickViewPackage, setQuickViewPackage] = useState<TravelPackage | null>(null);

  // Booking Flow States
  const [bookingPackage, setBookingPackage] = useState<TravelPackage | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Trip Customization
  const [travelDate, setTravelDate] = useState<string>(() => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 21);
    return nextMonth.toISOString().slice(0, 10);
  });
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [infantsCount, setInfantsCount] = useState<number>(0);
  const [selectedRoomTier, setSelectedRoomTier] = useState<{ id: string; name: string; pricePerNight: number }>({
    id: 'std',
    name: 'Standard Deluxe Room (Included)',
    pricePerNight: 0
  });
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Step 2: Guest Details
  const [leadGuest, setLeadGuest] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'India',
    dietaryPreference: 'None',
    specialRequests: ''
  });
  const [coTravelers, setCoTravelers] = useState<string[]>(['']);

  // Step 3: Request review and promo
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent?: number; amount?: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Step 4: Finalized Confirmation
  const [completedBooking, setCompletedBooking] = useState<CustomerBooking | null>(null);

  // Manage Bookings Lookup States
  const [lookupBookingId, setLookupBookingId] = useState(searchParams.get('bookingId') || '');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupResult, setLookupResult] = useState<CustomerBooking | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);
  const [cancelModalBookingId, setCancelModalBookingId] = useState<string | null>(null);

  const refreshPackages = () => {
    const list = getPackages();
    const approved = list.filter(p => (p.status || 'APPROVED') === 'APPROVED');
    setAllPackages(approved);
  };

  // Sync latest packages from storage and backend
  useEffect(() => {
    refreshPackages();

    syncPackagesFromBackend()
      .then(() => refreshPackages())
      .catch(() => { });

    window.addEventListener('triiply_packages_updated', refreshPackages);
    window.addEventListener('triiply_bookings_updated', refreshPackages);
    window.addEventListener('storage', refreshPackages);

    return () => {
      window.removeEventListener('triiply_packages_updated', refreshPackages);
      window.removeEventListener('triiply_bookings_updated', refreshPackages);
      window.removeEventListener('storage', refreshPackages);
    };
  }, []);

  // Auto-select package if packageId is passed via URL query
  useEffect(() => {
    const pkgId = searchParams.get('packageId');
    if (pkgId) {
      const found = allPackages.find(p => p.id === pkgId) || getPackages().find(p => p.id === pkgId);
      if (found) {
        setBookingPackage(found);
        setBookingStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [searchParams, allPackages]);

  // Update coTravelers array length when adults + children change
  useEffect(() => {
    const totalCoTravelers = Math.max(0, adultsCount + childrenCount - 1);
    setCoTravelers(prev => {
      const next = [...prev];
      if (next.length < totalCoTravelers) {
        while (next.length < totalCoTravelers) next.push('');
      } else if (next.length > totalCoTravelers) {
        return next.slice(0, totalCoTravelers);
      }
      return next;
    });
  }, [adultsCount, childrenCount]);

  // Resolve active agency details when filtered by agency
  const activeAgency = useMemo(() => {
    if (!selectedAgencyId) return null;
    const agencies = getAgencies();
    const target = selectedAgencyId.trim().toLowerCase();
    return agencies.find(a =>
      a.id.toLowerCase() === target ||
      a.name.toLowerCase() === target ||
      (a.slug && a.slug.toLowerCase() === target)
    ) || null;
  }, [selectedAgencyId]);

  // Available Themes dynamically calculated
  const themes = useMemo(() => {
    const defaultThemes = ['All', 'Luxury & Desert', 'Honeymoon & Nature', 'Luxury & Rail', 'Mountains & Culture', 'Cultural & Heritage'];
    const packageThemes = Array.from(new Set(allPackages.map(p => p.theme || p.category).filter(Boolean))) as string[];
    return Array.from(new Set([...defaultThemes, ...packageThemes]));
  }, [allPackages]);

  const agencyById = useMemo(() => new Map(getAgencies().map(agency => [agency.id, agency] as const)), [allPackages]);

  const destinationOptions = useMemo(() => {
    const locations = new Map<string, ReturnType<typeof getPackageLocation>>();
    allPackages.forEach(pkg => {
      const location = getPackageLocation(pkg, pkg.agencyId ? agencyById.get(pkg.agencyId) : undefined);
      locations.set(location.key, location);
    });
    return [...locations.values()].sort((a, b) => a.country.localeCompare(b.country) || a.place.localeCompare(b.place));
  }, [allPackages, agencyById]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return allPackages.filter(pkg => {
      const agency = pkg.agencyId ? agencyById.get(pkg.agencyId) : undefined;
      const packageLocation = getPackageLocation(pkg, agency);
      if (selectedDestination !== 'All') {
        const selected = selectedDestination.toLowerCase();
        if (packageLocation.key !== selected && packageLocation.label.toLowerCase() !== selected && packageLocation.place.toLowerCase() !== selected) return false;
      }
      // If agency filter is active, strictly match this agency
      if (selectedAgencyId) {
        const pkgAgencyId = (pkg.agencyId || '').toLowerCase();
        const filterTarget = selectedAgencyId.trim().toLowerCase();
        const activeAgId = (activeAgency?.id || '').toLowerCase();
        const activeAgName = (activeAgency?.name || '').toLowerCase();
        const pkgAgencyName = (pkg.agencyName || '').toLowerCase();

        const matchesId = pkgAgencyId === filterTarget || (activeAgId && pkgAgencyId === activeAgId);
        const matchesName = (activeAgName && pkgAgencyName === activeAgName) || pkgAgencyName === filterTarget;

        const mentionsAgency = activeAgName && (
          pkg.title.toLowerCase().includes(activeAgName) ||
          (pkg.overview && pkg.overview.toLowerCase().includes(activeAgName))
        );

        if (!matchesId && !matchesName && !mentionsAgency) {
          return false;
        }
      }

      const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const packageSearchText = searchableText({
        title: pkg.title,
        destination: pkg.destination,
        departureLocation: pkg.departureLocation,
        category: pkg.category,
        theme: pkg.theme,
        overview: pkg.overview,
        highlights: pkg.highlights,
        inclusions: pkg.inclusions,
        included: pkg.included,
        itinerary: pkg.itinerary,
        addons: pkg.addons,
        travellerTypes: pkg.travellerTypes,
        season: pkg.season,
        transportType: pkg.transportType,
        hotelCategory: pkg.hotelCategory,
        mealPlan: pkg.mealPlan,
        sightseeingDetails: pkg.sightseeingDetails,
        pickupInfo: pkg.pickupInfo,
        dropInfo: pkg.dropInfo,
        importantNotes: pkg.importantNotes,
        agencyName: pkg.agencyName,
        agencyType: pkg.agencyType
      });
      const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => packageSearchText.includes(term));

      const matchesTheme = selectedTheme === 'All' || pkg.theme === selectedTheme || pkg.category === selectedTheme;

      const price = pkg.startingPrice || (pkg.priceEstimate ? parseInt(pkg.priceEstimate.replace(/[^0-9]/g, '')) || 1000 : 1000);
      const matchesPrice = price <= priceLimit;

      const days = pkg.days || (pkg.duration ? parseInt(pkg.duration) || 5 : 5);
      let matchesDuration = true;
      if (selectedDuration === 'Short (1-4 Days)') matchesDuration = days <= 4;
      else if (selectedDuration === 'Medium (5-7 Days)') matchesDuration = days >= 5 && days <= 7;
      else if (selectedDuration === 'Long (8+ Days)') matchesDuration = days >= 8;

      return matchesSearch && matchesTheme && matchesPrice && matchesDuration;
    }).sort((a, b) => {
      const priceA = a.startingPrice || (a.priceEstimate ? parseInt(a.priceEstimate.replace(/[^0-9]/g, '')) || 1000 : 1000);
      const priceB = b.startingPrice || (b.priceEstimate ? parseInt(b.priceEstimate.replace(/[^0-9]/g, '')) || 1000 : 1000);
      if (sortBy === 'priceAsc') return priceA - priceB;
      if (sortBy === 'priceDesc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
      return 0; // recommended
    });
  }, [allPackages, agencyById, selectedAgencyId, activeAgency, selectedDestination, searchQuery, selectedTheme, selectedDuration, priceLimit, sortBy]);

  const visiblePackages = useMemo(
    () => filteredPackages.slice(0, visiblePackageCount),
    [filteredPackages, visiblePackageCount]
  );

  useEffect(() => {
    setVisiblePackageCount(CARDS_PER_PAGE);
  }, [searchQuery, selectedAgencyId, selectedDestination, selectedTheme, selectedDuration, priceLimit, sortBy]);

  useEffect(() => {
    const target = packageLoadMoreRef.current;
    if (!target || visiblePackageCount >= filteredPackages.length) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setVisiblePackageCount(count => Math.min(count + CARDS_PER_PAGE, filteredPackages.length));
        }
      },
      { rootMargin: '240px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredPackages.length, visiblePackageCount]);

  // Available room upgrade options for the selected booking package
  const roomTiers = useMemo(() => [
    { id: 'std', name: 'Standard 4-Star Deluxe Room (Included)', pricePerNight: 0, description: 'Comfortable twin/king room with city/garden view and daily breakfast.' },
    { id: 'premium', name: 'Premium Ocean / Mountain View Room', pricePerNight: 45, description: 'Higher floor panoramic views, upgraded bathroom amenities, and lounge access.' },
    { id: 'luxury', name: 'VIP Suite / Private Pool Villa Upgrade', pricePerNight: 120, description: 'Spacious signature suite or private pool villa with personal butler service.' }
  ], []);

  // Available add-ons for the selected package
  const availableAddons = useMemo(() => {
    if (!bookingPackage) return [];
    if (bookingPackage.addons && bookingPackage.addons.length > 0) {
      return bookingPackage.addons;
    }
    // Default customer add-ons if package doesn't define custom ones
    return [
      { id: 'addon-airport', name: 'Private VIP Airport Pick-up & Drop', price: 75, description: 'Chauffeured luxury vehicle directly to your hotel with flight delay tracking.' },
      { id: 'addon-insure', name: 'Full Medical & Trip Cancellation Insurance', price: 40, description: 'Comprehensive coverage including baggage delay and emergency assistance.' },
      { id: 'addon-dinner', name: 'Special Sunset Candlelight Dinner Cruise', price: 95, description: 'Romantic 4-course gourmet dinner with live music and scenic skyline views.' },
      { id: 'addon-sim', name: 'Unlimited 5G Tourist eSIM / Pocket Wi-Fi', price: 25, description: 'Stay connected seamlessly throughout your entire holiday duration.' }
    ];
  }, [bookingPackage]);

  // Dynamic live pricing computation for current booking configuration
  const calculatedPricing = useMemo(() => {
    if (!bookingPackage) {
      return {
        basePricePerAdult: 0,
        childPricePerChild: 0,
        adultsCount: 0,
        childrenCount: 0,
        infantsCount: 0,
        subtotal: 0,
        addonsTotal: 0,
        roomUpgradeCost: 0,
        taxesAndFees: 0,
        discount: 0,
        totalAmount: 0,
        depositAmount: 0,
        currency: '₹'
      };
    }

    const baseAdult = bookingPackage.startingPrice || 650;
    const baseChild = Math.round(baseAdult * 0.5); // 50% discount for children under 12
    const durationNights = bookingPackage.nights || (bookingPackage.days ? Math.max(1, bookingPackage.days - 1) : 4);

    const adultsTotal = baseAdult * adultsCount;
    const childrenTotal = baseChild * childrenCount;
    const subtotal = adultsTotal + childrenTotal;

    // Room upgrade calculation
    const roomUpgradeCost = selectedRoomTier.pricePerNight * durationNights;

    // Addons calculation
    const selectedAddons = availableAddons.filter(a => selectedAddonIds.includes(a.id));
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

    // Taxes & Tourism Regulatory Fees (e.g. 5%)
    const taxesAndFees = Math.round((subtotal + roomUpgradeCost + addonsTotal) * 0.05);

    // Discount Calculation
    let discount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.percent) {
        discount = Math.round((subtotal * appliedDiscount.percent) / 100);
      } else if (appliedDiscount.amount) {
        discount = appliedDiscount.amount;
      }
    }

    const totalAmount = Math.max(0, subtotal + roomUpgradeCost + addonsTotal + taxesAndFees - discount);

    return {
      basePricePerAdult: baseAdult,
      childPricePerChild: baseChild,
      adultsCount,
      childrenCount,
      infantsCount,
      subtotal,
      addonsTotal,
      roomUpgradeCost,
      taxesAndFees,
      discount,
      totalAmount,
      depositAmount: 0,
      currency: bookingPackage.currency || '₹'
    };
  }, [bookingPackage, adultsCount, childrenCount, infantsCount, selectedRoomTier, selectedAddonIds, availableAddons, appliedDiscount]);

  // Handle Promo Code Apply
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'HOLIDAY10' || code === 'SAVE10') {
      setAppliedDiscount({ code, percent: 10 });
    } else if (code === 'WELCOME50' || code === 'TRIP50') {
      setAppliedDiscount({ code, amount: 50 });
    } else if (code === 'SUMMER2026') {
      setAppliedDiscount({ code, percent: 15 });
    } else {
      setPromoError('Invalid coupon code. Try "HOLIDAY10" for 10% off or "WELCOME50" for ₹50 off.');
    }
  };

  // Launch Booking flow for a specific package
  const handleStartBooking = (pkg: TravelPackage) => {
    setBookingPackage(pkg);
    setBookingStep(1);
    setQuickViewPackage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit a request for the Triply team to confirm after a call.
  const handleFinalizeBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPackage || !leadGuest.fullName || !leadGuest.email || !leadGuest.phone) {
      alert('Please fill all required lead guest contact fields.');
      return;
    }

    const durationDays = bookingPackage.days || 5;
    const departureDateObj = new Date(travelDate);
    const returnDateObj = new Date(departureDateObj);
    returnDateObj.setDate(returnDateObj.getDate() + durationDays);

    const bookingId = `TRP-BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const selectedAddonsList = availableAddons
      .filter(a => selectedAddonIds.includes(a.id))
      .map(a => ({ id: a.id, name: a.name, price: a.price }));

    const newBooking: CustomerBooking = {
      id: bookingId,
      packageId: bookingPackage.id,
      packageTitle: bookingPackage.title,
      destination: bookingPackage.destination,
      duration: bookingPackage.duration || `${bookingPackage.days || 5} Days`,
      imageUrl: bookingPackage.imageUrl,
      agencyId: bookingPackage.agencyId || 'ag-1',
      agencyName: bookingPackage.agencyName || 'Verified Partner DMC',
      agencyLogo: bookingPackage.agencyLogo,
      departureCity: bookingPackage.departureLocation || `${bookingPackage.destination} International Airport`,
      travelDate: travelDate,
      returnDate: returnDateObj.toISOString().slice(0, 10),
      roomType: selectedRoomTier.name,
      leadGuest: { ...leadGuest },
      coTravelers: coTravelers.filter(Boolean),
      selectedAddons: selectedAddonsList,
      pricing: { ...calculatedPricing },
      paymentMode: 'HOLD_CARD',
      status: 'PENDING',
      bookingDate: new Date().toISOString(),
      promoCode: appliedDiscount?.code,
      notes: leadGuest.specialRequests || 'Customer booking generated on Triiply'
    };

    try {
      const response = await api.createBooking(newBooking);
      addBooking(response.booking);
      setCompletedBooking(response.booking);
      setBookingStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      alert(error.message || 'Unable to send your booking request. Please try again.');
    }
  };

  // Manage Bookings Search Handler
  const handleLookupBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupSearched(true);
    if (!lookupBookingId.trim()) return;

    const found = getBookingById(lookupBookingId.trim());
    if (found) {
      if (lookupEmail.trim() && found.leadGuest.email.toLowerCase() !== lookupEmail.trim().toLowerCase()) {
        setLookupResult(null);
      } else {
        setLookupResult(found);
      }
    } else {
      setLookupResult(null);
    }
  };

  // Cancel Booking
  const handleConfirmCancel = (id: string) => {
    cancelBooking(id, 'Cancelled by customer via Manage Bookings');
    const updated = getBookingById(id);
    if (updated) setLookupResult(updated);
    setCancelModalBookingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 pb-24 selection:bg-sky-500 selection:text-white">

      {/* Top Customer Brand Banner & Sub-Navigation */}
      <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="order-1 min-w-0">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Holiday Packages &amp; Instant Reservations
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-medium">
                Book verified itineraries directly with licensed local ground operators. Transparent pricing, 100% financial guarantee, and dedicated 24/7 on-trip concierge.
              </p>
            </div>

            <div className="order-2 w-full lg:w-auto shrink-0 self-stretch lg:self-auto">
              {discoveryNavigation}
            </div>
          </div>

          {/* Quick Perks Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span>100% Verified Local Operators</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-sky-400 shrink-0" />
              <span>Zero Hidden Card Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-400 shrink-0" />
              <span>Free Cancellation Flexibility</span>
            </div>
            <div className="flex items-center gap-2">
              <WhatsappLogo size={18} className="text-emerald-400 shrink-0" />
              <span>24/7 On-Trip WhatsApp Concierge</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: EXPLORE & BOOK TRIPS */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'explore' && (
          <div className="space-y-8 animate-in fade-in duration-200">

            {/* If actively inside 4-Step Checkout Wizard */}
            {bookingPackage ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

                {/* Wizard Top Progress Header */}
                <div className="bg-slate-900 text-white p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (bookingStep > 1 && bookingStep < 4) {
                          setBookingStep((bookingStep - 1) as any);
                        } else {
                          setBookingPackage(null);
                          setBookingStep(1);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Go Back"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Customer Booking Checkout</span>
                      <h2 className="font-heading text-lg sm:text-xl font-bold truncate max-w-md sm:max-w-xl">
                        {bookingPackage.title}
                      </h2>
                    </div>
                  </div>

                  {/* Steps Indicators */}
                  <div className="flex items-center gap-2 self-center sm:self-auto text-xs font-bold">
                    {[
                      { step: 1, label: 'Trip Options' },
                      { step: 2, label: 'Guest Info' },
                      { step: 3, label: 'Review' },
                      { step: 4, label: 'Request Sent' }
                    ].map(s => (
                      <div key={s.step} className="flex items-center gap-1.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${bookingStep === s.step
                            ? 'bg-blue-600 text-white shadow-md'
                            : bookingStep > s.step
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                          {bookingStep > s.step ? <Check size={12} weight="bold" /> : s.step}
                        </span>
                        <span className={`hidden md:inline ${bookingStep === s.step ? 'text-white' : 'text-slate-500'}`}>
                          {s.label}
                        </span>
                        {s.step < 4 && <span className="text-slate-700 mx-1">•</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── STEP 1: CUSTOMIZE DATES, GUESTS & ADDONS ── */}
                {bookingStep === 1 && (
                  <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Configuration */}
                    <div className="lg:col-span-2 space-y-6">

                      {/* Package Overview Mini Banner */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <img
                          src={bookingPackage.imageUrl}
                          alt={bookingPackage.title}
                          className="w-full sm:w-28 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-blue-600 font-bold mb-1">
                            <MapPin size={14} />
                            <span>{bookingPackage.destination}</span>
                            <span className="text-slate-300">•</span>
                            <Clock size={14} />
                            <span>{bookingPackage.duration}</span>
                          </div>
                          <h3 className="font-heading text-base font-bold text-slate-900">{bookingPackage.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 flex-wrap">
                            <span>Operated by <strong>{bookingPackage.agencyName}</strong></span>
                            {(bookingPackage.agencyVerified ?? true) && (
                              <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                            )}
                          </p>
                        </div>
                      </div>

                      {/* 1. Date Selection */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-blue-600" />
                          <h4 className="font-bold text-sm text-slate-900">1. Select Preferred Departure Date</h4>
                        </div>
                        <p className="text-xs text-slate-500">Choose your intended start date. Free date reschedule is available up to 7 days before departure.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Departure Date *</label>
                            <input
                              type="date"
                              required
                              value={travelDate}
                              onChange={(e) => setTravelDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs self-end">
                            <CheckCircle size={18} className="shrink-0 text-emerald-600" />
                            <span>Guaranteed daily departures available for this destination.</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Number of Guests */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-blue-600" />
                          <h4 className="font-bold text-sm text-slate-900">2. Number of Guests &amp; Travelers</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Adults */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-slate-900 block">Adults</span>
                              <span className="text-[10px] text-slate-500">Age 12+ yrs</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-bold text-xs text-slate-900 w-4 text-center">{adultsCount}</span>
                              <button
                                onClick={() => setAdultsCount(adultsCount + 1)}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-slate-900 block">Children</span>
                              <span className="text-[10px] text-emerald-600 font-semibold">50% Off (Age 2-11)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-bold text-xs text-slate-900 w-4 text-center">{childrenCount}</span>
                              <button
                                onClick={() => setChildrenCount(childrenCount + 1)}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Infants */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-slate-900 block">Infants</span>
                              <span className="text-[10px] text-emerald-600 font-semibold">Free (0-23 mos)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-bold text-xs text-slate-900 w-4 text-center">{infantsCount}</span>
                              <button
                                onClick={() => setInfantsCount(infantsCount + 1)}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Room & Accommodation Tier */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2">
                          <Bed size={18} className="text-blue-600" />
                          <h4 className="font-bold text-sm text-slate-900">3. Room &amp; Accommodation Options</h4>
                        </div>
                        <div className="space-y-2">
                          {roomTiers.map(tier => (
                            <label
                              key={tier.id}
                              onClick={() => setSelectedRoomTier(tier)}
                              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${selectedRoomTier.id === tier.id
                                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                                  : 'border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="roomTier"
                                  checked={selectedRoomTier.id === tier.id}
                                  onChange={() => setSelectedRoomTier(tier)}
                                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                  <span className="font-bold text-xs text-slate-900 block">{tier.name}</span>
                                  <span className="text-[11px] text-slate-500">{tier.description}</span>
                                </div>
                              </div>
                              <span className="font-bold text-xs text-blue-600 shrink-0">
                                {tier.pricePerNight === 0 ? 'Included' : `+₹${tier.pricePerNight}/night`}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 4. Curated Experience Add-ons */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkle size={18} className="text-blue-600" />
                          <h4 className="font-bold text-sm text-slate-900">4. Optional Experience Add-ons &amp; Protection</h4>
                        </div>
                        <div className="space-y-2">
                          {availableAddons.map(addon => {
                            const isSelected = selectedAddonIds.includes(addon.id);
                            return (
                              <label
                                key={addon.id}
                                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${isSelected
                                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                                    : 'border-slate-200 hover:bg-slate-50'
                                  }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedAddonIds([...selectedAddonIds, addon.id]);
                                      } else {
                                        setSelectedAddonIds(selectedAddonIds.filter(id => id !== addon.id));
                                      }
                                    }}
                                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                                  />
                                  <div>
                                    <span className="font-bold text-xs text-slate-900 block">{addon.name}</span>
                                    <span className="text-[11px] text-slate-500">{addon.description}</span>
                                  </div>
                                </div>
                                <span className="font-bold text-xs text-slate-900 shrink-0">+₹{addon.price}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Right Col: Sticky Price Summary & Next Button */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-24 rounded-3xl bg-slate-50 border border-slate-200 p-6 space-y-5">
                        <h4 className="font-heading text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
                          Price Calculation Summary
                        </h4>

                        <div className="space-y-2.5 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span>Adults ({adultsCount} × ₹{calculatedPricing.basePricePerAdult}):</span>
                            <span className="font-bold text-slate-900">₹{adultsCount * calculatedPricing.basePricePerAdult}</span>
                          </div>

                          {childrenCount > 0 && (
                            <div className="flex justify-between text-emerald-700">
                              <span>Children ({childrenCount} × ₹{calculatedPricing.childPricePerChild}):</span>
                              <span className="font-bold">₹{childrenCount * calculatedPricing.childPricePerChild}</span>
                            </div>
                          )}

                          {infantsCount > 0 && (
                            <div className="flex justify-between text-slate-500">
                              <span>Infants ({infantsCount}):</span>
                              <span className="font-bold text-emerald-600">Free</span>
                            </div>
                          )}

                          {calculatedPricing.roomUpgradeCost > 0 && (
                            <div className="flex justify-between">
                              <span>Room Upgrade:</span>
                              <span className="font-bold text-slate-900">+₹{calculatedPricing.roomUpgradeCost}</span>
                            </div>
                          )}

                          {calculatedPricing.addonsTotal > 0 && (
                            <div className="flex justify-between">
                              <span>Selected Add-ons:</span>
                              <span className="font-bold text-slate-900">+₹{calculatedPricing.addonsTotal}</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span>Regulatory Taxes &amp; Fees (5%):</span>
                            <span className="font-bold text-slate-900">+₹{calculatedPricing.taxesAndFees}</span>
                          </div>

                          {calculatedPricing.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                              <span>Coupon Discount:</span>
                              <span>-₹{calculatedPricing.discount}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
                          <span className="font-heading text-sm font-bold text-slate-900">Total Holiday Price:</span>
                          <div className="text-right">
                            <span className="font-heading text-2xl font-extrabold text-blue-600">
                              ₹{calculatedPricing.totalAmount.toLocaleString()}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-semibold">Taxes included</span>
                          </div>
                        </div>

                        {/* Next Action */}
                        <button
                          onClick={() => setBookingStep(2)}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Continue to Traveler Details</span>
                          <ArrowRight size={16} weight="bold" />
                        </button>

                        <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-800 flex items-center gap-2">
                          <ShieldCheck size={16} className="text-sky-600 shrink-0" />
                          <span>No charges applied at this step. Review terms before finalizing.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: GUEST & TRAVELER DETAILS ── */}
                {bookingStep === 2 && (
                  <form onSubmit={(e) => { e.preventDefault(); setBookingStep(3); }} className="p-6 sm:p-8 space-y-6">
                    <div className="max-w-3xl mx-auto space-y-6">

                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="font-heading text-lg font-bold text-slate-900">Primary Contact &amp; Guest Details</h3>
                        <p className="text-xs text-slate-500">Trip updates and your official booking confirmation voucher will be sent to these details.</p>
                      </div>

                      {/* Lead Guest Info */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-blue-600" />
                          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Lead Traveler Contact (Adult 1)</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name (as on Passport/ID) *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Johnathan Smith"
                              value={leadGuest.fullName}
                              onChange={(e) => setLeadGuest({ ...leadGuest, fullName: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address for Voucher *</label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. john@example.com"
                              value={leadGuest.email}
                              onChange={(e) => setLeadGuest({ ...leadGuest, email: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone Number (for Driver &amp; Concierge) *</label>
                            <input
                              type="tel"
                              required
                              placeholder="+1 (555) 234-5678"
                              value={leadGuest.phone}
                              onChange={(e) => setLeadGuest({ ...leadGuest, phone: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Country of Residence</label>
                            <select
                              value={leadGuest.country}
                              onChange={(e) => setLeadGuest({ ...leadGuest, country: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Canada">Canada</option>
                              <option value="Australia">Australia</option>
                              <option value="United Arab Emirates">United Arab Emirates</option>
                              <option value="India">India</option>
                              <option value="Singapore">Singapore</option>
                              <option value="Germany">Germany</option>
                              <option value="Other">Other Country</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Preferences</label>
                            <select
                              value={leadGuest.dietaryPreference}
                              onChange={(e) => setLeadGuest({ ...leadGuest, dietaryPreference: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="None">No Specific Restriction</option>
                              <option value="Vegetarian">Vegetarian</option>
                              <option value="Vegan">Vegan</option>
                              <option value="Halal">Halal</option>
                              <option value="Jain">Jain Vegetarian</option>
                              <option value="Gluten-Free">Gluten-Free</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Special Occasion / Notes</label>
                            <input
                              type="text"
                              placeholder="e.g. Honeymoon, Anniversary, High floor room"
                              value={leadGuest.specialRequests}
                              onChange={(e) => setLeadGuest({ ...leadGuest, specialRequests: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Co-Travelers (if more than 1 guest) */}
                      {coTravelers.length > 0 && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Additional Travelers ({coTravelers.length})</h4>
                          <p className="text-xs text-slate-500">Provide full names for hotel and tour manifest.</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {coTravelers.map((name, idx) => (
                              <div key={idx}>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Traveler {idx + 2} Full Name</label>
                                <input
                                  type="text"
                                  placeholder={`e.g. Guest ${idx + 2}`}
                                  value={name}
                                  onChange={(e) => {
                                    const next = [...coTravelers];
                                    next[idx] = e.target.value;
                                    setCoTravelers(next);
                                  }}
                                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Back to Options
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span>Proceed to Review &amp; Payment</span>
                          <ArrowRight size={16} weight="bold" />
                        </button>
                      </div>

                    </div>
                  </form>
                )}

                {/* ── STEP 3: REVIEW & PAYMENT SELECTION ── */}
                {bookingStep === 3 && (
                  <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading text-lg font-bold text-slate-900">Review Your Booking Request</h3>
                      <p className="text-xs text-slate-500">No online payment is collected. The Triply team will call you, collect payment separately, and confirm the booking from the admin portal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                      {/* Left 2 Cols: Summary & Payment Modes */}
                      <div className="md:col-span-2 space-y-5">

                        {/* Booking Details Card */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Trip Summary</h4>
                          <div className="grid grid-cols-2 gap-2 text-slate-700">
                            <div>
                              <span className="text-slate-400 block font-semibold">Package:</span>
                              <span className="font-bold text-slate-900">{bookingPackage.title}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Travel Date:</span>
                              <span className="font-bold text-slate-900">{travelDate}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Travelers:</span>
                              <span className="font-bold text-slate-900">{adultsCount} Adults {childrenCount > 0 ? `, ${childrenCount} Children` : ''}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Room Selection:</span>
                              <span className="font-bold text-slate-900">{selectedRoomTier.name}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Lead Traveler:</span>
                              <span className="font-bold text-slate-900">{leadGuest.fullName} ({leadGuest.phone})</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Fulfill Partner DMC:</span>
                              <span className="font-bold text-slate-900 flex items-center gap-1">
                                <span>{bookingPackage.agencyName}</span>
                                {(bookingPackage.agencyVerified ?? true) && (
                                  <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Promo Code Box */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200">
                          <form onSubmit={handleApplyPromo} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter Promo Code (e.g. HOLIDAY10)"
                              value={promoCodeInput}
                              onChange={(e) => setPromoCodeInput(e.target.value)}
                              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Apply
                            </button>
                          </form>
                          {appliedDiscount && (
                            <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                              <CheckCircle size={16} weight="fill" />
                              <span>Coupon '{appliedDiscount.code}' applied! You saved ${calculatedPricing.discount}</span>
                            </div>
                          )}
                          {promoError && (
                            <div className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1.5">
                              <WarningCircle size={16} weight="fill" />
                              <span>{promoError}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
                          <strong className="block mb-1">Triply-assisted confirmation</strong>
                          A Triply team member will verify availability and pricing by phone. Payment is collected offline by the team; only then will the Super Admin mark this request as confirmed.
                        </div>

                        {/* Cancellation Terms Checkbox */}
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 pt-1">
                          <input
                            type="checkbox"
                            required
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>
                            I accept the trip inclusions, cancellation terms (100% refund up to 7 days before travel), and acknowledge <strong>{bookingPackage.agencyName}</strong> as the licensed ground operator.
                          </span>
                        </label>

                      </div>

                      {/* Right Col: Price Breakdown & Confirmation CTA */}
                      <div className="md:col-span-1">
                        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 space-y-4">
                          <h4 className="font-heading text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                            Estimated Trip Total
                          </h4>

                          <div className="space-y-2 text-xs text-slate-600">
                            <div className="flex justify-between">
                              <span>Total Trip Cost:</span>
                              <span className="font-bold text-slate-900">₹{calculatedPricing.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-blue-600 font-bold border-t border-slate-200 pt-2 text-sm">
                              <span>Online payment:</span>
                              <span>$0</span>
                            </div>
                          </div>

                          <button
                            disabled={!acceptedTerms}
                            onClick={handleFinalizeBooking}
                            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${acceptedTerms
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20 hover:scale-[1.02]'
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                              }`}
                          >
                            <CheckCircle size={18} weight="bold" />
                            <span>Send Booking Request</span>
                          </button>

                          <div className="text-center pt-2">
                            <button
                              onClick={() => setBookingStep(2)}
                              className="text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                              ← Modify Guest Details
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ── STEP 4: CONFIRMED TRAVEL VOUCHER & PASS ── */}
                {bookingStep === 4 && completedBooking && (
                  <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-200">

                    {/* Top Success Banner */}
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle size={42} weight="fill" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                        Request Received • Reference #{completedBooking.id}
                      </span>
                      <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Thanks, {completedBooking.leadGuest.fullName.split(' ')[0]}! We Will Call You Soon.
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                        Your request for <strong>{completedBooking.packageTitle}</strong> is pending. The Triply team will call you, collect payment offline, and send confirmation after the Super Admin approves it.
                      </p>
                    </div>

                    {/* Official Printable Voucher Ticket Card */}
                    <div id="printable-voucher" className="rounded-3xl bg-white border-2 border-slate-900/10 shadow-2xl overflow-hidden relative">

                      {/* Ticket Top Ribbon */}
                      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-sky-900 text-white p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <SuitcaseRolling size={28} className="text-sky-400" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300 block">Triiply Booking Request Receipt</span>
                            <span className="font-mono text-sm font-extrabold">{completedBooking.id}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase">
                          {completedBooking.status}
                        </span>
                      </div>

                      {/* Ticket Body */}
                      <div className="p-6 space-y-5 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-100">
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Destination</span>
                            <span className="font-bold text-slate-900 text-sm">{completedBooking.destination}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Departure Date</span>
                            <span className="font-bold text-slate-900 text-sm">{completedBooking.travelDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Duration</span>
                            <span className="font-bold text-slate-900 text-sm">{completedBooking.duration}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Total Guests</span>
                            <span className="font-bold text-slate-900 text-sm">
                              {completedBooking.pricing.adultsCount} Adults {completedBooking.pricing.childrenCount > 0 ? `, ${completedBooking.pricing.childrenCount} Ch` : ''}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Lead Traveler</span>
                            <span className="font-bold text-slate-900 block">{completedBooking.leadGuest.fullName}</span>
                            <span className="text-slate-500">{completedBooking.leadGuest.email} • {completedBooking.leadGuest.phone}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Ground Operator</span>
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{completedBooking.agencyName}</span>
                              <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                            </span>
                            <span className="text-emerald-600 font-semibold">✓ Verified Local DMC Guarantee</span>
                          </div>
                        </div>

                        {/* Room & Addons */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Room Configuration:</span>
                            <span className="font-bold text-slate-900">{completedBooking.roomType}</span>
                          </div>

                          {completedBooking.selectedAddons.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-semibold">Confirmed Add-ons:</span>
                              <span className="font-bold text-slate-900">
                                {completedBooking.selectedAddons.map(a => a.name).join(', ')}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between pt-2 border-t border-slate-200">
                            <span className="text-slate-700 font-bold">Payment collected online:</span>
                            <span className="font-bold text-blue-600 text-sm">
                              $0 — pending Triply team call
                            </span>
                          </div>
                        </div>

                        {/* Concierge Hotline */}
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
                          <div className="flex items-center gap-2.5">
                            <WhatsappLogo size={24} className="text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-bold block">Need immediate trip assistance?</span>
                              <span className="text-[11px] text-emerald-700">Your dedicated concierge desk is available 24/7 on WhatsApp.</span>
                            </div>
                          </div>
                          <a
                            href={`https://wa.me/?text=Hello%2C%20I%20have%20a%20question%20regarding%20my%20Triiply%20booking%20${completedBooking.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 text-center shadow-xs"
                          >
                            Chat on WhatsApp
                          </a>
                        </div>
                      </div>

                      {/* Ticket Footer Tear-Off Styling */}
                      <div className="bg-slate-100 px-6 py-3 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Issued on {new Date(completedBooking.bookingDate).toLocaleDateString()}</span>
                        <span className="font-mono">BARCODE: ||| | |||| | || ||||| {completedBooking.id.replace(/[^0-9]/g, '')}</span>
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => window.print()}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Printer size={16} />
                        <span>Print / Save Request Receipt</span>
                      </button>

                      <button
                        onClick={() => {
                          setLookupBookingId(completedBooking.id);
                          setLookupEmail(completedBooking.leadGuest.email);
                          setLookupResult(completedBooking);
                          setActiveTab('manage');
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Receipt size={16} />
                        <span>View in Manage Bookings</span>
                      </button>

                      <button
                        onClick={() => {
                          setBookingPackage(null);
                          setBookingStep(1);
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Explore More Trips
                      </button>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              /* ── NORMAL PACKAGES BROWSER & SEARCH EXPERIENCE ── */
              <div className="space-y-6">

                {/* Search & Filter Top Bar Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-lg space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                    {/* Exact Country + Place Filter */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Where to?</label>
                      <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="All">All countries and places</option>
                        {destinationOptions.map(location => <option key={location.key} value={location.key}>{location.label}</option>)}
                      </select>
                    </div>

                    <div className="relative">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Keyword</label>
                      <MagnifyingGlass size={16} className="absolute left-3.5 bottom-3 text-slate-400" />
                      <input type="text" placeholder="Package, activity, agency..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Trip Theme */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trip Style</label>
                      <select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {themes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Duration Filter */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</label>
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All Durations</option>
                        <option value="Short (1-4 Days)">Short (1-4 Days)</option>
                        <option value="Medium (5-7 Days)">Medium (5-7 Days)</option>
                        <option value="Long (8+ Days)">Long (8+ Days)</option>
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="recommended">Featured / Recommended</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="rating">Highest Customer Rating</option>
                      </select>
                    </div>

                  </div>

                  {/* Themes Quick-Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Popular:</span>
                    {themes.map(theme => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${selectedTheme === theme
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Agency Filter Header Banner (Rendered Below Search & Filter) */}
                {selectedAgencyId && (
                  <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-blue-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3.5">
                      {activeAgency?.logoUrl ? (
                        <img
                          src={activeAgency.logoUrl}
                          alt={activeAgency.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/20 bg-white/10 shrink-0 shadow"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                          <Buildings size={24} weight="duotone" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
                            Verified Agency Itineraries
                          </span>
                          {activeAgency?.verified && (
                            <InstagramVerifiedBadge size={16} title="Verified Travel Partner" />
                          )}
                        </div>
                        <h2 className="font-heading text-xl sm:text-2xl font-black mt-1 text-white">
                          {activeAgency?.name || selectedAgencyId}
                        </h2>
                        <p className="text-xs text-sky-200/90 mt-0.5">
                          Showing exclusive holiday packages created and operated directly by this partner.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-stretch sm:self-auto shrink-0">
                      {activeAgency && (
                        <Link
                          to={`/agency/${activeAgency.id}`}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors text-center"
                        >
                          Agency Profile
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setSelectedAgencyId('');
                          setSearchParams(params => {
                            const next = new URLSearchParams(params);
                            next.delete('agencyId');
                            next.delete('agency');
                            return next;
                          });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X size={14} weight="bold" />
                        <span>View All Agencies</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Package Results Count */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-bold text-slate-700">
                    Showing <strong className="text-blue-600">{filteredPackages.length}</strong> verified holiday packages{selectedAgencyId ? ` for ${activeAgency?.name || selectedAgencyId}` : ''}
                  </span>
                  {(searchQuery || selectedDestination !== 'All' || selectedTheme !== 'All' || selectedDuration !== 'All' || selectedAgencyId) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDestination('All');
                        setSelectedAgencyId('');
                        setSelectedTheme('All');
                        setSelectedDuration('All');
                        setPriceLimit(15000);
                        setSearchParams(params => {
                          const next = new URLSearchParams(params);
                          next.delete('search');
                          next.delete('destination');
                          next.delete('agencyId');
                          next.delete('agency');
                          return next;
                        });
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                {/* Packages Grid */}
                {filteredPackages.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <SuitcaseRolling size={48} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-heading text-lg font-bold text-slate-700">No holiday packages matched your search</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {selectedAgencyId
                        ? `No packages currently found for ${activeAgency?.name || selectedAgencyId}. Try viewing all packages.`
                        : 'Try adjusting your destination keywords, or resetting filters to browse all verified tours.'}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDestination('All');
                        setSelectedAgencyId('');
                        setSelectedTheme('All');
                        setSelectedDuration('All');
                        setSearchParams({});
                      }}
                      className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-blue-700"
                    >
                      Browse All Packages
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visiblePackages.map((pkg) => {
                      const displayPrice = pkg.startingPrice
                        ? `₹${pkg.startingPrice.toLocaleString()}`
                        : (pkg.priceEstimate ? pkg.priceEstimate.replace(/B2B Rate from /i, '').replace(/\/ pax/i, '').trim() : '$1,250');
                      const displayDuration = pkg.duration || `${pkg.days || 5} Days / ${pkg.nights || 4} Nights`;

                      return (
                        <div
                          key={pkg.id}
                          className="group rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col shadow-sm"
                        >
                          {/* Top Image */}
                          <div className="h-52 relative overflow-hidden shrink-0 bg-slate-100">
                            <img
                              src={pkg.imageUrl || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80'}
                              alt={pkg.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                            {/* Theme Pill */}
                            <div className="absolute top-3 left-3 bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow">
                              {pkg.theme || pkg.category || 'Curated'}
                            </div>

                            {/* Free cancellation tag */}
                            <div className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                              <Check size={12} weight="bold" />
                              <span>Free Cancellation</span>
                            </div>

                            {/* Duration & Rating Bottom of Image */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                              <span className="flex items-center gap-1 font-bold bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-700">
                                <Clock size={14} className="text-sky-400" />
                                {displayDuration}
                              </span>

                              <span className="flex items-center gap-1 font-bold bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-700 text-amber-400">
                                <Star size={14} weight="fill" />
                                <span>{pkg.rating || 4.9} ({pkg.reviews || 28})</span>
                              </span>
                            </div>
                          </div>

                          {/* Card Content Body */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 mb-1">
                                <MapPin size={14} />
                                <span>{pkg.destination}</span>
                              </div>

                              <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                                {pkg.title}
                              </h3>

                              {/* Verified Local Provider Attribution */}
                              <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                                <span className="font-semibold text-slate-600">Local Operator:</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                  <span>{pkg.agencyName || 'Verified Local DMC'}</span>
                                  {(pkg.agencyVerified ?? true) && (
                                    <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                                  )}
                                </span>
                              </div>

                              {/* Inclusions Highlights */}
                              <div className="mt-3 space-y-1">
                                {(pkg.highlights || ['Luxury Accommodation', 'Airport Transfers', 'Guided Excursions']).slice(0, 2).map((h, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                                    <Check size={13} className="text-emerald-600 shrink-0" />
                                    <span className="truncate">{h}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Card Footer: Price & Book Actions */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Per Person From</span>
                                <span className="text-lg font-extrabold text-blue-600">{displayPrice}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setQuickViewPackage(pkg)}
                                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                                  title="View Itinerary"
                                >
                                  Details
                                </button>

                                <button
                                  onClick={() => handleStartBooking(pkg)}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <span>Book Trip</span>
                                  <ArrowRight size={14} weight="bold" />
                                </button>
                              </div>
                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

                {visiblePackageCount < filteredPackages.length && (
                  <div ref={packageLoadMoreRef} className="flex min-h-20 items-center justify-center" aria-live="polite">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      Loading more holiday packages…
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: FIND & MANAGE MY BOOKING */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'manage' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">

            {/* Search Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Customer Portal</span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                  Lookup Your Holiday Reservation
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your Booking Reference Number (e.g. TRP-BK-2026-7842) and email to view your itinerary, print vouchers, or message your local DMC concierge.
                </p>
              </div>

              <form onSubmit={handleLookupBooking} className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Booking Reference # *</label>
                  <input
                    type="text"
                    required
                    placeholder="TRP-BK-2026-XXXX"
                    value={lookupBookingId}
                    onChange={(e) => setLookupBookingId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Guest Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-1 self-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MagnifyingGlass size={16} weight="bold" />
                    <span>Find</span>
                  </button>
                </div>
              </form>

              {/* Sample Quick Reference Pill for test demo */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>Try sample booking:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLookupBookingId('TRP-BK-2026-7842');
                    setLookupEmail('alex.vance@example.com');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 font-mono font-bold text-[11px] cursor-pointer"
                >
                  TRP-BK-2026-7842
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLookupBookingId('TRP-BK-2026-3195');
                    setLookupEmail('marcus.s@example.com');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 font-mono font-bold text-[11px] cursor-pointer"
                >
                  TRP-BK-2026-3195
                </button>
              </div>
            </div>

            {/* Lookup Result View */}
            {lookupSearched && (
              lookupResult ? (
                <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200">

                  {/* Result Header */}
                  <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${lookupResult.status === 'CONFIRMED'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                          }`}>
                          {lookupResult.status}
                        </span>
                        <span className="font-mono text-xs text-slate-400">Ref: {lookupResult.id}</span>
                      </div>
                      <h3 className="font-heading text-lg font-bold text-white">{lookupResult.packageTitle}</h3>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Trip Fare</span>
                      <span className="font-heading text-xl font-extrabold text-sky-400">
                        ${lookupResult.pricing.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Destination</span>
                        <span className="font-bold text-slate-900">{lookupResult.destination}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Travel Date</span>
                        <span className="font-bold text-slate-900">{lookupResult.travelDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Guests</span>
                        <span className="font-bold text-slate-900">{lookupResult.pricing.adultsCount} Adults</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Ground DMC</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <span>{lookupResult.agencyName}</span>
                          <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Lead Traveler:</span>
                        <span className="font-bold text-slate-900">{lookupResult.leadGuest.fullName} ({lookupResult.leadGuest.email})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Contact WhatsApp:</span>
                        <span className="font-bold text-slate-900">{lookupResult.leadGuest.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Accommodation:</span>
                        <span className="font-bold text-slate-900">{lookupResult.roomType}</span>
                      </div>
                      {lookupResult.notes && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">Special Requests:</span>
                          <span className="font-bold text-slate-900">{lookupResult.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/?text=Hello%20Concierge%2C%20inquiry%20for%20booking%20${lookupResult.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <WhatsappLogo size={16} />
                          <span>WhatsApp Local Concierge</span>
                        </a>

                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Printer size={16} />
                          <span>Print Voucher</span>
                        </button>
                      </div>

                      {lookupResult.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setCancelModalBookingId(lookupResult.id)}
                          className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              ) : (
                <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <WarningCircle size={40} className="mx-auto text-amber-500 mb-2" />
                  <h4 className="font-heading text-base font-bold text-slate-800">No Booking Found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    We couldn't find a reservation matching reference number <strong>{lookupBookingId}</strong>. Please check your confirmation email.
                  </p>
                </div>
              )
            )}

          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: CUSTOMER GUARANTEES & TRUST */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'trust' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  The Triiply Traveler Promise
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Book Directly With 100% Peace of Mind
                </h2>
                <p className="text-xs text-slate-600">
                  Every tour and package on Triiply is backed by verified ground logistics, transparent pricing, and comprehensive traveler protection.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={22} weight="fill" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Blue Shield Verified DMCs Only</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We personally verify physical company registration, tourism board licenses, and safety track records before any DMC or tour operator can publish packages.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <Tag size={22} weight="fill" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Direct Local Rates &amp; Zero Hidden Fees</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You get transparent, fair local rates directly from destination specialists without multiple middleman markups or surprise checkout fees.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <Clock size={22} weight="fill" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Flexible Free Cancellation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Plans change! Most itineraries offer 100% full refund cancellation or free rescheduling up to 7 days prior to departure.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <WhatsappLogo size={22} weight="fill" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">24/7 On-Trip Concierge WhatsApp Desk</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    From airport greeting to excursion coordination, a dedicated English-speaking local trip specialist is always a WhatsApp message away.
                  </p>
                </div>

              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Browse Verified Holiday Packages</span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* QUICK VIEW ITINERARY MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {quickViewPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col">

            {/* Modal Header */}
            <div className="h-44 relative shrink-0">
              <img
                src={quickViewPackage.imageUrl}
                alt={quickViewPackage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <button
                onClick={() => setQuickViewPackage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-3 left-5 right-5 text-white">
                <div className="flex items-center gap-2 text-xs text-sky-300 font-bold mb-1">
                  <MapPin size={14} />
                  <span>{quickViewPackage.destination}</span>
                  <span>•</span>
                  <Clock size={14} />
                  <span>{quickViewPackage.duration}</span>
                </div>
                <h3 className="font-heading text-lg font-bold leading-tight">{quickViewPackage.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Overview</h4>
                <p className="text-slate-600 leading-relaxed">{quickViewPackage.overview || 'Experience an unforgettable holiday with luxury accommodations, private transportation, and curated guided excursions.'}</p>
              </div>

              {/* Day-by-day preview */}
              {quickViewPackage.itinerary && quickViewPackage.itinerary.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Day-by-Day Itinerary</h4>
                  <div className="space-y-2">
                    {quickViewPackage.itinerary.map(day => (
                      <div key={day.id || day.dayNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-blue-600 block">Day {day.dayNumber}: {day.title}</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Included in this Package</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(quickViewPackage.inclusions || quickViewPackage.included || ['4-Star Accommodation', 'Daily Breakfast', 'Airport Transfers', 'Guided City Tour']).map((inc, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Rate Estimate</span>
                <span className="font-heading text-lg font-extrabold text-blue-600">
                  {quickViewPackage.startingPrice ? `₹${quickViewPackage.startingPrice.toLocaleString()}` : (quickViewPackage.priceEstimate || '$1,250')}
                </span>
              </div>

              <button
                onClick={() => handleStartBooking(quickViewPackage)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book This Itinerary</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <WarningCircle size={32} weight="fill" />
            </div>

            <h3 className="font-heading text-lg font-bold text-slate-900">Cancel Reservation?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you wish to cancel booking <strong>{cancelModalBookingId}</strong>? 100% refund will be processed according to the cancellation policy.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelModalBookingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelModalBookingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Yes, Cancel Trip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
