import { AgencyPartner, TravelPackage, GalleryPhoto, PromotionalCampaign, PackageStatus, CustomerBooking, AgencyReview, HomepageConfig } from '../types';
import { AGENCY_PROFILES, TRAVEL_PACKAGES } from './landingData';
import { api } from '../services/api';

// Types for Mock Inquiries and Audit Logs
export interface TravelInquiry {
  id: string;
  agencyId: string;
  packageName: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelDate: string;
  travelersCount: number;
  message: string;
  status: 'New' | 'Replied' | 'Closed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Security';
}

// Initial Mock Inquiries
const INITIAL_INQUIRIES: TravelInquiry[] = [
  {
    id: 'inq-1',
    agencyId: 'ag-1',
    packageName: '5D/4N Royal Dubai Desert & Luxury Marina Getaway',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah.j@example.com',
    travelerPhone: '+1 (555) 234-5678',
    travelDate: '2026-10-12',
    travelersCount: 2,
    message: 'We are looking for a VIP honeymoon experience. Can you customize the desert safari to be fully private?',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'inq-2',
    agencyId: 'ag-1',
    packageName: '5D/4N Royal Dubai Desert & Luxury Marina Getaway',
    travelerName: 'Rajesh Kumar',
    travelerEmail: 'rajesh.k@example.co.in',
    travelerPhone: '+91 98765 43210',
    travelDate: '2026-12-20',
    travelersCount: 6,
    message: 'Need corporate package prices for a group of 6. Let us know if discounts are applicable.',
    status: 'Replied',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'inq-3',
    agencyId: 'ag-2',
    packageName: '6D/5N Magical Bali Villas & Nusa Penida Island Escape',
    travelerName: 'Emily Watson',
    travelerEmail: 'emilyw@example.co.uk',
    travelerPhone: '+44 7911 123456',
    travelDate: '2026-09-05',
    travelersCount: 4,
    message: 'Are water sports fees included in the Nusa Penida island tour package price?',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

// Initial Mock Customer Bookings
export const INITIAL_BOOKINGS: CustomerBooking[] = [
  {
    id: 'TRP-BK-2026-7842',
    packageId: 'pkg-1',
    packageTitle: '5D/4N Royal Dubai Desert & Luxury Marina Getaway',
    destination: 'Dubai & UAE',
    duration: '5 Days / 4 Nights',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    agencyId: 'ag-1',
    agencyName: 'Apex Emirates DMC',
    agencyLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    departureCity: 'Dubai International Airport (DXB)',
    travelDate: '2026-11-14',
    returnDate: '2026-11-19',
    roomType: 'Deluxe Marina View Room (Included)',
    leadGuest: {
      fullName: 'Alex Vance',
      email: 'alex.vance@example.com',
      phone: '+1 (555) 789-0123',
      country: 'United States',
      dietaryPreference: 'Vegetarian Options Preferred',
      specialRequests: 'High floor room requested and early check-in if available.'
    },
    coTravelers: ['Elena Vance'],
    selectedAddons: [
      { id: 'add-1', name: 'Private VIP Airport Transfer', price: 95 },
      { id: 'add-2', name: 'Comprehensive Travel Insurance', price: 45 }
    ],
    pricing: {
      basePricePerAdult: 650,
      childPricePerChild: 325,
      adultsCount: 2,
      childrenCount: 0,
      infantsCount: 0,
      subtotal: 1300,
      addonsTotal: 140,
      roomUpgradeCost: 0,
      taxesAndFees: 72,
      discount: 100,
      totalAmount: 1412,
      depositAmount: 282.4,
      currency: '$'
    },
    paymentMode: 'DEPOSIT_20',
    status: 'CONFIRMED',
    bookingDate: '2026-08-20T10:30:00.000Z',
    promoCode: 'HOLIDAY10',
    notes: 'Airport greeting arranged with digital welcome board.'
  },
  {
    id: 'TRP-BK-2026-3195',
    packageId: 'pkg-2',
    packageTitle: '6D/5N Magical Bali Villas & Nusa Penida Island Escape',
    destination: 'Bali, Indonesia',
    duration: '6 Days / 5 Nights',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    agencyId: 'ag-2',
    agencyName: 'Nusa Paradise Expeditions',
    agencyLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    departureCity: 'Ngurah Rai International Airport (DPS)',
    travelDate: '2026-10-05',
    returnDate: '2026-10-11',
    roomType: 'Private Pool Jungle Villa (+ $120)',
    leadGuest: {
      fullName: 'Marcus Sterling',
      email: 'marcus.s@example.com',
      phone: '+44 7700 900077',
      country: 'United Kingdom',
      dietaryPreference: 'No specific restrictions',
      specialRequests: 'Celebrating 5th wedding anniversary! Flowers/champagne requested.'
    },
    coTravelers: ['Chloe Sterling'],
    selectedAddons: [
      { id: 'add-bali-1', name: 'Nusa Penida Manta Ray Snorkeling', price: 80 },
      { id: 'add-bali-2', name: 'Floating Breakfast at Villa Pool', price: 35 }
    ],
    pricing: {
      basePricePerAdult: 580,
      childPricePerChild: 290,
      adultsCount: 2,
      childrenCount: 0,
      infantsCount: 0,
      subtotal: 1160,
      addonsTotal: 115,
      roomUpgradeCost: 120,
      taxesAndFees: 68,
      discount: 0,
      totalAmount: 1463,
      depositAmount: 1463,
      currency: '$'
    },
    paymentMode: 'FULL_PAY',
    status: 'CONFIRMED',
    bookingDate: '2026-08-25T14:15:00.000Z',
    notes: 'Anniversary cake and floating breakfast confirmed.'
  }
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    action: 'SYSTEM_STARTUP',
    user: 'System Admin',
    details: 'Vite static server initialization and local router loading complete.',
    severity: 'Info'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    action: 'AGENCY_VERIFIED',
    user: 'compliance_officer',
    details: 'Verified Agency "Apex Emirates DMC" and enabled Blue Shield Badge.',
    severity: 'Info'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    action: 'ADMIN_LOGIN',
    user: 'admin@triiply.com',
    details: 'Successful administrator login. Session token issued.',
    severity: 'Info'
  }
];

// Initial Gallery Photographs

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Overwater Bungalow Horizon at Sunset',
    destination: 'Maldives',
    category: 'Resorts & Villas',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    caption: 'Private overwater villa deck with direct turquoise lagoon access in Baa Atoll.',
    credit: 'Atoll Blue Maldives DMC',
    featured: true,
    packageId: 'pkg-1',
    uploadDate: '2026-08-15'
  },
  {
    id: 'photo-2',
    title: 'Dubai Red Dune Safari at Golden Hour',
    destination: 'Dubai & UAE',
    category: 'Desert & Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    caption: 'High-octane dune bashing in Lahbab Desert with 4x4 Land Cruisers.',
    credit: 'Apex Emirates DMC',
    featured: true,
    packageId: 'pkg-1',
    uploadDate: '2026-08-20'
  },
  {
    id: 'photo-3',
    title: 'Swiss Glacier Express Crossing Landwasser Viaduct',
    destination: 'Switzerland',
    category: 'Alpine & Scenic',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    caption: 'Panoramic first class rail winding through Swiss Alpine mountain passes.',
    credit: 'Swiss Alpine Horizons',
    featured: true,
    packageId: 'pkg-3',
    uploadDate: '2026-08-22'
  },
  {
    id: 'photo-4',
    title: 'Ubud Tegallalang Rice Terraces & Jungle Sanctuary',
    destination: 'Bali, Indonesia',
    category: 'Beaches & Islands',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Morning mist rolling over centuries-old Balinese terraced fields.',
    credit: 'Nusa Paradise Expeditions',
    featured: true,
    packageId: 'pkg-2',
    uploadDate: '2026-08-25'
  },
  {
    id: 'photo-5',
    title: 'Dal Lake Royal Shikara Houseboat',
    destination: 'Kashmir, India',
    category: 'Culture & Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Traditional hand-carved cedarwood luxury houseboat on Dal Lake Srinagar.',
    credit: 'Kashmir Valley Retreats',
    featured: true,
    packageId: 'pkg-4',
    uploadDate: '2026-08-28'
  },
  {
    id: 'photo-6',
    title: 'Phuket & Krabi Longtail Catamaran',
    destination: 'Thailand',
    category: 'Beaches & Islands',
    imageUrl: 'https://images.unsplash.com/photo-1506665531195-3566af294e99?auto=format&fit=crop&w=1200&q=80',
    caption: 'Limestone karsts and turquoise waters in Phang Nga Bay.',
    credit: 'Siam Discovery Tours',
    featured: false,
    uploadDate: '2026-08-30'
  },
  {
    id: 'photo-7',
    title: 'Santorini Caldera Whitewashed Cliffside Suites',
    destination: 'Santorini, Greece',
    category: 'Resorts & Villas',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    caption: 'Iconic cobalt domes and infinity pools overlooking the Aegean caldera.',
    credit: 'Triiply Official Partner',
    featured: false,
    uploadDate: '2026-09-02'
  },
  {
    id: 'photo-8',
    title: 'Kyoto Arashiyama Bamboo Grove & Tenryu-ji',
    destination: 'Kyoto, Japan',
    category: 'Culture & Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Soaring emerald bamboo forest sanctuary bathed in morning dawn.',
    credit: 'Triiply Official Partner',
    featured: false,
    uploadDate: '2026-09-05'
  },
  {
    id: 'photo-9',
    title: 'Amalfi Coast Pastel Cliff Villas at Positano',
    destination: 'Amalfi Coast, Italy',
    category: 'Resorts & Villas',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cascading pastel villas overlooking the sparkling Mediterranean sea.',
    credit: 'Triiply Official Partner',
    featured: false,
    uploadDate: '2026-09-10'
  },
  {
    id: 'photo-10',
    title: 'Swiss Matterhorn Alpine Peak Reflection',
    destination: 'Zermatt, Switzerland',
    category: 'Alpine & Scenic',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Majestic jagged alpine summit mirrored in crystal clear glacial lake.',
    credit: 'Swiss Alpine Horizons',
    featured: false,
    uploadDate: '2026-09-12'
  }
];

// Initial Promotional Campaigns & Information
export const INITIAL_PROMOTIONS: PromotionalCampaign[] = [
  {
    id: 'promo-1',
    title: 'Founding Partner Program: 0% Platform Commission',
    subtitle: 'Register your DMC or Travel Agency today and get 12 months fee-free verified onboarding.',
    badge: 'Limited Founding Offer',
    discountText: '100% Free Tier ($0/yr)',
    promoCode: 'FOUNDER2026',
    placement: 'top_banner',
    active: true,
    validUntil: '2026-12-31',
    ctaText: 'Claim Founding Badge',
    ctaLink: '/contact',
    bgGradient: 'from-blue-700 via-indigo-700 to-sky-600',
    terms: 'Valid for registered travel operators and ground DMCs. Automatic renewal at standard rates after 12 months.',
    impressions: 4820,
    clicks: 614
  },
  {
    id: 'promo-2',
    title: 'Dubai & Emirates Winter DMC Surge Deals',
    subtitle: 'Exclusive B2B contracted group rates for VIP Desert Safari and Luxury Marina packages.',
    badge: 'Seasonal B2B Deal',
    discountText: 'Flat 15% Group Rebate',
    promoCode: 'DUBAI15B2B',
    placement: 'hero_spotlight',
    active: true,
    validUntil: '2026-11-15',
    ctaText: 'View Dubai Packages',
    ctaLink: '/#packages',
    bgGradient: 'from-amber-600 via-orange-600 to-rose-600',
    terms: 'Applies to bookings of 4 pax or more booked through verified Apex Emirates DMC partner storefront.',
    impressions: 2940,
    clicks: 388
  },
  {
    id: 'promo-3',
    title: 'Swiss Alps Scenic Rail Pass Early Bird Booking',
    subtitle: 'First class panoramic Glacier Express & Jungfraujoch Top of Europe B2B vouchers.',
    badge: 'Alps Spotlight',
    discountText: 'Complimentary Lake Cruise Pass',
    promoCode: 'SWISSRAIL2026',
    placement: 'package_deal',
    active: false,
    validUntil: '2026-10-30',
    ctaText: 'Explore Swiss Itineraries',
    ctaLink: '/#packages',
    bgGradient: 'from-emerald-700 via-teal-700 to-sky-700',
    terms: 'Valid for Swiss Alpine Horizons packages published on Triiply platform.',
    impressions: 1200,
    clicks: 142
  }
];

// LocalStorage Keys
const KEYS = {
  AGENCIES: 'triiply_storage_agencies',
  PACKAGES: 'triiply_storage_packages',
  PHOTOS: 'triiply_storage_photos',
  PROMOTIONS: 'triiply_storage_promotions',
  INQUIRIES: 'triiply_storage_inquiries',
  AUDIT_LOGS: 'triiply_storage_audit_logs',
  BOOKINGS: 'triiply_storage_customer_bookings'
};

// Initialize LocalStorage data if missing
export const initializeMockDatabase = (): void => {
  if (!localStorage.getItem(KEYS.AGENCIES)) {
    localStorage.setItem(KEYS.AGENCIES, JSON.stringify(AGENCY_PROFILES));
  }

  if (!localStorage.getItem(KEYS.PACKAGES)) {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(TRAVEL_PACKAGES));
  }

  // Keep the local demo database relational. Old browser data may contain
  // packages whose agency was removed; those records must never reach the UI.
  try {
    const agencies: AgencyPartner[] = JSON.parse(localStorage.getItem(KEYS.AGENCIES) || '[]');
    const agencyIds = new Set(agencies.map(agency => agency.id));
    const packages: TravelPackage[] = JSON.parse(localStorage.getItem(KEYS.PACKAGES) || '[]');
    const connectedPackages = packages.filter(pkg =>
      Boolean(pkg.id && pkg.agencyId && agencyIds.has(pkg.agencyId) && pkg.title?.trim() && pkg.destination?.trim())
    );
    const connectedAgencies = agencies.map(agency => {
      const agencyPackages = connectedPackages.filter(pkg => pkg.agencyId === agency.id && !pkg.deletedAt);
      return {
        ...agency,
        packageCount: agencyPackages.length,
        destinations: [...new Set(agencyPackages.map(pkg => pkg.destination.trim()))]
      };
    });
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(connectedPackages));
    localStorage.setItem(KEYS.AGENCIES, JSON.stringify(connectedAgencies));
  } catch {
    localStorage.setItem(KEYS.AGENCIES, JSON.stringify(AGENCY_PROFILES));
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(TRAVEL_PACKAGES));
  }

  const storedPhotosRaw = localStorage.getItem(KEYS.PHOTOS);
  if (!storedPhotosRaw) {
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(INITIAL_GALLERY_PHOTOS));
  } else {
    try {
      const parsed = JSON.parse(storedPhotosRaw);
      if (parsed.length < INITIAL_GALLERY_PHOTOS.length) {
        const merged = [...parsed];
        for (const initPhoto of INITIAL_GALLERY_PHOTOS) {
          if (!merged.some((p: any) => p.id === initPhoto.id)) {
            merged.push(initPhoto);
          }
        }
        localStorage.setItem(KEYS.PHOTOS, JSON.stringify(merged));
      }
    } catch {
      localStorage.setItem(KEYS.PHOTOS, JSON.stringify(INITIAL_GALLERY_PHOTOS));
    }
  }

  // Gallery records are only useful when they point to the same real package
  // and destination. Remove legacy decorative records with broken references.
  try {
    const packages: TravelPackage[] = JSON.parse(localStorage.getItem(KEYS.PACKAGES) || '[]');
    const packageById = new Map(packages.map(pkg => [pkg.id, pkg]));
    const photos: GalleryPhoto[] = JSON.parse(localStorage.getItem(KEYS.PHOTOS) || '[]');
    const connectedPhotos = photos.filter(photo => {
      if (!photo.packageId) return false;
      const pkg = packageById.get(photo.packageId);
      return Boolean(pkg && photo.destination.trim().toLowerCase() === pkg.destination.trim().toLowerCase());
    });
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(connectedPhotos));
  } catch {
    localStorage.setItem(KEYS.PHOTOS, '[]');
  }

  if (!localStorage.getItem(KEYS.PROMOTIONS)) {
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
  }

  if (!localStorage.getItem(KEYS.INQUIRIES)) {
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
  }

  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }

  if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }

};

// RUN INITIALIZATION IMMEDIATELY
initializeMockDatabase();


// ── GETTERS ──
export const getAgencies = (): AgencyPartner[] => {
  return JSON.parse(localStorage.getItem(KEYS.AGENCIES) || '[]');
};

export const getPackages = (): TravelPackage[] => {
  const agencies = getAgencies();
  const agencyIds = new Set(agencies.map(agency => agency.id));
  return (JSON.parse(localStorage.getItem(KEYS.PACKAGES) || '[]') as TravelPackage[])
    .filter(pkg => Boolean(pkg.agencyId && agencyIds.has(pkg.agencyId) && pkg.destination?.trim()));
};

export const getGalleryPhotos = (): GalleryPhoto[] => {
  const packageById = new Map(getPackages().map(pkg => [pkg.id, pkg]));
  return (JSON.parse(localStorage.getItem(KEYS.PHOTOS) || '[]') as GalleryPhoto[]).filter(photo => {
    if (!photo.packageId) return false;
    const pkg = packageById.get(photo.packageId);
    return Boolean(pkg && photo.destination.trim().toLowerCase() === pkg.destination.trim().toLowerCase());
  });
};

export const getPromotions = (): PromotionalCampaign[] => {
  return JSON.parse(localStorage.getItem(KEYS.PROMOTIONS) || '[]');
};

export const getActivePromotions = (placement?: string): PromotionalCampaign[] => {
  const list = getPromotions();
  return list.filter(p => p.active && (!placement || p.placement === placement));
};

export const getInquiries = (): TravelInquiry[] => {
  return JSON.parse(localStorage.getItem(KEYS.INQUIRIES) || '[]');
};

export const getBookings = (): CustomerBooking[] => {
  return JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
};

export const getBookingById = (bookingId: string): CustomerBooking | undefined => {
  const bookings = getBookings();
  return bookings.find(b => b.id.toLowerCase() === bookingId.trim().toLowerCase());
};

export const getAuditLogs = (): AuditLog[] => {
  return JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
};

export const saveAgencies = (agencies: AgencyPartner[]): void => {
  const agencyIds = new Set(agencies.map(agency => agency.id));
  const orphan = getPackages().find(pkg => !pkg.agencyId || !agencyIds.has(pkg.agencyId));
  if (orphan) throw new Error(`Cannot remove an agency while package "${orphan.title}" is connected to it.`);
  localStorage.setItem(KEYS.AGENCIES, JSON.stringify(agencies));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triiply_agencies_updated', { detail: agencies }));
  }
};

export const savePackages = (packages: TravelPackage[]): void => {
  const agencyIds = new Set(getAgencies().map(agency => agency.id));
  const invalid = packages.find(pkg => !pkg.id || !pkg.title?.trim() || !pkg.destination?.trim() || !pkg.agencyId || !agencyIds.has(pkg.agencyId));
  if (invalid) throw new Error('Package was not saved: title, destination, and a valid connected agency are required.');
  localStorage.setItem(KEYS.PACKAGES, JSON.stringify(packages));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triiply_packages_updated', { detail: packages }));
  }
};

export const saveBookings = (bookings: CustomerBooking[]): void => {
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triiply_bookings_updated', { detail: bookings }));
  }
};

export const addBooking = (booking: CustomerBooking): void => {
  const list = getBookings();
  list.unshift(booking);
  saveBookings(list);
  addAuditLog('BOOKING_CREATED', booking.leadGuest.fullName, `Customer booking reference ${booking.id} created for "${booking.packageTitle}" ($${booking.pricing.totalAmount})`, 'Info');
};

export const cancelBooking = (bookingId: string, reason?: string): boolean => {
  const list = getBookings();
  let found = false;
  const updated = list.map(b => {
    if (b.id.toLowerCase() === bookingId.trim().toLowerCase()) {
      found = true;
      return { ...b, status: 'CANCELLED' as const, notes: reason || 'Cancelled by customer request' };
    }
    return b;
  });
  if (found) {
    saveBookings(updated);
    addAuditLog('BOOKING_CANCELLED', 'Customer Portal', `Booking ${bookingId} marked as CANCELLED`, 'Warning');
  }
  return found;
};

export const addPackage = (pkg: TravelPackage): void => {
  const list = getPackages();
  list.push(pkg);
  savePackages(list);
  addAuditLog('PACKAGE_CREATED', pkg.agencyName, `Package "${pkg.title}" uploaded under ID: ${pkg.id}`, 'Info');
};

export const addInquiry = (inquiry: TravelInquiry): void => {
  const list = getInquiries();
  list.push(inquiry);
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(list));
  addAuditLog('LEAD_GENERATED', 'Traveler Inquiry', `Inquiry sent for package "${inquiry.packageName}" to agency ${inquiry.agencyId}`, 'Info');
};


export const addAuditLog = (action: string, user: string, details: string, severity: 'Info' | 'Warning' | 'Security' = 'Info'): void => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    user,
    details,
    severity
  };
  logs.unshift(newLog); // Place newest logs on top
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200))); // Cap at 200 logs
};

export const updateAgencyVerification = async (agencyId: string, verified: boolean): Promise<AgencyPartner> => {
  const list = getAgencies();
  const response = await api.toggleAgencyVerification(agencyId, verified);
  const updated = list.map(ag => ag.id === agencyId ? response.agency : ag);
  saveAgencies(updated);

  const agencyName = list.find(ag => ag.id === agencyId)?.name || agencyId;
  addAuditLog(
    verified ? 'AGENCY_APPROVED' : 'AGENCY_SUSPENDED',
    'admin@triiply.com',
    `Agency "${agencyName}" verification status set to: ${verified}`,
    verified ? 'Info' : 'Warning'
  );
  return response.agency;
};

export const updateAgency = async (updatedAgency: AgencyPartner): Promise<AgencyPartner> => {
  const response = await api.updateAgency(updatedAgency.id, updatedAgency);
  const list = getAgencies();
  const updated = list.map(ag => (ag.id === updatedAgency.id ? response.agency : ag));
  saveAgencies(updated);
  addAuditLog('AGENCY_UPDATED', 'admin@triiply.com', `Agency profile "${updatedAgency.name}" details updated`, 'Info');
  return response.agency;
};

export const deleteAgency = async (agencyId: string): Promise<void> => {
  const list = getAgencies();
  const agencyName = list.find(ag => ag.id === agencyId)?.name || agencyId;
  await api.deleteAgency(agencyId);
  const filtered = list.filter(ag => ag.id !== agencyId);
  saveAgencies(filtered);
  addAuditLog('AGENCY_DELETED', 'admin@triiply.com', `Agency "${agencyName}" (ID: ${agencyId}) permanently removed`, 'Warning');
};

export const updatePackageStatus = async (packageId: string, status: PackageStatus): Promise<void> => {
  const list = getPackages();
  if (status === 'APPROVED' || status === 'REJECTED' || status === 'CORRECTION_REQUIRED') {
    await api.moderatePackage(packageId, status === 'APPROVED' ? 'APPROVE' : status === 'REJECTED' ? 'REJECT' : 'REQUEST_CORRECTION');
  } else {
    const current = list.find(pkg => pkg.id === packageId);
    if (!current) throw new Error('Package not found.');
    await api.updatePackage(packageId, { ...current, status });
  }
  const updated = list.map(pkg => {
    if (pkg.id === packageId) {
      return { ...pkg, status };
    }
    return pkg;
  });
  savePackages(updated);

  addAuditLog('PACKAGE_STATUS_UPDATED', 'admin@triiply.com', `Package ID ${packageId} status updated to: ${status}`, 'Info');
};

export const updatePackage = async (updatedPkg: TravelPackage): Promise<TravelPackage> => {
  const response = await api.updatePackage(updatedPkg.id, updatedPkg);
  const list = getPackages();
  const updated = list.map(p => (p.id === updatedPkg.id ? response.package : p));
  savePackages(updated);
  addAuditLog('PACKAGE_UPDATED', 'admin@triiply.com', `Package "${updatedPkg.title}" details modified`, 'Info');
  return response.package;
};

export const deletePackage = async (packageId: string): Promise<void> => {
  const list = getPackages();
  const pkgTitle = list.find(p => p.id === packageId)?.title || packageId;
  await api.deletePackage(packageId);
  const filtered = list.filter(p => p.id !== packageId);
  savePackages(filtered);
  addAuditLog('PACKAGE_DELETED', 'admin@triiply.com', `Package "${pkgTitle}" removed from platform inventory`, 'Warning');
};

export const updateInquiryStatus = async (inquiryId: string, status: 'New' | 'Replied' | 'Closed'): Promise<void> => {
  await api.updateInquiryStatus(inquiryId, status);
  const list = getInquiries();
  const updated = list.map(inq => {
    if (inq.id === inquiryId) {
      return { ...inq, status };
    }
    return inq;
  });
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(updated));

  addAuditLog('INQUIRY_STATUS_CHANGED', 'admin@triiply.com', `Inquiry ID ${inquiryId} marked as ${status}`, 'Info');
};

export const deleteInquiry = async (inquiryId: string): Promise<void> => {
  await api.deleteInquiry(inquiryId);
  const list = getInquiries();
  const filtered = list.filter(inq => inq.id !== inquiryId);
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(filtered));

  addAuditLog('INQUIRY_DELETED', 'admin@triiply.com', `Inquiry ID ${inquiryId} archived/deleted`, 'Info');
};

export const saveGalleryPhotos = (photos: GalleryPhoto[]): void => {
  localStorage.setItem(KEYS.PHOTOS, JSON.stringify(photos));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triiply_photos_updated', { detail: photos }));
  }
};

export const addGalleryPhoto = async (photo: GalleryPhoto): Promise<GalleryPhoto> => {
  const response = await api.createGalleryPhoto(photo);
  const list = getGalleryPhotos();
  list.unshift(response.photo);
  saveGalleryPhotos(list);
  addAuditLog('PHOTO_ADDED', 'admin@triiply.com', `New media asset "${response.photo.title}" added to gallery in [${response.photo.destination}]`, 'Info');
  return response.photo;
};

export const updateGalleryPhoto = async (updatedPhoto: GalleryPhoto): Promise<GalleryPhoto> => {
  const response = await api.updateGalleryPhoto(updatedPhoto.id, updatedPhoto);
  const list = getGalleryPhotos();
  const updated = list.map(p => (p.id === updatedPhoto.id ? response.photo : p));
  saveGalleryPhotos(updated);
  addAuditLog('PHOTO_UPDATED', 'admin@triiply.com', `Media asset "${updatedPhoto.title}" modified`, 'Info');
  return response.photo;
};

export const deleteGalleryPhoto = async (photoId: string): Promise<void> => {
  const list = getGalleryPhotos();
  const photo = list.find(p => p.id === photoId);
  await api.deleteGalleryPhoto(photoId);
  const filtered = list.filter(p => p.id !== photoId);
  saveGalleryPhotos(filtered);

  addAuditLog('PHOTO_DELETED', 'admin@triiply.com', `Media asset "${photo?.title || photoId}" permanently removed from gallery`, 'Warning');
};

export const savePromotions = (promotions: PromotionalCampaign[]): void => {
  localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(promotions));
};

export const addPromotion = async (promo: PromotionalCampaign): Promise<PromotionalCampaign> => {
  const response = await api.createPromotion(promo);
  const list = getPromotions();
  list.unshift(response.promotion);
  savePromotions(list);
  addAuditLog('PROMOTION_CREATED', 'admin@triiply.com', `New promotional campaign "${promo.title}" created [Placement: ${promo.placement}]`, 'Info');
  return response.promotion;
};

export const updatePromotion = async (updatedPromo: PromotionalCampaign): Promise<PromotionalCampaign> => {
  const response = await api.updatePromotion(updatedPromo.id, updatedPromo);
  const list = getPromotions();
  const updated = list.map(p => (p.id === updatedPromo.id ? response.promotion : p));
  savePromotions(updated);
  addAuditLog('PROMOTION_UPDATED', 'admin@triiply.com', `Promotional campaign "${updatedPromo.title}" updated`, 'Info');
  return response.promotion;
};

export const deletePromotion = async (promoId: string): Promise<void> => {
  const list = getPromotions();
  const promo = list.find(p => p.id === promoId);
  await api.deletePromotion(promoId);
  const filtered = list.filter(p => p.id !== promoId);
  savePromotions(filtered);

  addAuditLog('PROMOTION_DELETED', 'admin@triiply.com', `Promotional campaign "${promo?.title || promoId}" deleted`, 'Warning');
};

export const togglePromotionActive = async (promoId: string): Promise<PromotionalCampaign> => {
  const list = getPromotions();
  const response = await api.togglePromotion(promoId);
  const nextState = response.promotion.active;
  const promoTitle = response.promotion.title;
  const updated = list.map(p => p.id === promoId ? response.promotion : p);
  savePromotions(updated);

  addAuditLog(
    nextState ? 'PROMOTION_ACTIVATED' : 'PROMOTION_PAUSED',
    'admin@triiply.com',
    `Campaign "${promoTitle}" toggled to ${nextState ? 'ACTIVE' : 'PAUSED'}`,
    'Info'
  );
  return response.promotion;
};

export const clearAuditLogs = async (): Promise<void> => {
  await api.clearAuditLogs();
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify([]));
  addAuditLog('AUDIT_LOGS_PURGED', 'admin@triiply.com', 'Audit activity history was purged by root administrator', 'Security');
};

export interface PlatformSettings {
  commissionRate: number;
  autoApproveDMCs: boolean;
  notifyOnNewLeads: boolean;
  maintenanceMode: boolean;
  supportEmail: string;
  maxUploadSizeMB: number;
}

const SETTINGS_KEY = 'triiply_platform_settings';

export const getPlatformSettings = (): PlatformSettings => {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fallback
    }
  }
  return {
    commissionRate: 5.5,
    autoApproveDMCs: false,
    notifyOnNewLeads: true,
    maintenanceMode: false,
    supportEmail: 'support@triiply.com',
    maxUploadSizeMB: 25
  };
};

export const savePlatformSettings = async (settings: PlatformSettings): Promise<PlatformSettings> => {
  const response = await api.updateSettings(settings);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(response.settings));
  addAuditLog('PLATFORM_SETTINGS_SAVED', 'admin@triiply.com', 'Global platform configuration updated', 'Info');
  return response.settings;
};

/**
 * Sync entire local storage with live backend data
 */
export const syncInitialDataFromBackend = async (): Promise<boolean> => {
  try {
    const [agenciesRes, packagesRes, photosRes, promosRes, settingsRes] = await Promise.allSettled([
      api.getAgencies(),
      api.getPackages(),
      api.getGalleryPhotos(),
      api.getPromotions(),
      api.getSettings()
    ]);

    if (agenciesRes.status === 'fulfilled' && agenciesRes.value.success && agenciesRes.value.agencies) {
      saveAgencies(agenciesRes.value.agencies);
    }

    if (packagesRes.status === 'fulfilled' && packagesRes.value.success && packagesRes.value.packages) {
      savePackages(packagesRes.value.packages);
    }

    if (photosRes.status === 'fulfilled' && photosRes.value.success && photosRes.value.photos) {
      saveGalleryPhotos(photosRes.value.photos);
    }

    if (promosRes.status === 'fulfilled' && promosRes.value.success && promosRes.value.promotions) {
      savePromotions(promosRes.value.promotions);
    }

    if (settingsRes.status === 'fulfilled' && settingsRes.value.success && settingsRes.value.settings) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsRes.value.settings));
    }
    return agenciesRes.status === 'fulfilled' && packagesRes.status === 'fulfilled';
  } catch (err) {
    console.warn('[mockData] syncInitialDataFromBackend caught error:', err);
    return false;
  }
};

// Helper for direct CSV download from client
export const exportDataToCSV = (data: Record<string, any>[], filename: string): void => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(obj =>
    headers
      .map(h => {
        let val = obj[h];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        val = String(val ?? '').replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(',')
  );
  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ── AGENCY REVIEWS REPOSITORY ───────────────────────────────────────
export const INITIAL_REVIEWS: AgencyReview[] = [
  // Apex Emirates DMC (ag-1)
  {
    id: 'rev-1',
    agencyId: 'ag-1',
    agencyName: 'Apex Emirates DMC',
    travelerName: 'Sarah Jenkins',
    travelerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'United Kingdom',
    packageTitle: '5D/4N Royal Dubai Desert & Luxury Marina Getaway',
    rating: 5,
    reviewDate: '2026-08-15',
    reviewTitle: 'Flawless VIP Desert Safari & Yacht Experience!',
    comment: 'Apex Emirates DMC handled our anniversary trip to Dubai with utmost professionalism. From the private chauffeur waiting at DXB terminal to the VIP dune buggy experience and private luxury yacht sunset tour, everything ran like clockwork. Highly recommend their ground coordination!',
    tripType: 'Couple',
    verifiedBooking: true,
    agencyResponse: {
      date: '2026-08-16',
      message: 'Thank you Sarah! It was our absolute pleasure hosting your anniversary in Dubai. We look forward to welcoming you back for Abu Dhabi next year!',
      responderName: 'Tariq Al-Mansoor (Guest Relations Lead)'
    },
    helpfulCount: 28
  },
  {
    id: 'rev-2',
    agencyId: 'ag-1',
    agencyName: 'Apex Emirates DMC',
    travelerName: 'David Vance',
    travelerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'United States',
    packageTitle: '5D/4N Royal Dubai Desert & Luxury Marina Getaway',
    rating: 5,
    reviewDate: '2026-07-28',
    reviewTitle: 'Top-tier Ground Handling & Multilingual Guides',
    comment: 'Booked a corporate retreat package for our executive team of 6. The coordination was seamless via WhatsApp. Vehicles were immaculate Mercedes V-Class vans, and guide Omar was extremely knowledgeable about Dubai culture and business hubs.',
    tripType: 'Business',
    verifiedBooking: true,
    helpfulCount: 19
  },
  {
    id: 'rev-3',
    agencyId: 'ag-1',
    agencyName: 'Apex Emirates DMC',
    travelerName: 'Priya & Rahul Sharma',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'India',
    packageTitle: '5D/4N Royal Dubai Desert & Luxury Marina Getaway',
    rating: 5,
    reviewDate: '2026-06-12',
    reviewTitle: 'Incredible Burj Khalifa VIP & Palm Jumeirah Tour',
    comment: 'We traveled with our elderly parents and 2 kids. Apex Emirates arranged wheelchair-accessible transfers and priority lounge access at Burj Khalifa 148th floor. Truly exceeded all expectations. 10/10 service!',
    tripType: 'Family',
    verifiedBooking: true,
    helpfulCount: 14
  },
  {
    id: 'rev-4',
    agencyId: 'ag-1',
    agencyName: 'Apex Emirates DMC',
    travelerName: 'Jonathan Reed',
    travelerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Canada',
    packageTitle: '5D/4N Royal Dubai Desert & Luxury Marina Getaway',
    rating: 4,
    reviewDate: '2026-05-30',
    reviewTitle: 'Great itinerary and luxurious desert camp',
    comment: 'Overall fantastic trip. The desert camp was top tier with live oud music and gourmet barbecue. One transfer had a minor 10-minute delay due to Sheikh Zayed Road traffic, but the coordinator kept us updated on WhatsApp.',
    tripType: 'Friends',
    verifiedBooking: true,
    helpfulCount: 8
  },

  // Nusa Paradise Expeditions (ag-2)
  {
    id: 'rev-5',
    agencyId: 'ag-2',
    agencyName: 'Nusa Paradise Expeditions',
    travelerName: 'Emily Watson',
    travelerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Australia',
    packageTitle: '6D/5N Magical Bali Villas & Nusa Penida Island Escape',
    rating: 5,
    reviewDate: '2026-08-02',
    reviewTitle: 'Unforgettable Nusa Penida Speedboat & Private Villa',
    comment: 'The private pool villa in Ubud was heaven! Nusa Paradise handled our Nusa Penida speedboat tickets and private driver seamlessly. We never waited in any queues. Truly a verified 5-star DMC.',
    tripType: 'Couple',
    verifiedBooking: true,
    agencyResponse: {
      date: '2026-08-03',
      message: 'Suksma Emily! So glad you loved the Ubud jungle villa and the Manta Point tour. Safe travels!',
      responderName: 'Wayan S. (Operations Director)'
    },
    helpfulCount: 31
  },
  {
    id: 'rev-6',
    agencyId: 'ag-2',
    agencyName: 'Nusa Paradise Expeditions',
    travelerName: 'Liam Taylor',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'New Zealand',
    packageTitle: '6D/5N Magical Bali Villas & Nusa Penida Island Escape',
    rating: 5,
    reviewDate: '2026-07-14',
    reviewTitle: 'Mount Batur Sunrise Trek was Breathtaking!',
    comment: 'Driver Ketut picked us up at 2:30 AM with hot coffee and breakfast boxes for the sunrise trek. Nusa Paradise made sure we had private trekking guides. The hot spring recovery afternoon in Kintamani was perfect.',
    tripType: 'Friends',
    verifiedBooking: true,
    helpfulCount: 22
  },
  {
    id: 'rev-7',
    agencyId: 'ag-2',
    agencyName: 'Nusa Paradise Expeditions',
    travelerName: 'Chloe Dubois',
    travelerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'France',
    packageTitle: '6D/5N Magical Bali Villas & Nusa Penida Island Escape',
    rating: 5,
    reviewDate: '2026-06-20',
    reviewTitle: 'Magical Honeymoon in Seminyak & Uluwatu',
    comment: 'From flower petals in the plunge pool to candlelit seafood dinner at Jimbaran Bay, every detail was carefully arranged. We felt like royalty.',
    tripType: 'Couple',
    verifiedBooking: true,
    helpfulCount: 16
  },

  // Swiss Alpine Horizons (ag-3)
  {
    id: 'rev-8',
    agencyId: 'ag-3',
    agencyName: 'Swiss Alpine Horizons',
    travelerName: 'Michael Chen',
    travelerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Singapore',
    packageTitle: '7D/6N Swiss Alps Panoramic Express & Glacier Wonders',
    rating: 5,
    reviewDate: '2026-06-18',
    reviewTitle: 'Glacier Express & Matterhorn Done Perfectly',
    comment: 'Swiss Alpine Horizons provided first-class Swiss Travel Passes, reserved panoramic seats on the Glacier Express, and organized an amazing alpine fondue dinner in Zermatt. Outstanding customer care!',
    tripType: 'Family',
    verifiedBooking: true,
    agencyResponse: {
      date: '2026-06-19',
      message: 'Grüezi Michael! We are delighted that your family enjoyed the Jungfraujoch ice palace and Glacier Express journey. Herzlichen Dank!',
      responderName: 'Hansruedi Weber (Head of Alpine Logistics)'
    },
    helpfulCount: 25
  },
  {
    id: 'rev-9',
    agencyId: 'ag-3',
    agencyName: 'Swiss Alpine Horizons',
    travelerName: 'Sophie Müller',
    travelerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Germany',
    packageTitle: '7D/6N Swiss Alps Panoramic Express & Glacier Wonders',
    rating: 5,
    reviewDate: '2026-05-10',
    reviewTitle: 'Flawless Alpine Train Bookings & Luxury Mountain Chalets',
    comment: 'Everything from the luggage courier service between Zurich and St. Moritz to the private mountain guides was 100% punctual and Swiss perfection.',
    tripType: 'Couple',
    verifiedBooking: true,
    helpfulCount: 19
  },

  // Atoll Blue Maldives (ag-5)
  {
    id: 'rev-10',
    agencyId: 'ag-5',
    agencyName: 'Atoll Blue Maldives',
    travelerName: 'Elena Rostova',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Germany',
    packageTitle: '5D/4N Maldives Ultra Luxury Overwater Villa',
    rating: 5,
    reviewDate: '2026-07-10',
    reviewTitle: 'Dream Honeymoon with Seaplane Transfers',
    comment: 'Seaplane transfers were arranged without any delay at Male airport. The overwater villa with private slide and sunset dolphin cruise exceeded all expectations. Thank you Atoll Blue!',
    tripType: 'Couple',
    verifiedBooking: true,
    agencyResponse: {
      date: '2026-07-11',
      message: 'Warm sunny greetings Elena! It was our pleasure arranging your seaplane and private sandbank dinner. We hope to see you again soon!',
      responderName: 'Ibrahim Rasheed (Guest Experience Manager)'
    },
    helpfulCount: 42
  },
  {
    id: 'rev-11',
    agencyId: 'ag-5',
    agencyName: 'Atoll Blue Maldives',
    travelerName: 'Kenji Takahashi',
    travelerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Japan',
    packageTitle: '5D/4N Maldives Ultra Luxury Overwater Villa',
    rating: 5,
    reviewDate: '2026-06-25',
    reviewTitle: 'Spectacular Whale Shark & Manta Ray Snorkeling',
    comment: 'The marine biologist guide arranged by Atoll Blue was world-class. We swam alongside 3 whale sharks in Ari Atoll. The water villa had an amazing glass bottom floor.',
    tripType: 'Couple',
    verifiedBooking: true,
    helpfulCount: 33
  },

  // Kashmir Valley Retreats (ag-4)
  {
    id: 'rev-12',
    agencyId: 'ag-4',
    agencyName: 'Kashmir Valley Retreats',
    travelerName: 'Ananya Verma',
    travelerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'India',
    packageTitle: '6D/5N Kashmir Paradise: Dal Lake & Gulmarg Snow Safari',
    rating: 5,
    reviewDate: '2026-08-05',
    reviewTitle: 'Royal Dal Lake Houseboat & Gondola Phase 2 Access',
    comment: 'Kashmir Valley Retreats booked us the premier luxury carved wood houseboat on Nigeen Lake. The Shikara ride with blooming lotus flowers and Gulmarg Phase 2 cable car tickets were arranged beforehand so we skipped the huge 2-hour queue.',
    tripType: 'Family',
    verifiedBooking: true,
    helpfulCount: 27
  },
  {
    id: 'rev-13',
    agencyId: 'ag-4',
    agencyName: 'Kashmir Valley Retreats',
    travelerName: 'Carlos Mendez',
    travelerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Spain',
    packageTitle: '6D/5N Kashmir Paradise: Dal Lake & Gulmarg Snow Safari',
    rating: 5,
    reviewDate: '2026-07-19',
    reviewTitle: 'A True Paradise on Earth Experience',
    comment: 'Pahalgam valleys, Lidder river trout fishing, and traditional Wazwan feast arranged by guide Tariq made this one of our best international trips. 100% recommended!',
    tripType: 'Couple',
    verifiedBooking: true,
    helpfulCount: 15
  },

  // Siam Discovery Tours (ag-6)
  {
    id: 'rev-14',
    agencyId: 'ag-6',
    agencyName: 'Siam Discovery Tours',
    travelerName: 'Hannah Baker',
    travelerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'United States',
    packageTitle: '6D/5N Phuket Luxury Islands & Elephant Sanctuary',
    rating: 5,
    reviewDate: '2026-07-22',
    reviewTitle: 'Ethical Elephant Sanctuary & Speedboat Tour',
    comment: 'Siam Discovery Tours provided ethical sanctuary visits and private speedboat to Maya Bay before the crowds arrived. Fantastic English-speaking guide Somchai.',
    tripType: 'Friends',
    verifiedBooking: true,
    helpfulCount: 20
  },

  // Nippon Gate DMC (ag-7)
  {
    id: 'rev-15',
    agencyId: 'ag-7',
    agencyName: 'Nippon Gate DMC',
    travelerName: 'Alexander Wright',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'Canada',
    packageTitle: '8D/7N Golden Route: Tokyo, Mount Fuji & Kyoto Ryokan',
    rating: 5,
    reviewDate: '2026-08-01',
    reviewTitle: 'Flawless Shinkansen Passes & Private Onsen Ryokan',
    comment: 'Nippon Gate DMC booked us an authentic traditional Ryokan in Hakone with private hot spring overlooking Mount Fuji. The Shinkansen tickets and tea ceremony bookings in Gion were impeccable.',
    tripType: 'Couple',
    verifiedBooking: true,
    agencyResponse: {
      date: '2026-08-02',
      message: 'Arigato gozaimasu Alexander! We are delighted that you enjoyed Hakone onsen and Kyoto tea culture. Safe travels!',
      responderName: 'Kenji Sato (Lead Experience Coordinator)'
    },
    helpfulCount: 35
  },

  // Goa Coastal Escapes (ag-8)
  {
    id: 'rev-16',
    agencyId: 'ag-8',
    agencyName: 'Goa Coastal Escapes',
    travelerName: 'Rohan & Tina Kapoor',
    travelerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    travelerCountry: 'India',
    packageTitle: '4D/3N Goa Luxury Heritage Villa & Sunset Catamaran',
    rating: 5,
    reviewDate: '2026-07-08',
    reviewTitle: 'Private Mandovi Catamaran Cruise & South Goa Heritage',
    comment: 'The Portuguese heritage villa in Fontainhas was so quaint and beautiful. Private catamaran cruise with dolphin sightings at sunset made our weekend getaway truly memorable.',
    tripType: 'Couple',
    verifiedBooking: true,
    helpfulCount: 17
  }
];

export const REVIEWS_KEY = 'triiply_agency_reviews';

export const getAgencyReviews = (agencyId?: string): AgencyReview[] => {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const list: AgencyReview[] = raw ? JSON.parse(raw) : INITIAL_REVIEWS;
    if (!agencyId) return list;
    return list.filter(r => r.agencyId === agencyId);
  } catch (err) {
    console.error('[mockData] getAgencyReviews failed:', err);
    return agencyId ? INITIAL_REVIEWS.filter(r => r.agencyId === agencyId) : INITIAL_REVIEWS;
  }
};

export const saveAgencyReviews = (reviews: AgencyReview[]): void => {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent('triiply_reviews_updated', { detail: { reviews } }));
  } catch (err) {
    console.error('[mockData] saveAgencyReviews failed:', err);
  }
};

export const addAgencyReview = (
  newReviewData: Omit<AgencyReview, 'id' | 'reviewDate' | 'helpfulCount'>
): AgencyReview => {
  const currentReviews = getAgencyReviews();
  const createdReview: AgencyReview = {
    ...newReviewData,
    id: `rev-${Date.now()}`,
    reviewDate: new Date().toISOString().split('T')[0],
    helpfulCount: 0
  };
  const updatedList = [createdReview, ...currentReviews];
  saveAgencyReviews(updatedList);
  return createdReview;
};

export const voteHelpfulReview = (reviewId: string): void => {
  const currentReviews = getAgencyReviews();
  const updated = currentReviews.map(r => {
    if (r.id === reviewId) {
      return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
    }
    return r;
  });
  saveAgencyReviews(updated);
};

// ── HOMEPAGE CONFIGURATION DEFAULTS & METHODS ──
export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  hero: {
    headlineStart: 'Showcase Your Travel Experiences',
    headlineGradient: 'To Thousands of Future Travelers',
    subtitle: "Create your professional travel agency profile, publish stunning holiday packages, and become one of Triiply's verified travel partners.",
    primaryCtaText: 'Become a Verified Partner',
    secondaryCtaText: 'Explore Packages',
    hotspotsTitle: 'Explore Hotspot Destinations',
    hotspots: [
      {
        id: 'maldives',
        name: 'Maldives',
        tagline: 'Luxury Water Villas & Crystal Lagoons',
        img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=85',
        agencyCount: '140+ DMCs',
      },
      {
        id: 'bali',
        name: 'Bali',
        tagline: 'Exotic Island Getaways & Jungle Resorts',
        img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85',
        agencyCount: '185+ DMCs',
      },
      {
        id: 'swiss',
        name: 'Swiss Alps',
        tagline: 'Scenic Alpine Peaks & Luxury Rail',
        img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=85',
        agencyCount: '95+ DMCs',
      },
      {
        id: 'dubai',
        name: 'Dubai',
        tagline: 'Royal Desert Safaris & Skyline Luxury',
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85',
        agencyCount: '210+ DMCs',
      },
      {
        id: 'goa',
        name: 'Goa',
        tagline: 'Tropical Coastal Escapes & Sunsets',
        img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=85',
        agencyCount: '160+ DMCs',
      },
      {
        id: 'santorini',
        name: 'Santorini',
        tagline: 'Mediterranean Cliffside Villas',
        img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=85',
        agencyCount: '110+ DMCs',
      },
    ]
  },
  marquee: {
    badgeText: 'TRUSTED DESTINATION ECOSYSTEM',
    heading: 'Leading Destination Management Companies',
    subheading: 'Powering exclusive luxury packages across 75+ global leisure hotspots',
    partners: [
      { id: 'm-1', name: 'Apex Emirates DMC', initial: 'AE', location: 'Dubai, UAE', type: 'DMC', bg: 'bg-blue-600' },
      { id: 'm-2', name: 'Nusa Paradise Expeditions', initial: 'NP', location: 'Bali, Indonesia', type: 'Tour Operator', bg: 'bg-sky-500' },
      { id: 'm-3', name: 'Swiss Alpine Horizons', initial: 'SA', location: 'Zurich, Switzerland', type: 'DMC', bg: 'bg-emerald-600' },
      { id: 'm-4', name: 'Kashmir Valley Retreats', initial: 'KV', location: 'Srinagar, India', type: 'Holiday Provider', bg: 'bg-indigo-600' },
      { id: 'm-5', name: 'Atoll Blue Maldives', initial: 'AB', location: 'Male, Maldives', type: 'DMC', bg: 'bg-cyan-600' },
      { id: 'm-6', name: 'Siam Discovery Tours', initial: 'SD', location: 'Bangkok, Thailand', type: 'Tour Operator', bg: 'bg-amber-600' },
      { id: 'm-7', name: 'Nippon Gate DMC', initial: 'NG', location: 'Tokyo, Japan', type: 'DMC', bg: 'bg-rose-600' },
      { id: 'm-8', name: 'Goa Coastal Escapes', initial: 'GC', location: 'Goa, India', type: 'Travel Agency', bg: 'bg-teal-600' },
    ]
  },
  destinations: {
    headingStart: 'Where Travel Agencies & DMCs',
    headingGradient: 'Connect Globally',
    subtitle: 'Discover top-rated ground handling DMCs, local tour operators, and verified holiday package providers across 75+ global leisure destinations.',
    ctaText: 'List Your Destination DMC',
    destinations: [
      {
        id: 'dest-1',
        name: 'Dubai & UAE',
        country: 'United Arab Emirates',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        agencyCount: 210,
        packageCount: 680,
        featuredTag: 'Top Selling',
      },
      {
        id: 'dest-2',
        name: 'Maldives Overwater',
        country: 'Maldives',
        imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
        agencyCount: 145,
        packageCount: 420,
        featuredTag: 'Luxury Hotspot',
      },
      {
        id: 'dest-3',
        name: 'Bali & Lombok',
        country: 'Indonesia',
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        agencyCount: 185,
        packageCount: 540,
        featuredTag: 'High Demand',
      },
      {
        id: 'dest-4',
        name: 'Swiss Alpine Horizons',
        country: 'Switzerland',
        imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        agencyCount: 95,
        packageCount: 310,
        featuredTag: 'Premium Scenic',
      },
    ]
  },
  benefits: {
    badgeText: 'SOLVING LEGACY TRAVEL INDUSTRY BOTTLENECKS',
    headingStart: 'Built Specifically for the Modern',
    headingGradient: 'Travel Economy',
    subtitle: 'Say goodbye to unorganized WhatsApp quote spamming, lost customer leads, and high commissions. Triiply gives your agency an elite digital storefront.',
    calculatorTitle: 'Estimate Your Agency Growth with Triiply',
    benefits: [
      {
        id: 'b-1',
        title: 'Scattered WhatsApp PDF Quotes',
        problem: 'Travel agents constantly paste long unstructured texts and heavy PDF attachments into WhatsApp chats.',
        solution: 'Publish structured interactive web links (triiply.com/package-id) with photo carousels and day-wise itineraries.',
      },
      {
        id: 'b-2',
        title: 'Lack of Online Brand Credibility',
        problem: 'Without an independent web storefront, retail agents and travelers hesitate to make high-value holiday wire transfers.',
        solution: 'Get an official Blue Shield Verified Trust Badge showcasing your license, physical address, and review history.',
      },
      {
        id: 'b-3',
        title: 'High OTA Commission Fees',
        problem: 'Traditional marketplaces charge 15%-25% commission fees on every booking, squeezing agency margins.',
        solution: '0% platform commission on leads. All client inquiries route directly to your WhatsApp and email.',
      },
      {
        id: 'b-4',
        title: 'Zero Digital Search Visibility',
        problem: 'Independent ground DMCs struggle to rank on Google search and depend solely on word-of-mouth referrals.',
        solution: 'SEO-optimized public storefronts indexed on Google for high-intent holiday search queries.',
      },
    ]
  },
  timeline: {
    badgeText: 'FAST 4-STEP ONBOARDING WORKFLOW',
    headingStart: 'From Registration to Live Packages in',
    headingGradient: 'Under 10 Minutes',
    subtitle: 'Our streamlined onboarding gets your travel brand verified and selling packages faster than ever.',
    steps: [
      {
        id: 's-1',
        stepNumber: '01',
        title: 'Claim Agency Profile',
        description: 'Fill in your company details, upload your high-resolution agency logo, and submit your commercial tourism license.',
        highlightBadge: '2 Minutes'
      },
      {
        id: 's-2',
        stepNumber: '02',
        title: 'Submit Tourism Credentials',
        description: 'Our verification desk reviews your credentials and issues the Blue Shield Verified Trust Badge.',
        highlightBadge: 'Fast 24h Review'
      },
      {
        id: 's-3',
        stepNumber: '03',
        title: 'Publish Curated Packages',
        description: 'Use the 4-step wizard to create responsive day-wise itineraries with photo galleries, pricing tiers, and inclusions.',
        highlightBadge: 'Instant Web Links'
      },
      {
        id: 's-4',
        stepNumber: '04',
        title: 'Receive 100% Direct Leads',
        description: 'Travelers and retail agents discover your packages and connect directly via WhatsApp, Phone, and Email.',
        highlightBadge: '0% Commission'
      }
    ]
  },
  marketplace: {
    badgeText: 'DUAL VALUE PROPOSITION',
    headingStart: 'Connecting Verified Travel Suppliers with',
    headingGradient: 'Discerning Travelers',
    subtitle: 'Triiply bridges the trust gap between wholesale ground operators and retail buyers with verified digital transparency.',
    agencyColumnTitle: 'For Travel Agencies & DMCs',
    agencyColumnSubtitle: 'Enterprise digital tools to scale your inbound inquiry pipeline',
    agencyFeatures: [
      { id: 'af-1', title: 'Branded Interactive Storefront', description: 'Showcase your team, license, certifications, and complete package catalog.' },
      { id: 'af-2', title: '0% Platform Lead Fees', description: 'Keep 100% of your booking profits with direct WhatsApp lead routing.' },
      { id: 'af-3', title: 'Blue Shield Verified Status', description: 'Build instant buyer confidence for high-value holiday wire transactions.' },
      { id: 'af-4', title: 'Day-Wise Itinerary Wizard', description: 'Create shareable mobile-first web links in seconds.' }
    ],
    travelerColumnTitle: 'For Travelers & Retail Agents',
    travelerColumnSubtitle: 'Safe, transparent booking directly with verified local destination experts',
    travelerFeatures: [
      { id: 'tf-1', title: 'Direct Supplier Pricing', description: 'Avoid middleman markup by booking directly with local ground DMCs.' },
      { id: 'tf-2', title: 'Verified Business Licenses', description: 'Every listed agency is vetted for legal tourism registration.' },
      { id: 'tf-3', title: 'Comprehensive Day-Wise Plans', description: 'Inspect hotel ratings, meals, transfers, and inclusions before booking.' },
      { id: 'tf-4', title: 'Instant WhatsApp Inquiries', description: 'Chat directly with destination specialists for custom group quotes.' }
    ]
  },
  testimonials: {
    badgeText: 'FOUNDING PARTNER EXPERIENCES',
    headingStart: 'Trusted by Premier DMCs and',
    headingGradient: 'Global Tour Operators',
    subtitle: 'Hear from our founding partners who transitioned from messy WhatsApp PDFs to professional Triiply storefronts.',
    testimonials: [
      {
        id: 'test-1',
        quote: 'Triiply replaced our 15-page static PDFs with interactive web itineraries. Our international conversion rate jumped by 42% in our first month.',
        authorName: 'Tariq Al-Mansoor',
        authorRole: 'Managing Director',
        agencyName: 'Apex Emirates DMC',
        location: 'Dubai, UAE',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        verifiedPartner: true,
        metricBadge: '+42% Inquiries'
      },
      {
        id: 'test-2',
        quote: 'The Blue Shield verification gave our UK and European retail clients total trust when wiring high-value villa deposits for Bali vacations.',
        authorName: 'Ketut Wijaya',
        authorRole: 'Founder & Head of Operations',
        agencyName: 'Nusa Paradise Expeditions',
        location: 'Bali, Indonesia',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        verifiedPartner: true,
        metricBadge: '₹0 Commission'
      },
      {
        id: 'test-3',
        quote: 'Having our packages indexed on Triiply brings steady luxury inquiries without paying 20% OTA commissions. It is a game-changer.',
        authorName: 'Marcella Meier',
        authorRole: 'Head of Leisure Travel',
        agencyName: 'Swiss Alpine Horizons',
        location: 'Zurich, Switzerland',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        verifiedPartner: true,
        metricBadge: '180+ Active Leads'
      }
    ]
  },
  whyJoinEarly: {
    badgeText: 'LIMITED FOUNDING PARTNER PROGRAM',
    headingStart: 'Join the First 100 Verified DMCs with',
    headingGradient: '12 Months Free Access',
    subtitle: 'Founding partners receive lifetime preferential placement, permanent Blue Shield verification status, and ₹0 platform fees.',
    primaryCtaText: 'Claim Founding Partner Access',
    perks: [
      { id: 'p-1', title: '12 Months ₹0 Fee Tier', description: 'Zero subscription and 0% lead commissions for early verified partners.' },
      { id: 'p-2', title: 'Permanent Founding Badge', description: 'Distinguished gold founding badge on your public storefront forever.' },
      { id: 'p-3', title: 'Homepage Showcase Priority', description: 'Priority rotation in our featured destinations and hero spotlight.' },
      { id: 'p-4', title: 'Dedicated Concierge Onboarding', description: 'Our team formats and uploads your first 5 packages for you.' }
    ]
  },
  faqs: {
    badgeText: 'FREQUENTLY ASKED QUESTIONS',
    headingStart: 'Everything You Need to Know About',
    headingGradient: 'Partnering with Triiply',
    subtitle: 'Got questions about registration, commission policies, or package publishing? We have answers.',
    faqs: [
      {
        id: 'faq-1',
        category: 'General',
        question: 'What is Triiply and who is it designed for?',
        answer: 'Triiply is a premier B2B SaaS platform & directory designed specifically for travel agencies, destination management companies (DMCs), tour operators, and holiday providers to publish interactive package storefronts, build digital equity, and gain verified partner trust.',
      },
      {
        id: 'faq-2',
        category: 'Pricing',
        question: 'Is there a subscription fee to join Triiply?',
        answer: 'For Founding Partners registering today, the subscription fee is $0 for the first 12 months. You get full access to create your branded storefront, publish unlimited holiday packages, and receive direct customer leads with zero commission fees.',
      },
      {
        id: 'faq-3',
        category: 'Verification',
        question: 'How does the Blue Shield Partner Verification work?',
        answer: 'After registering, our compliance desk verifies your commercial tourism license, physical office/registered address, and tax identification. Once verified, your public storefront receives the Blue Shield Trust Badge.',
      },
      {
        id: 'faq-4',
        category: 'Packages',
        question: 'How do I share my holiday packages with clients?',
        answer: 'Every package you publish gets a unique, responsive web URL (e.g. triiply.com/agency/yourname/dubai-luxury-getaway). You can share this link directly via WhatsApp, email, or social media instead of sending heavy PDFs.',
      },
      {
        id: 'faq-5',
        category: 'Security',
        question: 'Do you charge commissions on my customer inquiries or leads?',
        answer: 'No! Triiply does not take any commission on your bookings or leads. 100% of traveler inquiries go directly to your WhatsApp, phone, or email so you own the customer relationship completely.',
      },
    ]
  },
  finalCta: {
    headlineStart: 'Ready to Transform Your Travel Agency into a',
    headlineGradient: 'High-Conversion Digital Brand?',
    subtitle: 'Join top DMCs and holiday providers worldwide. Publish your first interactive itinerary in minutes.',
    buttonText: 'Get Started with 12 Months Free',
    guaranteeNote: 'No credit card required • Instant account activation • 0% commission guaranteed'
  }
};

export const HOMEPAGE_CONFIG_KEY = 'triiply_homepage_config';

export const getHomepageConfig = (): HomepageConfig => {
  try {
    const raw = localStorage.getItem(HOMEPAGE_CONFIG_KEY);
    if (!raw) return DEFAULT_HOMEPAGE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      hero: { ...DEFAULT_HOMEPAGE_CONFIG.hero, ...parsed.hero },
      marquee: { ...DEFAULT_HOMEPAGE_CONFIG.marquee, ...parsed.marquee },
      destinations: { ...DEFAULT_HOMEPAGE_CONFIG.destinations, ...parsed.destinations },
      benefits: { ...DEFAULT_HOMEPAGE_CONFIG.benefits, ...parsed.benefits },
      timeline: { ...DEFAULT_HOMEPAGE_CONFIG.timeline, ...parsed.timeline },
      marketplace: { ...DEFAULT_HOMEPAGE_CONFIG.marketplace, ...parsed.marketplace },
      testimonials: { ...DEFAULT_HOMEPAGE_CONFIG.testimonials, ...parsed.testimonials },
      whyJoinEarly: { ...DEFAULT_HOMEPAGE_CONFIG.whyJoinEarly, ...parsed.whyJoinEarly },
      faqs: { ...DEFAULT_HOMEPAGE_CONFIG.faqs, ...parsed.faqs },
      finalCta: { ...DEFAULT_HOMEPAGE_CONFIG.finalCta, ...parsed.finalCta },
    };
  } catch (err) {
    console.error('[mockData] getHomepageConfig failed:', err);
    return DEFAULT_HOMEPAGE_CONFIG;
  }
};

export const saveHomepageConfig = (config: HomepageConfig): void => {
  try {
    localStorage.setItem(HOMEPAGE_CONFIG_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('triiply_homepage_updated', { detail: { config } }));
  } catch (err) {
    console.error('[mockData] saveHomepageConfig failed:', err);
  }
};

export const resetHomepageConfig = (): HomepageConfig => {
  try {
    localStorage.removeItem(HOMEPAGE_CONFIG_KEY);
    window.dispatchEvent(new CustomEvent('triiply_homepage_updated', { detail: { config: DEFAULT_HOMEPAGE_CONFIG } }));
    return DEFAULT_HOMEPAGE_CONFIG;
  } catch (err) {
    console.error('[mockData] resetHomepageConfig failed:', err);
    return DEFAULT_HOMEPAGE_CONFIG;
  }
};
