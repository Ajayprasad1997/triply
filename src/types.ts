export type AgencyType = 'DMC' | 'Tour Operator' | 'Travel Agency' | 'Holiday Provider' | 'Independent Consultant';

export interface AgencyPartner {
  id: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  type: AgencyType;
  location: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  packageCount: number;
  destinations: string[];
  tagline: string;
  about: string;
  established: string;
  ownerPhoto?: string;
  ownerName?: string;
  ownerRole?: string;
  joinedDate?: string;
  whatsapp?: string;
  bio?: string;
  primaryDestinations?: string[];
  licenseNumber?: string;
  slug?: string;
  applicationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUIRED' | 'SUSPENDED';
  businessDescription?: string;
  registeredAddress?: string;
  operatingLocation?: string;
  serviceRegions?: string[];
  packageCategories?: string[];
  website?: string;
  socialMediaLinks?: string[];
  contactName?: string;
  contactDesignation?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  panNumber?: string;
  gstNumber?: string;
  registrationDocumentUrl?: string;
  addressProofUrl?: string;
  supportingDocumentUrls?: string[];
  travelCertificationUrl?: string;
  galleryImages?: string[];
  brochureUrl?: string;
  submittedAt?: string;
}

export type PackageStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'CORRECTION_REQUIRED' | 'REJECTED';
export type PackageVisibility = 'PUBLIC' | 'UNLISTED' | 'FEATURED';
export type TravelDateType = 'Fixed Date' | 'Date Range' | 'Seasonal' | 'Flexible';
export type PriceBasis = 'Per Person' | 'Per Group';

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[]; // e.g., ['Breakfast', 'Lunch', 'Dinner']
  accommodation?: string;
  transportation?: string;
}

export interface PackageAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
}

export interface CorrectionNote {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  resolved: boolean;
}

export interface TravelPackage {
  id: string;
  agencyId?: string;
  title: string;
  destination: string;
  departureLocation?: string;
  category?: string;
  days?: number;
  nights?: number;
  duration: string; // Formatted e.g. "5 Days / 4 Nights"
  overview?: string;
  travellerTypes?: string[];
  minTravellers?: number;
  maxTravellers?: number;
  
  // Itinerary
  itinerary?: ItineraryDay[];
  
  // Travel Logistics
  travelDateType?: TravelDateType;
  startDate?: string;
  endDate?: string;
  season?: string;
  transportType?: string;
  hotelCategory?: string;
  mealPlan?: string;
  sightseeingDetails?: string;
  pickupInfo?: string;
  dropInfo?: string;
  
  // Pricing
  startingPrice?: number;
  currency?: string;
  priceBasis?: PriceBasis;
  adultPrice?: number;
  childPrice?: number;
  groupPrice?: number;
  taxesIncluded?: boolean;
  priceEstimate: string; // Legacy/Display format e.g. "B2B Rate from $450 / pax"
  addons?: PackageAddon[];

  // Inclusions & Exclusions
  inclusions?: string[];
  exclusions?: string[];
  highlights: string[];
  included: string[]; // Backward compatibility with older components

  // Policies
  cancellationPolicy?: string;
  paymentPolicy?: string;
  importantNotes?: string;

  // Media
  imageUrl: string;
  galleryImages?: string[];
  brochureUrl?: string;

  // Agency & Partner attribution
  agencyName: string;
  agencyType: AgencyType;
  agencyVerified: boolean;
  agencyLogo: string;

  // Platform & Moderation
  theme: string;
  rating: number;
  reviews: number;
  status?: PackageStatus;
  visibility?: PackageVisibility;
  featured?: boolean;
  correctionNotes?: CorrectionNote[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}


export interface DestinationCardData {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  agencyCount: number;
  packageCount: number;
  featuredTag?: string;
}

export interface MapPinData {
  id: string;
  name: string;
  xPercent: number; // For map positioning
  yPercent: number;
  agencyCount: number;
  packageCount: number;
  topDmc: string;
}

export interface AgencyTestimonial {
  id: string;
  agencyName: string;
  ownerName: string;
  ownerRole: string;
  ownerPhoto: string;
  location: string;
  quote: string;
  growthStat: string;
  rating: number;
}

export interface BentoFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  colSpan?: string;
  badge?: string;
  badgeText?: string;
  bgGradient?: string;
  iconName?: string;
  highlightText?: string;
}

export interface OnboardingForm {
  agencyName: string;
  agencyType: AgencyType;
  country: string;
  city: string;
  teamSize: string;
  fullName: string;
  email: string;
  phone: string;
  website: string;
  specialties: string[];
  monthlyVolume: string;
}

export type PhotoCategory = 'Resorts & Villas' | 'Desert & Adventure' | 'Alpine & Scenic' | 'Beaches & Islands' | 'Culture & Heritage' | 'Festivals & Events';

export interface GalleryPhoto {
  id: string;
  title: string;
  destination: string;
  category: PhotoCategory;
  imageUrl: string;
  caption: string;
  credit: string;
  featured: boolean;
  packageId?: string;
  uploadDate: string;
}

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

export interface BookingLeadGuest {
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  dietaryPreference?: string;
  specialRequests?: string;
}

export interface BookingPricingSummary {
  basePricePerAdult: number;
  childPricePerChild: number;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  subtotal: number;
  addonsTotal: number;
  roomUpgradeCost: number;
  taxesAndFees: number;
  discount: number;
  totalAmount: number;
  depositAmount?: number;
  currency: string;
}

export interface CustomerBooking {
  id: string; // e.g. TRP-BK-2026-8941
  packageId: string;
  packageTitle: string;
  destination: string;
  duration: string;
  imageUrl: string;
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  departureCity?: string;
  travelDate: string;
  returnDate?: string;
  roomType: string;
  leadGuest: BookingLeadGuest;
  coTravelers: string[];
  selectedAddons: { id: string; name: string; price: number }[];
  pricing: BookingPricingSummary;
  paymentMode: 'HOLD_CARD' | 'DEPOSIT_20' | 'FULL_PAY';
  status: BookingStatus;
  bookingDate: string;
  promoCode?: string;
  notes?: string;
}

export type PromoPlacement = 'top_banner' | 'hero_spotlight' | 'package_deal' | 'founding_partner';

export interface PromotionalCampaign {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  discountText: string;
  promoCode?: string;
  placement: PromoPlacement;
  active: boolean;
  validUntil: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  terms?: string;
  impressions?: number;
  clicks?: number;
}

export interface AgencyReview {
  id: string;
  agencyId: string;
  agencyName?: string;
  travelerName: string;
  travelerAvatar?: string;
  travelerCountry: string;
  packageTitle: string;
  rating: number; // 1 - 5
  reviewDate: string;
  reviewTitle: string;
  comment: string;
  tripType: 'Couple' | 'Family' | 'Solo' | 'Friends' | 'Business';
  verifiedBooking: boolean;
  agencyResponse?: {
    date: string;
    message: string;
    responderName: string;
  };
  helpfulCount?: number;
}

// ── HOMEPAGE CONFIGURATION TYPES ──
export interface HeroHotspot {
  id: string;
  name: string;
  tagline: string;
  img: string;
  agencyCount: string;
}

export interface HeroConfig {
  headlineStart: string;
  headlineGradient: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  hotspotsTitle: string;
  hotspots: HeroHotspot[];
}

export interface MarqueePartnerItem {
  id: string;
  name: string;
  location: string;
  type: string;
  initial: string;
  bg: string;
}

export interface MarqueeConfig {
  badgeText: string;
  heading: string;
  subheading: string;
  partners: MarqueePartnerItem[];
}

export interface DestinationCardConfig {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  agencyCount: number;
  packageCount: number;
  featuredTag?: string;
}

export interface DestinationsSectionConfig {
  headingStart: string;
  headingGradient: string;
  subtitle: string;
  ctaText: string;
  destinations: DestinationCardConfig[];
}

export interface BenefitCardConfig {
  id: string;
  title: string;
  problem: string;
  solution: string;
  icon?: string;
}

export interface BenefitsSectionConfig {
  badgeText: string;
  headingStart: string;
  headingGradient: string;
  subtitle: string;
  calculatorTitle: string;
  benefits: BenefitCardConfig[];
}

export interface TimelineStepConfig {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  highlightBadge?: string;
}

export interface TimelineSectionConfig {
  badgeText: string;
  headingStart: string;
  headingGradient: string;
  subtitle: string;
  steps: TimelineStepConfig[];
}

export interface MarketplaceFeatureConfig {
  id: string;
  title: string;
  description: string;
}

export interface MarketplaceSplitConfig {
  badgeText: string;
  headingStart: string;
  headingGradient: string;
  subtitle: string;
  agencyColumnTitle: string;
  agencyColumnSubtitle: string;
  agencyFeatures: MarketplaceFeatureConfig[];
  travelerColumnTitle: string;
  travelerColumnSubtitle: string;
  travelerFeatures: MarketplaceFeatureConfig[];
}

export interface TestimonialCardConfig {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  agencyName: string;
  location: string;
  avatarUrl: string;
  rating: number;
  verifiedPartner: boolean;
  metricBadge: string;
}

export interface TestimonialsSectionConfig {
  badgeText: string;
  headingStart: string;
  headingGradient: string;
  subtitle: string;
  testimonials: TestimonialCardConfig[];
}

export interface WhyJoinEarlyConfig {
  badgeText: string;
  headingStart: string;
  headingGradient: string;
  subtitle: string;
  primaryCtaText: string;
  perks: { id: string; title: string; description: string }[];
}

export interface FAQItemConfig {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FAQSectionConfig {
  badgeText: string;
  headingStart: string;
  headingGradient: string;
  subtitle: string;
  faqs: FAQItemConfig[];
}

export interface FinalCTAConfig {
  headlineStart: string;
  headlineGradient: string;
  subtitle: string;
  buttonText: string;
  guaranteeNote: string;
}

export interface HomepageConfig {
  hero: HeroConfig;
  marquee: MarqueeConfig;
  destinations: DestinationsSectionConfig;
  benefits: BenefitsSectionConfig;
  timeline: TimelineSectionConfig;
  marketplace: MarketplaceSplitConfig;
  testimonials: TestimonialsSectionConfig;
  whyJoinEarly: WhyJoinEarlyConfig;
  faqs: FAQSectionConfig;
  finalCta: FinalCTAConfig;
}
