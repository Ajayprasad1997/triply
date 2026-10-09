import React, { useState } from 'react';
import { 
  X, 
  CaretRight as ChevronRight, 
  CaretLeft as ChevronLeft, 
  Check, 
  Plus, 
  Trash as Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Sparkle as Sparkles, 
  Calendar, 
  CurrencyDollar as DollarSign, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  UploadSimple as Upload, 
  Stack as Layers, 
  WarningCircle as AlertCircle,
  Question as HelpCircle,
  Eye,
  Info,
  CheckCircle as CheckCircle2,
  Buildings as Building2,
  Tag
} from '@phosphor-icons/react';
import { TravelPackage, ItineraryDay, PackageAddon, TravelDateType, PriceBasis, AgencyPartner } from '../types';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';
import { SessionUser, saveSecurePackage } from '../data/packageService';
import { getAgencies } from '../data/mockData';
import { validateFileSize, validateFileType } from '../utils/security';
import { S3ImageUploader } from './S3ImageUploader';

interface TravelPackageFormWizardProps {
  initialData?: Partial<TravelPackage> | null;
  session: SessionUser;
  onClose: () => void;
  onSaved: (pkg: TravelPackage) => void;
}

const STEPS = [
  { id: 1, name: 'Basic Info', desc: 'Title, destination & duration' },
  { id: 2, name: 'Itinerary', desc: 'Day-by-day plan & activities' },
  { id: 3, name: 'Travel Info', desc: 'Dates, hotels & transit' },
  { id: 4, name: 'Pricing', desc: 'Rates, currency & add-ons' },
  { id: 5, name: 'Inclusions', desc: 'Included & excluded items' },
  { id: 6, name: 'Policies', desc: 'Cancellation & payments' },
  { id: 7, name: 'Media', desc: 'Photos & brochure PDF' },
  { id: 8, name: 'Preview', desc: 'Review & submit' },
];

const PRESET_CATEGORIES = [
  'Luxury & Desert',
  'Honeymoon & Nature',
  'Luxury & Rail',
  'Mountains & Culture',
  'Beaches & Island Hopping',
  'Adventure & Safari',
  'Cultural & Heritage',
  'Cruise & Water Sports',
  'Family Holiday'
];

const PRESET_TRAVELLER_TYPES = [
  'Couples',
  'Honeymooners',
  'Families',
  'Solo Travellers',
  'Small Groups',
  'VIP Groups',
  'Corporate / MICE',
  'Senior Travellers',
  'Adventure Seekers'
];

const PRESET_INCLUSIONS = [
  'Luxury Airport Transfers',
  'Daily 5-Star Buffet Breakfast',
  'All Entrance & Monument Tickets',
  'Dedicated English-Speaking Guide',
  'Private AC Vehicle for all Tours',
  'Special Welcome Dinner Cruise',
  'Complimentary 4G SIM Card'
];

const PRESET_EXCLUSIONS = [
  'International Flights',
  'Tourist Visa Fees',
  'Personal Expenses & Tips',
  'Travel & Medical Insurance',
  'City / Hotel Tourist Tax',
  'Optional Add-on Activities'
];

const SAMPLE_COVERS = [
  { label: 'Dubai Luxury Marina', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Maldives Overwater', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Swiss Alps Railway', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Bali Rice Terraces', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Kashmir Houseboat', url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Thailand Catamaran', url: 'https://images.unsplash.com/photo-1506665531195-3566af294e99?auto=format&fit=crop&w=1200&q=80' }
];

export const TravelPackageFormWizard: React.FC<TravelPackageFormWizardProps> = ({
  initialData,
  session,
  onClose,
  onSaved
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const agenciesList = getAgencies();

  // Form State
  const [formData, setFormData] = useState<Partial<TravelPackage>>({
    id: initialData?.id,
    agencyId: initialData?.agencyId || (session.role === 'agency' ? session.userId : agenciesList[0]?.id || 'ag-1'),
    agencyName: initialData?.agencyName || (session.role === 'agency' ? agenciesList.find(a => a.id === session.userId)?.name || 'Travel Partner' : agenciesList[0]?.name || 'Apex Emirates DMC'),
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    departureLocation: initialData?.departureLocation || '',
    category: initialData?.category || initialData?.theme || 'Luxury & Desert',
    theme: initialData?.theme || initialData?.category || 'Luxury & Desert',
    days: initialData?.days || 5,
    nights: initialData?.nights || 4,
    overview: initialData?.overview || '',
    travellerTypes: initialData?.travellerTypes || ['Couples', 'Families'],
    minTravellers: initialData?.minTravellers || 2,
    maxTravellers: initialData?.maxTravellers || 16,

    itinerary: initialData?.itinerary && initialData.itinerary.length > 0 ? initialData.itinerary : [
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'Arrival & VIP Airport Welcome',
        description: 'Airport meet & greet with private transfer to hotel. Check-in and leisure evening.',
        activities: ['Airport Meet & Greet', 'Hotel Check-in'],
        meals: ['Dinner'],
        accommodation: '4-Star / 5-Star City Hotel',
        transportation: 'Private AC Transfer'
      },
      {
        id: 'day-2',
        dayNumber: 2,
        title: 'Full Day Highlights & Guided Sightseeing Tour',
        description: 'Comprehensive guided city tour covering top cultural landmarks, photo stops, and panoramic viewpoints.',
        activities: ['City Landmarks Tour', 'Panoramic Viewpoint', 'Local Market Visit'],
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-Star / 5-Star City Hotel',
        transportation: 'Private AC Coach'
      },
      {
        id: 'day-3',
        dayNumber: 3,
        title: 'Signature Excursion & Sunset Experience',
        description: 'Exclusive destination experience including sunset dinner and cultural performance.',
        activities: ['Signature Excursion', 'Sunset Photography', 'Cultural Dinner Show'],
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-Star / 5-Star City Hotel',
        transportation: 'Private AC Coach'
      },
      {
        id: 'day-4',
        dayNumber: 4,
        title: 'Leisure Day / Optional Excursions',
        description: 'Free day for shopping, relaxing at hotel amenities, or booking optional add-on excursions.',
        activities: ['Leisure Time', 'Shopping at Local Bazaars'],
        meals: ['Breakfast'],
        accommodation: '4-Star / 5-Star City Hotel',
        transportation: 'On Request'
      },
      {
        id: 'day-5',
        dayNumber: 5,
        title: 'Souvenir Shopping & Airport Departure Transfer',
        description: 'Breakfast, check-out from hotel, and private transfer to airport for departure.',
        activities: ['Hotel Check-out', 'Airport Drop-off'],
        meals: ['Breakfast'],
        transportation: 'Private AC Transfer'
      }
    ],

    travelDateType: initialData?.travelDateType || 'Flexible',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    season: initialData?.season || 'October – April (Peak)',
    transportType: initialData?.transportType || 'Private AC Vehicle',
    hotelCategory: initialData?.hotelCategory || '5-Star Luxury',
    mealPlan: initialData?.mealPlan || 'Daily Breakfast + 2 Dinners (MAP)',
    pickupInfo: initialData?.pickupInfo || 'Airport Arrival Terminal',
    dropInfo: initialData?.dropInfo || 'Airport Departure Terminal',

    startingPrice: initialData?.startingPrice || 450,
    currency: initialData?.currency || 'INR',
    priceBasis: initialData?.priceBasis || 'Per Person',
    adultPrice: initialData?.adultPrice || 450,
    childPrice: initialData?.childPrice || 250,
    groupPrice: initialData?.groupPrice || 400,
    taxesIncluded: initialData?.taxesIncluded ?? true,
    addons: initialData?.addons || [
      { id: 'addon-1', name: 'Private Sunset Yacht / Boat Cruise', description: '2-Hour private charter with refreshments', price: 150, currency: 'INR' }
    ],

    inclusions: initialData?.inclusions || initialData?.included || [
      'Accommodation in selected hotel category',
      'Daily breakfast throughout the tour',
      'All private airport and sightseeing transfers',
      'English-speaking tour guide and entrance tickets'
    ],
    exclusions: initialData?.exclusions || [
      'International flights and tourist visas',
      'Personal expenses and gratuities',
      'Travel and medical insurance'
    ],

    cancellationPolicy: initialData?.cancellationPolicy || 'Free cancellation up to 7 days before arrival date. 50% fee within 3-6 days.',
    paymentPolicy: initialData?.paymentPolicy || '30% advance deposit at booking confirmation. 70% balance due 14 days prior to arrival.',
    importantNotes: initialData?.importantNotes || 'Valid passport with minimum 6 months validity required.',

    imageUrl: initialData?.imageUrl || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    galleryImages: initialData?.galleryImages || [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80'
    ],
    brochureUrl: initialData?.brochureUrl || '',
    status: initialData?.status || 'DRAFT',
    visibility: initialData?.visibility || 'PUBLIC',
    featured: initialData?.featured || false
  });

  // Step 1 Validation
  const validateCurrentStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.title?.trim() || formData.title.trim().length < 3) {
        setErrorMessage('Please enter a package title (minimum 3 characters).');
        return false;
      }
      if (!formData.destination?.trim()) {
        setErrorMessage('Please enter a destination.');
        return false;
      }
      if (!formData.days || formData.days < 1) {
        setErrorMessage('Duration must be at least 1 day.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.itinerary || formData.itinerary.length === 0) {
        setErrorMessage('Please add at least 1 itinerary day.');
        return false;
      }
    }
    if (step === 4) {
      if (formData.startingPrice === undefined || formData.startingPrice < 0) {
        setErrorMessage('Starting price must be 0 or higher.');
        return false;
      }
    }
    if (step === 7) {
      if (!formData.imageUrl?.trim()) {
        setErrorMessage('Please provide a cover image URL.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep(prev => Math.min(STEPS.length, prev + 1));
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Itinerary Helpers
  const handleAddDay = () => {
    const nextNum = (formData.itinerary?.length || 0) + 1;
    const newDay: ItineraryDay = {
      id: `day-${nextNum}-${Date.now()}`,
      dayNumber: nextNum,
      title: `Day ${nextNum}: Exploration & Discovery`,
      description: 'Scheduled activities, excursions, and leisure time.',
      activities: ['Guided Excursion', 'Sightseeing'],
      meals: ['Breakfast'],
      accommodation: 'Standard / Luxury Hotel',
      transportation: 'Private AC Transfer'
    };
    setFormData({
      ...formData,
      itinerary: [...(formData.itinerary || []), newDay]
    });
  };

  const handleRemoveDay = (index: number) => {
    const updated = (formData.itinerary || []).filter((_, i) => i !== index).map((d, i) => ({
      ...d,
      dayNumber: i + 1
    }));
    setFormData({ ...formData, itinerary: updated });
  };

  const handleDuplicateDay = (index: number) => {
    const list = [...(formData.itinerary || [])];
    const target = list[index];
    const duplicated: ItineraryDay = {
      ...target,
      id: `day-dup-${Date.now()}`,
      title: `${target.title} (Copy)`
    };
    list.splice(index + 1, 0, duplicated);
    const renumbered = list.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setFormData({ ...formData, itinerary: renumbered });
  };

  const handleMoveDay = (index: number, direction: 'up' | 'down') => {
    const list = [...(formData.itinerary || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    const renumbered = list.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setFormData({ ...formData, itinerary: renumbered });
  };

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const list = [...(formData.itinerary || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, itinerary: list });
  };

  // Addon Helpers
  const handleAddAddon = () => {
    const newAddon: PackageAddon = {
      id: `addon-${Date.now()}`,
      name: '',
      description: '',
      price: 50,
      currency: formData.currency || 'INR'
    };
    setFormData({ ...formData, addons: [...(formData.addons || []), newAddon] });
  };

  const handleRemoveAddon = (index: number) => {
    const updated = (formData.addons || []).filter((_, i) => i !== index);
    setFormData({ ...formData, addons: updated });
  };

  const handleUpdateAddon = (index: number, field: keyof PackageAddon, value: any) => {
    const list = [...(formData.addons || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, addons: list });
  };

  // Inclusions / Exclusions Helpers
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  const handleAddInclusion = (item: string) => {
    if (!item.trim()) return;
    if (!(formData.inclusions || []).includes(item.trim())) {
      setFormData({
        ...formData,
        inclusions: [...(formData.inclusions || []), item.trim()]
      });
    }
    setNewInclusion('');
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData({
      ...formData,
      inclusions: (formData.inclusions || []).filter((_, i) => i !== index)
    });
  };

  const handleAddExclusion = (item: string) => {
    if (!item.trim()) return;
    if (!(formData.exclusions || []).includes(item.trim())) {
      setFormData({
        ...formData,
        exclusions: [...(formData.exclusions || []), item.trim()]
      });
    }
    setNewExclusion('');
  };

  const handleRemoveExclusion = (index: number) => {
    setFormData({
      ...formData,
      exclusions: (formData.exclusions || []).filter((_, i) => i !== index)
    });
  };

  // Gallery Helpers
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    setFormData({
      ...formData,
      galleryImages: [...(formData.galleryImages || []), url.trim()]
    });
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      galleryImages: (formData.galleryImages || []).filter((_, i) => i !== index)
    });
  };

  // Final Save / Submit Handler
  const handleSavePackage = async (mode: 'SAVE_DRAFT' | 'SUBMIT') => {
    if (!validateCurrentStep(1) || !validateCurrentStep(2) || !validateCurrentStep(4)) {
      setCurrentStep(1);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const result = await saveSecurePackage(formData, session, mode);
    setSubmitting(false);

    if (result.success && result.package) {
      onSaved(result.package);
    } else {
      setErrorMessage(result.error || 'Failed to save package.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden relative text-slate-900 flex flex-col max-h-[92vh]">
        
        {/* ── HEADER & STEPPER ── */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-base sm:text-lg font-bold">
                  {initialData?.id ? 'Edit Travel Package' : 'Create New Travel Package'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {session.role === 'admin' ? 'Super Admin Global Authoring' : `Agency Partner: ${formData.agencyName}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Bar */}
          <div className="mt-4 pt-3 border-t border-slate-850/60 overflow-x-auto pb-1">
            <div className="flex items-center gap-1 sm:gap-2 min-w-[680px]">
              {STEPS.map((s) => {
                const isCurrent = currentStep === s.id;
                const isCompleted = currentStep > s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (validateCurrentStep(currentStep)) {
                        setCurrentStep(s.id);
                      }
                    }}
                    className={`flex-1 flex items-center gap-2 py-1.5 px-2 rounded-xl text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                        : isCompleted
                        ? 'bg-slate-900 text-emerald-400 hover:bg-slate-850 font-bold'
                        : 'bg-slate-900/40 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isCurrent ? 'bg-white text-blue-900 font-black' : isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3" /> : s.id}
                    </span>
                    <div className="truncate">
                      <p className="text-[11px] leading-tight truncate">{s.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ERROR NOTIFICATION ── */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── STEP CONTENT AREA (SCROLLABLE) ── */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          
          {/* ══════════════════════════════════════════════════════════════
              STEP 1: BASIC INFORMATION
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-100">
                <h4 className="font-heading text-sm font-bold text-slate-900">Step 1: Basic Package Details</h4>
                <p className="text-slate-500">Provide the foundational headline, destination, and traveller capacity.</p>
              </div>

              {/* Admin Agency Assignment */}
              {session.role === 'admin' && (
                <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-1">
                  <label className="text-sky-950 font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Assign to Travel Agency Partner *</span>
                  </label>
                  <select
                    value={formData.agencyName}
                    onChange={(e) => {
                      const selAg = agenciesList.find(a => a.name === e.target.value);
                      setFormData({
                        ...formData,
                        agencyName: e.target.value,
                        agencyId: selAg?.id || 'admin-managed',
                        agencyType: selAg?.type || 'DMC'
                      });
                    }}
                    className="w-full p-2.5 bg-white border border-sky-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
                  >
                    {agenciesList.map(ag => (
                      <option key={ag.id} value={ag.name}>{ag.name} ({ag.type}) — {ag.location}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5D/4N Royal Dubai Desert & Luxury Marina Getaway"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai & Abu Dhabi, UAE"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Departure / Starting Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Dubai International Airport (DXB)"
                    value={formData.departureLocation}
                    onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Package Category / Theme</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, theme: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Duration (Days) *</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.days}
                    onChange={(e) => {
                      const daysVal = Math.max(1, Number(e.target.value));
                      setFormData({ ...formData, days: daysVal, nights: Math.max(0, daysVal - 1) });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Duration (Nights)</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={formData.nights}
                    onChange={(e) => setFormData({ ...formData, nights: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Package Overview & Summary</label>
                <textarea
                  rows={3}
                  placeholder="Provide an enticing executive summary of this holiday package..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Minimum Travellers (Pax)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.minTravellers}
                    onChange={(e) => setFormData({ ...formData, minTravellers: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Maximum Travellers (Group Size)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxTravellers}
                    onChange={(e) => setFormData({ ...formData, maxTravellers: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 font-bold">Suitable Traveller Types</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TRAVELLER_TYPES.map(type => {
                    const isSelected = (formData.travellerTypes || []).includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          const list = formData.travellerTypes || [];
                          if (isSelected) {
                            setFormData({ ...formData, travellerTypes: list.filter(t => t !== type) });
                          } else {
                            setFormData({ ...formData, travellerTypes: [...list, type] });
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: DAY-WISE ITINERARY
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-900">Step 2: Day-Wise Itinerary Plan</h4>
                  <p className="text-slate-500">Construct detailed day-by-day itineraries with meals, transport, and hotels.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Day</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.itinerary || []).map((day, index) => (
                  <div key={day.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 relative group">
                    
                    {/* Day Header Bar */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                          {day.dayNumber}
                        </span>
                        <input
                          type="text"
                          value={day.title}
                          placeholder={`Day ${day.dayNumber} Headline Title`}
                          onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                          className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs w-full sm:w-80 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Day Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveDay(index, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          title="Move Day Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === (formData.itinerary?.length || 1) - 1}
                          onClick={() => handleMoveDay(index, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          title="Move Day Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateDay(index)}
                          className="p-1 text-slate-500 hover:text-blue-600 cursor-pointer"
                          title="Duplicate Day"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(index)}
                          className="p-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                          title="Delete Day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Day Description */}
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold text-[11px]">Day Itinerary Description</label>
                      <textarea
                        rows={2}
                        value={day.description}
                        placeholder="Detailed schedule of sightseeing, transfers, and experiences..."
                        onChange={(e) => handleUpdateDay(index, 'description', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Activities & Meals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-600 font-bold text-[11px]">Activities & Sightseeing (Comma separated)</label>
                        <input
                          type="text"
                          value={day.activities.join(', ')}
                          placeholder="e.g. City Tour, Burj Khalifa, Sunset Cruise"
                          onChange={(e) => handleUpdateDay(index, 'activities', e.target.value.split(',').map(a => a.trim()).filter(Boolean))}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-600 font-bold text-[11px]">Meals Included</label>
                        <div className="flex items-center gap-2 pt-1">
                          {['Breakfast', 'Lunch', 'Dinner'].map(meal => {
                            const hasMeal = day.meals.includes(meal);
                            return (
                              <button
                                key={meal}
                                type="button"
                                onClick={() => {
                                  if (hasMeal) {
                                    handleUpdateDay(index, 'meals', day.meals.filter(m => m !== meal));
                                  } else {
                                    handleUpdateDay(index, 'meals', [...day.meals, meal]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                                  hasMeal
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600'
                                }`}
                              >
                                {hasMeal ? '✓ ' : '+ '}{meal}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Accommodation & Transportation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-600 font-bold text-[11px]">Accommodation / Hotel</label>
                        <input
                          type="text"
                          value={day.accommodation || ''}
                          placeholder="e.g. 5-Star Address Downtown or similar"
                          onChange={(e) => handleUpdateDay(index, 'accommodation', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-600 font-bold text-[11px]">Transportation Mode</label>
                        <input
                          type="text"
                          value={day.transportation || ''}
                          placeholder="e.g. Private Luxury AC SUV"
                          onChange={(e) => handleUpdateDay(index, 'transportation', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 3: TRAVEL INFORMATION & LOGISTICS
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-100">
                <h4 className="font-heading text-sm font-bold text-slate-900">Step 3: Travel Logistics & Hospitality</h4>
                <p className="text-slate-500">Specify dates, hotel classifications, meal plans, and transfer checkpoints.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Travel Date Type</label>
                  <select
                    value={formData.travelDateType}
                    onChange={(e) => setFormData({ ...formData, travelDateType: e.target.value as TravelDateType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Flexible">Flexible / On-Demand Dates</option>
                    <option value="Fixed Date">Fixed Departure Date</option>
                    <option value="Date Range">Specific Date Range Window</option>
                    <option value="Seasonal">Seasonal Availability</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Applicable Season</label>
                  <input
                    type="text"
                    placeholder="e.g. October – April (Peak Winter)"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {(formData.travelDateType === 'Fixed Date' || formData.travelDateType === 'Date Range') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <div className="space-y-1">
                    <label className="text-blue-900 font-bold">Start / Departure Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full p-2 bg-white border border-blue-200 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-blue-900 font-bold">End / Return Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full p-2 bg-white border border-blue-200 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Hotel Category</label>
                  <select
                    value={formData.hotelCategory}
                    onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5-Star Luxury">5-Star Luxury</option>
                    <option value="4.5-Star Boutique Villa">4.5-Star Boutique Villa</option>
                    <option value="4-Star City Center">4-Star City Center</option>
                    <option value="3-Star Standard">3-Star Standard</option>
                    <option value="Luxury Houseboat / Camp">Luxury Houseboat / Camp</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Hospitality Meal Plan</label>
                  <select
                    value={formData.mealPlan}
                    onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Daily Breakfast (CP)">Daily Breakfast (CP)</option>
                    <option value="Daily Breakfast + Dinner (MAP)">Daily Breakfast + Dinner (MAP)</option>
                    <option value="All Meals Included (AP)">All Meals Included (AP)</option>
                    <option value="All-Inclusive Resort (AI)">All-Inclusive Resort (AI)</option>
                    <option value="Room Only (EP)">Room Only (EP)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Primary Transport Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Private Luxury SUV"
                    value={formData.transportType}
                    onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Pickup Checkpoint Information</label>
                  <input
                    type="text"
                    placeholder="e.g. DXB Airport Terminal 1, 2 or 3 Arrival Gate"
                    value={formData.pickupInfo}
                    onChange={(e) => setFormData({ ...formData, pickupInfo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Drop-off / Departure Checkpoint</label>
                  <input
                    type="text"
                    placeholder="e.g. DXB Airport Departure Terminal"
                    value={formData.dropInfo}
                    onChange={(e) => setFormData({ ...formData, dropInfo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: PRICING, CURRENCY & ADD-ONS
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-100">
                <h4 className="font-heading text-sm font-bold text-slate-900">Step 4: Pricing, Currency & Add-ons</h4>
                <p className="text-slate-500">Configure B2B starting rates, tiered pricing, and optional excursion add-ons.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Base Starting Price *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.startingPrice}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setFormData({ ...formData, startingPrice: p, adultPrice: p });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AED">AED (AED)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Price Basis</label>
                  <select
                    value={formData.priceBasis}
                    onChange={(e) => setFormData({ ...formData, priceBasis: e.target.value as PriceBasis })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Per Person">Per Person / Pax</option>
                    <option value="Per Group">Per Group (Total Package)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Adult Price ({formData.currency})</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.adultPrice}
                    onChange={(e) => setFormData({ ...formData, adultPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Child Price ({formData.currency})</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.childPrice}
                    onChange={(e) => setFormData({ ...formData, childPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Group Rate ({formData.currency})</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.groupPrice}
                    onChange={(e) => setFormData({ ...formData, groupPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="taxesInc"
                  checked={formData.taxesIncluded}
                  onChange={(e) => setFormData({ ...formData, taxesIncluded: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="taxesInc" className="text-slate-800 font-bold cursor-pointer">
                  All Applicable Local Taxes & Surcharges Included in Price
                </label>
              </div>

              {/* Dynamic Add-ons Builder */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-900 font-bold">Optional Add-ons & Upgrades</label>
                  <button
                    type="button"
                    onClick={handleAddAddon}
                    className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Option
                  </button>
                </div>

                {(formData.addons || []).map((addon, index) => (
                  <div key={addon.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="Add-on Name (e.g. VIP Helicopter Tour)"
                      value={addon.name}
                      onChange={(e) => handleUpdateAddon(index, 'name', e.target.value)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold flex-1 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={addon.description}
                      onChange={(e) => handleUpdateAddon(index, 'description', e.target.value)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold flex-1 w-full"
                    />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-slate-500 font-bold">{formData.currency}</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Price"
                        value={addon.price}
                        onChange={(e) => handleUpdateAddon(index, 'price', Number(e.target.value))}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold w-24"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAddon(index)}
                        className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 5: INCLUSIONS & EXCLUSIONS
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-100">
                <h4 className="font-heading text-sm font-bold text-slate-900">Step 5: Inclusions & Exclusions</h4>
                <p className="text-slate-500">Define transparent amenities and out-of-pocket guest exclusions.</p>
              </div>

              {/* Inclusions */}
              <div className="space-y-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <label className="text-emerald-950 font-bold flex items-center justify-between">
                  <span>Package Inclusions (What’s Included)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{formData.inclusions?.length || 0} items</span>
                </label>

                {/* Preset quick pills */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_INCLUSIONS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleAddInclusion(p)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      + {p}
                    </button>
                  ))}
                </div>

                {/* Custom Add input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom inclusion..."
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclusion(newInclusion);
                      }
                    }}
                    className="flex-1 p-2 bg-white border border-emerald-200 rounded-xl text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddInclusion(newInclusion)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {(formData.inclusions || []).map((inc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-100 text-slate-800">
                      <span className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold">{inc}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(i)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                <label className="text-rose-950 font-bold flex items-center justify-between">
                  <span>Package Exclusions (What’s NOT Included)</span>
                  <span className="text-[10px] text-rose-700 font-semibold">{formData.exclusions?.length || 0} items</span>
                </label>

                {/* Preset quick pills */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_EXCLUSIONS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleAddExclusion(p)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-800 text-[10px] font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      + {p}
                    </button>
                  ))}
                </div>

                {/* Custom Add input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom exclusion..."
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExclusion(newExclusion);
                      }
                    }}
                    className="flex-1 p-2 bg-white border border-rose-200 rounded-xl text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddExclusion(newExclusion)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {(formData.exclusions || []).map((exc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white rounded-xl border border-rose-100 text-slate-800">
                      <span className="flex items-center gap-2">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span className="font-semibold">{exc}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(i)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 6: POLICIES & GUIDELINES
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-100">
                <h4 className="font-heading text-sm font-bold text-slate-900">Step 6: Cancellation & Payment Terms</h4>
                <p className="text-slate-500">Provide transparent booking regulations and travel advisories.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-bold">Cancellation Conditions</label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cancellationPolicy: 'Free cancellation up to 7 days before departure. 50% fee within 3-6 days. Non-refundable under 48 hours.' })}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Use Moderate Preset
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cancellationPolicy: '100% Free cancellation up to 24 hours prior to tour commencement.' })}
                      className="text-[10px] font-bold text-emerald-600 hover:underline"
                    >
                      Use Flexible Preset
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-bold">Payment Terms & Schedule</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentPolicy: '30% advance deposit at booking confirmation. Remaining 70% due 14 days prior to arrival.' })}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    Use Standard B2B Schedule
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.paymentPolicy}
                  onChange={(e) => setFormData({ ...formData, paymentPolicy: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 font-bold">Important Instructions for Travellers</label>
                <textarea
                  rows={3}
                  placeholder="Visa requirements, luggage allowances, local customs and dress codes..."
                  value={formData.importantNotes}
                  onChange={(e) => setFormData({ ...formData, importantNotes: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 7: MEDIA & BROCHURE HUB
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-100">
                <h4 className="font-heading text-sm font-bold text-slate-900">Step 7: Media Assets & Brochure</h4>
                <p className="text-slate-500">Upload or select high-resolution showcase imagery and itinerary brochure links.</p>
              </div>

              {/* S3 Cover Image Uploader */}
              <div className="space-y-2">
                <S3ImageUploader
                  value={formData.imageUrl || ''}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  label="Main Cover Image"
                  bucketPath="packages/covers"
                  helperText="High-resolution cover image optimized for all devices."
                  required={true}
                />

                {/* Sample cover quick picks */}
                <div className="pt-2">
                  <p className="text-[11px] text-slate-400 font-bold mb-1.5">Or choose from HD travel presets:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {SAMPLE_COVERS.map((sample, i) => (
                      <div
                        key={i}
                        onClick={() => setFormData({ ...formData, imageUrl: sample.url })}
                        className={`group relative h-16 rounded-xl overflow-hidden border cursor-pointer ${
                          formData.imageUrl === sample.url ? 'border-blue-600 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold text-center p-1 transition-opacity">
                          {sample.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multi-Photo Gallery */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-bold">Photo Gallery Images</label>
                  <span className="text-[11px] text-slate-400">{formData.galleryImages?.length || 0} images</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL to add to gallery..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddGalleryImage(newGalleryUrl)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Add Image
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(formData.galleryImages || []).map((imgUrl, i) => (
                    <div key={i} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Brochure Link */}
              <div className="space-y-1 pt-3 border-t border-slate-100">
                <label className="text-slate-700 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Package Brochure PDF URL (Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://agency.com/brochures/dubai-luxury.pdf"
                  value={formData.brochureUrl}
                  onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400">Allows travel agents and clients to download an official branded PDF datasheet directly.</p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 8: LIVE INTERACTIVE PREVIEW
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-900">Step 8: Final Package Preview</h4>
                  <p className="text-slate-500">Verify all package details before saving as draft or submitting for approval.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
                  Preview Mode
                </span>
              </div>

              {/* Full Preview Mockup Card */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-lg bg-white">
                
                {/* Hero Header */}
                <div className="relative h-56 bg-slate-950">
                  <img src={formData.imageUrl} alt={formData.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-sky-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase shadow">
                      {formData.category}
                    </span>
                    <span className="bg-slate-950/80 backdrop-blur-md text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner Package
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <p className="text-xs text-sky-300 font-semibold mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {formData.destination} • {formData.days} Days / {formData.nights} Nights
                    </p>
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold">{formData.title}</h3>
                    <p className="text-sm font-bold text-emerald-400 mt-1">
                      {formData.currency} {Number(formData.startingPrice).toLocaleString()} / {formData.priceBasis}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-6 space-y-6">
                  
                  {formData.overview && (
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Package Overview</h5>
                      <p className="text-slate-600 leading-relaxed">{formData.overview}</p>
                    </div>
                  )}

                  {/* Day Wise Itinerary */}
                  <div>
                    <h5 className="font-bold text-slate-900 mb-3 flex items-center justify-between">
                      <span>Day-Wise Itinerary ({formData.itinerary?.length} Days)</span>
                    </h5>
                    <div className="space-y-3">
                      {(formData.itinerary || []).map((d) => (
                        <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">
                              Day {d.dayNumber}: {d.title}
                            </span>
                            {d.meals && d.meals.length > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                Meals: {d.meals.join(', ')}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1.5">{d.description}</p>
                          {d.activities && d.activities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {d.activities.map((act, idx) => (
                                <span key={idx} className="text-[9px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                  • {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions & Exclusions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                      <p className="font-bold text-emerald-950 mb-2">Inclusions</p>
                      <ul className="space-y-1 text-[11px] text-slate-700">
                        {(formData.inclusions || []).map((inc, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100">
                      <p className="font-bold text-rose-950 mb-2">Exclusions</p>
                      <ul className="space-y-1 text-[11px] text-slate-700">
                        {(formData.exclusions || []).map((exc, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Agency Partner Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Published Under Partner</p>
                      <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{formData.agencyName}</span>
                        <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                      Direct WhatsApp & Email Lead Routing
                    </span>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

        {/* ── STICKY BOTTOM ACTION CONTROLS ── */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Save Draft Button (Always available) */}
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSavePackage('SAVE_DRAFT')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Save as Draft
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSavePackage('SUBMIT')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{session.role === 'admin' ? 'Publish & Approve Package' : 'Submit Package for Review'}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
