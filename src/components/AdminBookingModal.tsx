import React, { useState, useEffect } from 'react';
import {
  X,
  Receipt,
  Plus,
  Trash,
  Calendar,
  CurrencyInr,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  CreditCard,
  Tag,
  Sparkle,
  Phone,
  Envelope,
  Globe,
  Note,
  Bed,
  ForkKnife,
  Car,
  Compass,
  IdentificationCard,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CaretRight,
  Percent
} from '@phosphor-icons/react';
import { CustomerBooking, TravelPackage, AgencyPartner, BookingStatus } from '../types';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';

interface AdminBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (booking: CustomerBooking) => void;
  packages: TravelPackage[];
  agencies: AgencyPartner[];
  editingBooking?: CustomerBooking | null;
}

// Indian Room & Accommodation Options (INR ₹)
const INDIAN_ROOM_OPTIONS = [
  { name: 'Standard Deluxe AC Room (Included in Base)', surcharge: 0, desc: 'Well-appointed comfortable AC room with attached bath' },
  { name: 'Premium Valley View / Sea-Facing Room', surcharge: 2500, desc: 'Scenic panoramic private balcony & premium amenities' },
  { name: 'Royal Heritage Haveli / Luxury Houseboat Suite', surcharge: 5500, desc: 'Authentic royal architecture with bespoke butler assistance' },
  { name: '5-Star Luxury Private Pool Villa / Suite', surcharge: 12000, desc: 'Ultra-luxury private pool cottage with jacuzzi & spa access' },
  { name: 'Executive Family Interconnecting Suite', surcharge: 6500, desc: 'Spacious dual-bedroom suite ideal for families with kids' },
];

// Indian Meal Plan Options (INR ₹)
const INDIAN_MEAL_PLANS = [
  { code: 'EP', name: 'EP: European Plan (Room Only)', pricePerPaxDay: 0, desc: 'No meals included; dine as you wish' },
  { code: 'CP', name: 'CP: Continental Plan (Daily Buffet Breakfast)', pricePerPaxDay: 750, desc: 'Complimentary hot Indian & Continental breakfast buffet' },
  { code: 'MAP', name: 'MAP: Modified American Plan (Breakfast + Dinner)', pricePerPaxDay: 1650, desc: 'Daily rich buffet breakfast + 4-course dinner' },
  { code: 'AP', name: 'AP: American Plan (All Meals: Breakfast + Lunch + Dinner)', pricePerPaxDay: 2450, desc: 'Full-board gourmet breakfast, lunch, high tea & dinner' },
];

// Indian Tour Add-ons & Local Experiences (INR ₹)
const INDIAN_ADDON_OPTIONS = [
  { id: 'addon-innova', name: 'Private AC Innova Crysta / SUV Chauffeur Upgrade', price: 6500, category: 'Transport' },
  { id: 'addon-safari', name: 'Traditional Shikara Cruise / Desert Jeep & Camel Safari', price: 2200, category: 'Experience' },
  { id: 'addon-dinner', name: 'Royal Candlelight Dinner with Cake & Flower Bouquet', price: 3500, category: 'Dining' },
  { id: 'addon-adventure', name: 'Adventure Pass: River Rafting / Paragliding / Scuba Dive', price: 4200, category: 'Adventure' },
  { id: 'addon-guide', name: 'Certified Government-Approved Local Tour Guide', price: 2000, category: 'Guidance' },
  { id: 'addon-insurance', name: 'Comprehensive Domestic Travel & Medical Insurance Cover', price: 450, category: 'Safety' },
  { id: 'addon-extra-bed', name: 'Extra Rollaway Mattress / Folding Bed for Child/Adult', price: 1500, category: 'Stay' },
];

// Major Indian Origin Airports & Hubs
const INDIAN_ORIGIN_CITIES = [
  'Mumbai (BOM)',
  'Delhi NCR (DEL)',
  'Bengaluru (BLR)',
  'Chennai (MAA)',
  'Hyderabad (HYD)',
  'Kolkata (CCU)',
  'Ahmedabad (AMD)',
  'Pune (PNQ)',
  'Kochi (COK)',
  'Jaipur (JAI)',
  'Chandigarh (IXC)',
  'Lucknow (LKO)',
  'Surat (STV)',
  'Goa (GOI / GOX)',
  'Indore (IDR)',
  'Bhubaneswar (BBI)',
  'Guwahati (GAU)'
];

// Indian States & Union Territories
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi NCR', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Chandigarh', 'Puducherry', 'Andaman & Nicobar'
];

export const AdminBookingModal: React.FC<AdminBookingModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  packages,
  agencies,
  editingBooking
}) => {
  if (!isOpen) return null;

  // 3-Step Wizard Navigation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // ── STEP 1: TRIP & PACK DETAILS ──
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    editingBooking?.packageId || (packages[0]?.id || '')
  );
  const [customPackageTitle, setCustomPackageTitle] = useState<string>(
    editingBooking?.packageTitle || ''
  );
  const [customDestination, setCustomDestination] = useState<string>(
    editingBooking?.destination || 'Kashmir'
  );
  const [customDuration, setCustomDuration] = useState<string>(
    editingBooking?.duration || '6 Days / 5 Nights'
  );
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(
    editingBooking?.agencyId || (agencies[0]?.id || '')
  );

  // Dates & Party
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const defaultDeparture = tomorrow.toISOString().split('T')[0];

  const returnCalc = new Date(tomorrow);
  returnCalc.setDate(returnCalc.getDate() + 5);
  const defaultReturn = returnCalc.toISOString().split('T')[0];

  const [travelDate, setTravelDate] = useState(editingBooking?.travelDate || defaultDeparture);
  const [returnDate, setReturnDate] = useState(editingBooking?.returnDate || defaultReturn);
  const [departureCity, setDepartureCity] = useState(editingBooking?.departureCity || 'Mumbai (BOM)');

  const [adultsCount, setAdultsCount] = useState<number>(editingBooking?.pricing.adultsCount || 2);
  const [childrenCount, setChildrenCount] = useState<number>(editingBooking?.pricing.childrenCount || 0);
  const [infantsCount, setInfantsCount] = useState<number>(editingBooking?.pricing.infantsCount || 0);

  // ── STEP 2: ACCOMMODATION, ADD-ONS & COMMERCIAL PRICING (INR ₹) ──
  const [selectedRoom, setSelectedRoom] = useState<{ name: string; surcharge: number }>(() => {
    if (editingBooking) {
      const match = INDIAN_ROOM_OPTIONS.find(r => r.name === editingBooking.roomType);
      return match || { name: editingBooking.roomType, surcharge: editingBooking.pricing.roomUpgradeCost || 0 };
    }
    return INDIAN_ROOM_OPTIONS[0];
  });

  const [selectedMealPlan, setSelectedMealPlan] = useState<string>('CP');

  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number }[]>(
    editingBooking?.selectedAddons || [INDIAN_ADDON_OPTIONS[0]]
  );

  // Pricing (in INR ₹)
  const [customAdultRate, setCustomAdultRate] = useState<number>(() => {
    if (editingBooking) return editingBooking.pricing.basePricePerAdult;
    const pkg = packages.find(p => p.id === (packages[0]?.id || ''));
    if (pkg) {
      const numeric = parseInt(pkg.priceEstimate.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numeric) && numeric > 0) return numeric < 1000 ? numeric * 80 : numeric;
    }
    return 18500;
  });

  const [customChildRate, setCustomChildRate] = useState<number>(
    editingBooking ? editingBooking.pricing.childPricePerChild : Math.round(customAdultRate * 0.55)
  );

  const [gstPercentage, setGstPercentage] = useState<number>(5); // Standard 5% GST on Indian Tour Packages
  const [discountAmount, setDiscountAmount] = useState<number>(editingBooking?.pricing.discount || 0);
  const [promoCode, setPromoCode] = useState<string>(editingBooking?.promoCode || 'TRIPINDIA26');

  const [paymentMode, setPaymentMode] = useState<'HOLD_CARD' | 'DEPOSIT_20' | 'FULL_PAY'>(
    editingBooking?.paymentMode || 'FULL_PAY'
  );
  const [paymentChannel, setPaymentChannel] = useState<'UPI' | 'NEFT_IMPS' | 'CARD' | 'CASH'>('UPI');

  // ── STEP 3: CUSTOMER & INDIAN GUEST DETAILS ──
  const [leadName, setLeadName] = useState(editingBooking?.leadGuest.fullName || '');
  const [leadEmail, setLeadEmail] = useState(editingBooking?.leadGuest.email || '');
  const [leadPhone, setLeadPhone] = useState(editingBooking?.leadGuest.phone || '+91 ');
  const [leadState, setLeadState] = useState(editingBooking?.leadGuest.country === 'India' ? 'Maharashtra' : (editingBooking?.leadGuest.country || 'Maharashtra'));
  const [leadCity, setLeadCity] = useState('Mumbai');
  const [leadPinCode, setLeadPinCode] = useState('400001');

  const [idProofType, setIdProofType] = useState<'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Driving License' | 'Voter ID'>('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState<string>('');

  const [gstinNumber, setGstinNumber] = useState<string>('');
  const [companyBillingName, setCompanyBillingName] = useState<string>('');

  const [dietary, setDietary] = useState(editingBooking?.leadGuest.dietaryPreference || 'Pure Vegetarian');
  const [specialRequests, setSpecialRequests] = useState(editingBooking?.notes || '');

  const [coTravelers, setCoTravelers] = useState<string[]>(
    editingBooking?.coTravelers || ['']
  );

  const [status, setStatus] = useState<BookingStatus>(editingBooking?.status || 'CONFIRMED');
  const [adminInternalNotes, setAdminInternalNotes] = useState<string>(
    editingBooking?.notes ? `Admin Booking: ${editingBooking.notes}` : 'Direct Offline Indian Desk Reservation via Admin'
  );

  // Sync Package Selection
  const activePackage = packages.find(p => p.id === selectedPkgId) || packages[0];
  const matchedAgency = agencies.find(a => a.id === selectedAgencyId || a.id === activePackage?.agencyId || a.name === activePackage?.agencyName) || agencies[0];

  useEffect(() => {
    if (activePackage && !editingBooking) {
      setCustomPackageTitle(activePackage.title);
      setCustomDestination(activePackage.destination);
      setCustomDuration(activePackage.duration);
      if (activePackage.agencyId) setSelectedAgencyId(activePackage.agencyId);

      const numeric = parseInt(activePackage.priceEstimate.replace(/[^0-9]/g, ''), 10);
      const base = isNaN(numeric) || numeric === 0 ? 18500 : (numeric < 1000 ? numeric * 80 : numeric);
      setCustomAdultRate(base);
      setCustomChildRate(Math.round(base * 0.55));
    }
  }, [selectedPkgId]);

  // Financial Calculations (INR ₹)
  const adultSubtotal = adultsCount * customAdultRate;
  const childSubtotal = childrenCount * customChildRate;
  const roomUpgradeCost = selectedRoom.surcharge;
  const addonsTotal = selectedAddons.reduce((acc, addon) => acc + addon.price, 0);

  // Meal Plan Addon calculation (assuming duration days, defaults to 5 days)
  const daysNumeric = parseInt(customDuration.replace(/[^0-9]/g, ''), 10) || 5;
  const mealPlanOption = INDIAN_MEAL_PLANS.find(m => m.code === selectedMealPlan);
  const mealPlanCost = (mealPlanOption?.pricePerPaxDay || 0) * (adultsCount + childrenCount) * (daysNumeric > 1 ? daysNumeric - 1 : 1);

  const taxableAmount = adultSubtotal + childSubtotal + roomUpgradeCost + addonsTotal + mealPlanCost;
  const gstAmount = Math.round((taxableAmount * gstPercentage) / 100);
  const subtotalWithTaxes = taxableAmount + gstAmount;
  const totalAmount = Math.max(0, subtotalWithTaxes - discountAmount);

  const depositAmount = paymentMode === 'DEPOSIT_20'
    ? Math.round(totalAmount * 0.2)
    : paymentMode === 'FULL_PAY'
      ? totalAmount
      : 0;

  // Add/Remove Co-travelers
  const handleAddCoTraveler = () => setCoTravelers([...coTravelers, '']);
  const handleUpdateCoTraveler = (index: number, val: string) => {
    const arr = [...coTravelers];
    arr[index] = val;
    setCoTravelers(arr);
  };
  const handleRemoveCoTraveler = (index: number) => {
    setCoTravelers(coTravelers.filter((_, i) => i !== index));
  };

  // Toggle Addons
  const handleToggleAddon = (addon: { id: string; name: string; price: number }) => {
    const exists = selectedAddons.some(a => a.id === addon.id);
    if (exists) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Validation before advancing steps
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!travelDate) {
        alert('Please select a valid departure travel date.');
        return;
      }
      if (adultsCount < 1) {
        alert('Please include at least 1 adult traveler in the pack.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (customAdultRate <= 0) {
        alert('Please provide a valid adult tour rate.');
        return;
      }
      setCurrentStep(3);
    }
  };

  // Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadName.trim() || !leadPhone.trim() || leadPhone.trim().length < 8) {
      alert('Please provide lead guest legal name and valid 10-digit Indian contact number.');
      setCurrentStep(3);
      return;
    }

    const bookingId = editingBooking?.id || `TRP-IN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const notesSummary = [
      adminInternalNotes,
      gstinNumber ? `GSTIN: ${gstinNumber} (${companyBillingName})` : '',
      idProofNumber ? `ID Proof: ${idProofType} (${idProofNumber})` : '',
      `Meal Plan: ${mealPlanOption?.name || 'CP'}`,
      `Payment Channel: ${paymentChannel}`
    ].filter(Boolean).join(' | ');

    const newBooking: CustomerBooking = {
      id: bookingId,
      packageId: activePackage?.id || `pkg-custom-${Date.now()}`,
      packageTitle: customPackageTitle.trim() || activePackage?.title || 'Custom Domestic India Tour',
      destination: customDestination.trim() || activePackage?.destination || 'India',
      duration: customDuration.trim() || activePackage?.duration || '6 Days / 5 Nights',
      imageUrl: activePackage?.imageUrl || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      agencyId: matchedAgency?.id || 'ag-4',
      agencyName: matchedAgency?.name || 'Kashmir Valley Retreats',
      agencyLogo: matchedAgency?.logoUrl,
      departureCity: departureCity || 'Mumbai (BOM)',
      travelDate: travelDate,
      returnDate: returnDate || undefined,
      roomType: selectedRoom.name,
      leadGuest: {
        fullName: leadName.trim(),
        email: leadEmail.trim() || `${leadName.toLowerCase().replace(/\s+/g, '')}@guest.triiply.in`,
        phone: leadPhone.trim(),
        country: `${leadCity}, ${leadState}, India (PIN: ${leadPinCode})`,
        dietaryPreference: dietary,
        specialRequests: specialRequests.trim() || undefined,
      },
      coTravelers: coTravelers.filter(t => t.trim().length > 0),
      selectedAddons: [
        ...selectedAddons,
        ...(mealPlanCost > 0 ? [{ id: 'addon-meals', name: mealPlanOption?.name || 'Meal Plan', price: mealPlanCost }] : [])
      ],
      pricing: {
        basePricePerAdult: customAdultRate,
        childPricePerChild: customChildRate,
        adultsCount: adultsCount,
        childrenCount: childrenCount,
        infantsCount: infantsCount,
        subtotal: adultSubtotal + childSubtotal,
        addonsTotal: addonsTotal + mealPlanCost,
        roomUpgradeCost: roomUpgradeCost,
        taxesAndFees: gstAmount,
        discount: discountAmount,
        totalAmount: totalAmount,
        depositAmount: depositAmount,
        currency: 'INR',
      },
      paymentMode: paymentMode,
      status: status,
      bookingDate: editingBooking?.bookingDate || new Date().toISOString(),
      promoCode: promoCode.trim() || undefined,
      notes: notesSummary,
    };

    onSaved(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* ── MODAL TOP HEADER & STEP INDICATOR ── */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Receipt className="w-6 h-6" weight="fill" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    🇮🇳 India Domestic Console
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Super Admin
                  </span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-black text-white mt-1">
                  {editingBooking ? `Edit Reservation #${editingBooking.id}` : 'Admin Reservation & Booking Manager'}
                </h2>
                <p className="text-xs text-slate-400">
                  Direct offline reservation entry, agency phone orders, and bespoke Indian VIP client bookings.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Step Wizard Navigation Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : currentStep > 1
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 1 ? 'bg-white text-blue-600' : currentStep > 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="truncate">1. Trip & Pack Details</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : currentStep > 2
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 2 ? 'bg-white text-blue-600' : currentStep > 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className="truncate">2. Stay, Add-ons & Price (₹)</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currentStep === 3
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 3 ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-300'}`}>
                3
              </span>
              <span className="truncate">3. Indian Guest Details</span>
            </button>
          </div>
        </div>

        {/* ── MODAL BODY (SCROLLABLE) ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-50 space-y-6">
          
          {/* ════════════════════════════════════════════════════════════════════
              STEP 1: TRIP & PACK DETAILS
             ════════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Trip Logistics & Pack Size</h3>
                  <p className="text-xs text-slate-500">Select domestic tour package, dates, Indian origin hub, and traveler pack numbers.</p>
                </div>
              </div>

              {/* Package Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Indian Tour Catalog Package
                  </label>
                  <select
                    value={selectedPkgId}
                    onChange={(e) => setSelectedPkgId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  >
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} ({pkg.destination}) • {pkg.agencyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Operating Indian DMC / Ground Partner
                  </label>
                  <select
                    value={selectedAgencyId}
                    onChange={(e) => setSelectedAgencyId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  >
                    {agencies.map(ag => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.location}) {ag.verified ? '✓ Verified Partner' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Editable Package Details Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">Itinerary / Tour Title</label>
                  <input
                    type="text"
                    required
                    value={customPackageTitle}
                    onChange={(e) => setCustomPackageTitle(e.target.value)}
                    placeholder="e.g. Kashmir Dal Lake & Gulmarg Snow Safari"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">Domestic Destination</label>
                  <input
                    type="text"
                    required
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    placeholder="e.g. Srinagar, Kashmir / Goa / Kerala"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">Duration Format</label>
                  <input
                    type="text"
                    required
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="e.g. 6 Days / 5 Nights"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dates & Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    <Calendar className="w-4 h-4 inline-block mr-1 text-slate-500" />
                    Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    <Calendar className="w-4 h-4 inline-block mr-1 text-slate-500" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    <MapPin className="w-4 h-4 inline-block mr-1 text-slate-500" />
                    Indian Departure City / Hub
                  </label>
                  <select
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  >
                    {INDIAN_ORIGIN_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pack Size / Passenger Counts */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h4 className="font-heading text-sm font-bold text-slate-900">Traveler Pack Breakdown</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    Total Pack: {adultsCount + childrenCount + infantsCount} Travelers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Adults */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Adults (12+ yrs)</p>
                      <p className="text-[10px] text-slate-500">Full fare seat & bed</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">{adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultsCount(adultsCount + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Children (5-11 yrs)</p>
                      <p className="text-[10px] text-slate-500">55% child rate fare</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Infants (&lt;5 yrs)</p>
                      <p className="text-[10px] text-slate-500">Free domestic stay</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">{infantsCount}</span>
                      <button
                        type="button"
                        onClick={() => setInfantsCount(infantsCount + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1 Footer Action */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Stay, Add-ons & Price</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STEP 2: ACCOMMODATION, ADD-ONS & COMMERCIAL PRICING (INR ₹)
             ════════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Accommodation, Add-ons & Indian Commercials (₹ INR)</h3>
                  <p className="text-xs text-slate-500">Configure room category, meal plans, curated local Indian activities, and custom ₹ pricing.</p>
                </div>
              </div>

              {/* Room Tier Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-blue-600" />
                  Select Accommodation / Room Tier
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INDIAN_ROOM_OPTIONS.map((room) => {
                    const isSelected = selectedRoom.name === room.name;
                    return (
                      <div
                        key={room.name}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-xs text-slate-900">{room.name}</div>
                          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${room.surcharge === 0 ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                            {room.surcharge === 0 ? 'Included (₹0)' : `+₹${room.surcharge.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{room.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meal Plan Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ForkKnife className="w-4 h-4 text-emerald-600" />
                  Select Indian Meal Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {INDIAN_MEAL_PLANS.map((meal) => {
                    const isSelected = selectedMealPlan === meal.code;
                    return (
                      <div
                        key={meal.code}
                        onClick={() => setSelectedMealPlan(meal.code)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            {meal.code}
                          </span>
                          <p className="font-bold text-xs text-slate-900 mt-1.5">{meal.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{meal.desc}</p>
                        </div>
                        <p className="text-xs font-extrabold text-emerald-700 mt-2">
                          {meal.pricePerPaxDay === 0 ? 'Included' : `+₹${meal.pricePerPaxDay}/day`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons & Local Experiences */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-purple-600" />
                  Curated Indian Add-ons & Local Experiences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INDIAN_ADDON_OPTIONS.map((addon) => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-purple-50/70 border-purple-400 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAddon(addon)}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-900 truncate">{addon.name}</p>
                            <span className="text-[10px] font-semibold text-purple-700 uppercase">{addon.category}</span>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-purple-800 shrink-0">
                          +₹{addon.price.toLocaleString('en-IN')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Commercial Pricing & Rates (INR ₹) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CurrencyInr className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-heading text-sm font-bold text-slate-900">Commercial Rates & Tax Breakdown (₹ INR)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Indian Rupee (INR ₹)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Rate per Adult (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={customAdultRate}
                        onChange={(e) => setCustomAdultRate(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Rate per Child (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={customChildRate}
                        onChange={(e) => setCustomChildRate(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Indian Tour GST %</label>
                    <select
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value={5}>5% (Standard Tour Package GST)</option>
                      <option value={18}>18% (Standalone Activities/Transport)</option>
                      <option value={0}>0% (Exempt / Inclusive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Discount / Rebate (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Promo Code & Payment Terms */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Promo Coupon Code</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. TRIPINDIA26"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Structure</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="FULL_PAY">100% Full Advance Payment</option>
                      <option value="DEPOSIT_20">20% Booking Token Advance (₹{depositAmount.toLocaleString('en-IN')})</option>
                      <option value="HOLD_CARD">Hold with Mandate / Post-Trip</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Indian Payment Channel</label>
                    <select
                      value={paymentChannel}
                      onChange={(e) => setPaymentChannel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                      <option value="NEFT_IMPS">NEFT / IMPS / RTGS Bank Transfer</option>
                      <option value="CARD">Credit / Debit Card (RuPay/Visa/MC)</option>
                      <option value="CASH">Cash at Agency Desk / Cheque</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2 Footer Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Trip Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Indian Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STEP 3: INDIAN GUEST & CUSTOMER DETAILS
             ════════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Lead Traveler & Indian Guest Information</h3>
                  <p className="text-xs text-slate-500">Collect lead guest contact, state/city, Aadhaar/PAN ID proof, co-travelers, and booking status.</p>
                </div>
              </div>

              {/* Lead Traveler Contact */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                  <IdentificationCard className="w-5 h-5 text-blue-600" />
                  Primary Lead Traveler (Adult Head of Pack)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name (as per Govt ID) *</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      <Phone className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                      Indian Mobile Number (+91 WhatsApp) *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+91 98200 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      <Envelope className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="rajesh.sharma@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Indian State, City & PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Indian State of Residence</label>
                    <select
                      value={leadState}
                      onChange={(e) => setLeadState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Town</label>
                    <input
                      type="text"
                      value={leadCity}
                      onChange={(e) => setLeadCity(e.target.value)}
                      placeholder="e.g. Mumbai / Pune / Bengaluru"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Postal PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={leadPinCode}
                      onChange={(e) => setLeadPinCode(e.target.value)}
                      placeholder="e.g. 400001"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Domestic ID Proof & Corporate GST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Domestic ID Proof for Check-in</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={idProofType}
                        onChange={(e) => setIdProofType(e.target.value as any)}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Passport">Indian Passport</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Voter ID">Voter ID Card</option>
                      </select>
                      <input
                        type="text"
                        value={idProofNumber}
                        onChange={(e) => setIdProofNumber(e.target.value)}
                        placeholder="ID / Aadhaar No."
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">B2B / Corporate GSTIN (Optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        maxLength={15}
                        value={gstinNumber}
                        onChange={(e) => setGstinNumber(e.target.value.toUpperCase())}
                        placeholder="15-Digit GSTIN"
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={companyBillingName}
                        onChange={(e) => setCompanyBillingName(e.target.value)}
                        placeholder="Company Name"
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Diet & Co-Travelers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dietary Preference & Requests */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-heading text-xs font-bold text-slate-900">Dietary & Guest Special Requests</h4>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Meal Preference</label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Pure Vegetarian">Pure Vegetarian (No Meat/Fish/Egg)</option>
                      <option value="Jain Meal">Jain Meal (Strict No Onion/Garlic/Root veg)</option>
                      <option value="Non-Vegetarian">Non-Vegetarian (Chicken/Mutton/Fish)</option>
                      <option value="Halal">Halal Certified</option>
                      <option value="South Indian Special">South Indian Traditional</option>
                      <option value="Vegan">Vegan / Plant-Based</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Special Handling / Honeymoon / Senior Notes</label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Ground floor cottage for senior citizen, late checkout request"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Co-Travelers in Pack */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-xs font-bold text-slate-900">Co-Travelers in Pack ({coTravelers.filter(Boolean).length})</h4>
                    <button
                      type="button"
                      onClick={handleAddCoTraveler}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Name</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {coTravelers.map((name, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleUpdateCoTraveler(idx, e.target.value)}
                          placeholder={`Co-Traveler #${idx + 1} Name`}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {coTravelers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCoTraveler(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Internal Admin Audit Remarks */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Reservation Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BookingStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="CONFIRMED">CONFIRMED (Active Booking)</option>
                    <option value="PENDING">PENDING (Deposit / Voucher Awaited)</option>
                    <option value="CANCELLED">CANCELLED (Refund / Inactive)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Admin Internal Audit Remarks</label>
                  <input
                    type="text"
                    value={adminInternalNotes}
                    onChange={(e) => setAdminInternalNotes(e.target.value)}
                    placeholder="e.g. VIP Direct Client booked via Phone Desk • 100% UPI Paid"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 3 Footer Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Pricing & Stay</span>
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5" weight="fill" />
                  <span>Confirm & Save Indian Reservation (₹{totalAmount.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </div>
          )}

        </form>

        {/* ── MODAL FOOTER LIVE INR (₹) PRICE SUMMARY BAR ── */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 border-t border-slate-800 shrink-0 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Adult Base</span>
              <span className="font-extrabold text-white">₹{adultSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {childrenCount > 0 && (
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Child Fare</span>
                <span className="font-extrabold text-white">₹{childSubtotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            {roomUpgradeCost > 0 && (
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Room Upgrade</span>
                <span className="font-extrabold text-white">+₹{roomUpgradeCost.toLocaleString('en-IN')}</span>
              </div>
            )}

            {addonsTotal + mealPlanCost > 0 && (
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Add-ons & Meals</span>
                <span className="font-extrabold text-white">+₹{(addonsTotal + mealPlanCost).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">GST ({gstPercentage}%)</span>
              <span className="font-extrabold text-emerald-400">+₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>

            {discountAmount > 0 && (
              <div>
                <span className="text-[10px] text-rose-300 font-bold uppercase block">Discount</span>
                <span className="font-extrabold text-rose-400">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {paymentMode === 'DEPOSIT_20' ? '20% Token Advance' : 'Total Tour Fare'}
              </span>
              <span className="font-heading text-lg sm:text-xl font-black text-emerald-400">
                ₹{(paymentMode === 'DEPOSIT_20' ? depositAmount : totalAmount).toLocaleString('en-IN')}
                {paymentMode === 'DEPOSIT_20' && (
                  <span className="text-[11px] text-slate-400 font-normal ml-1.5">
                    (Total: ₹{totalAmount.toLocaleString('en-IN')})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
