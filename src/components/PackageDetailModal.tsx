import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelPackage } from '../types';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Check, 
  Buildings, 
  PaperPlaneTilt, 
  Calendar, 
  User, 
  Envelope, 
  Phone, 
  CheckCircle, 
  FileText, 
  WarningCircle, 
  Tag, 
  CaretDown, 
  CaretUp,
  ArrowRight,
  SuitcaseRolling
} from '@phosphor-icons/react';

import { addInquiry } from '../data/mockData';
import { api } from '../services/api';

interface PackageDetailModalProps {
  packageData: TravelPackage | null;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ packageData, onClose, onOpenRegister }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions' | 'policies'>('overview');

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const [inquiryData, setInquiryData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    paxCount: '2 Travelers',
    notes: ''
  });

  if (!packageData) return null;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    
    const newInq = {
      id: `inq-${Date.now()}`,
      agencyId: packageData.agencyId || 'ag-1',
      packageName: packageData.title,
      travelerName: inquiryData.fullName,
      travelerEmail: inquiryData.email,
      travelerPhone: inquiryData.phone,
      travelDate: inquiryData.travelDate,
      travelersCount: parseInt(inquiryData.paxCount) || 2,
      message: inquiryData.notes || 'Inquiry from Triiply Package Modal',
      status: 'New' as const,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await api.createInquiry(newInq);
      addInquiry(response.inquiry);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetInquiry = () => {
    setSubmitted(false);
    setShowInquiryForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden relative text-slate-900 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors z-10 cursor-pointer"
          aria-label="Close package details modal"
        >
          <X size={20} />
        </button>

        {/* Top Image Header */}
        <div className="h-52 sm:h-60 relative overflow-hidden shrink-0">
          <img
            src={packageData.imageUrl}
            alt={packageData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-sky-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                {packageData.theme || packageData.category}
              </span>
              <span className="text-xs text-sky-300 font-semibold flex items-center gap-1">
                <MapPin size={14} />
                {packageData.destination}
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <Clock size={14} />
                {packageData.duration}
              </span>
            </div>
            <h3 className="font-heading text-lg sm:text-2xl font-bold leading-tight">{packageData.title}</h3>
          </div>
        </div>

        {/* Nav Tabs Bar */}
        {!showInquiryForm && !submitted && (
          <div className="bg-slate-100 border-b border-slate-200 px-6 pt-2 flex gap-2 overflow-x-auto shrink-0">
            {[
              { id: 'overview', label: 'Overview & Highlights' },
              { id: 'itinerary', label: `Day Itinerary (${packageData.itinerary?.length || packageData.days || 5} Days)` },
              { id: 'inclusions', label: 'Inclusions & Exclusions' },
              { id: 'policies', label: 'Booking Policies' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3.5 font-bold text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Body Content (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {submitted ? (
            /* Success Confirmation View */
            <div className="text-center space-y-4 py-8 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle size={40} weight="fill" />
              </div>

              <h4 className="font-heading text-2xl font-bold text-slate-900">
                Package Inquiry Submitted!
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you <strong>{inquiryData.fullName || 'Traveler'}</strong>. Your inquiry for <strong>{packageData.title}</strong> has been sent directly to <strong>{packageData.agencyName}</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Package:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{packageData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Assigned Partner:</span>
                  <span className="font-bold text-slate-900">{packageData.agencyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Contact Email:</span>
                  <span className="font-bold text-slate-900">{inquiryData.email || 'Submitted'}</span>
                </div>
              </div>

              <button
                onClick={handleResetInquiry}
                className="w-full max-w-md py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Close & Return to Packages
              </button>
            </div>
          ) : showInquiryForm ? (
            /* Direct Inquiry Form */
            <form onSubmit={handleSubmitInquiry} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Direct Package Lead / Inquiry Form</h4>
                  <p className="text-xs text-slate-500">Send an inquiry directly to {packageData.agencyName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  View Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={inquiryData.fullName}
                    onChange={(e) => setInquiryData({ ...inquiryData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 555 019 2831"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Travel Date</label>
                  <input
                    type="date"
                    value={inquiryData.travelDate}
                    onChange={(e) => setInquiryData({ ...inquiryData, travelDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Travellers</label>
                  <select
                    value={inquiryData.paxCount}
                    onChange={(e) => setInquiryData({ ...inquiryData, paxCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="1 Traveler">1 Solo Traveler</option>
                    <option value="2 Travelers">2 Travelers (Couple)</option>
                    <option value="3-5 Travelers">3-5 Family Group</option>
                    <option value="6+ Group">6+ Group / Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Requests / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Seeking luxury 5-star resort options or custom meal plans..."
                  value={inquiryData.notes}
                  onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                  <span>{submitting ? 'Submitting…' : 'Submit Inquiry Form'}</span>
                </button>
              </div>
              {submitError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">{submitError}</p>}
            </form>
          ) : (
            /* TABBED DETAILS VIEW */
            <>
              {/* TAB 1: OVERVIEW & HIGHLIGHTS */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Agency Provider Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={packageData.agencyLogo}
                        alt={packageData.agencyName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-300"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {packageData.agencyName}
                          {packageData.agencyVerified && (
                            <InstagramVerifiedBadge size={16} title="Verified Partner Agency" />
                          )}
                        </p>
                        <p className="text-xs text-slate-500">{packageData.agencyType} Partner • 100% Direct Leads</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                      Blue Shield Verified
                    </span>
                  </div>

                  {/* Overview text if present */}
                  {packageData.overview && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Overview:
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs sm:text-sm font-normal">
                        {packageData.overview}
                      </p>
                    </div>
                  )}

                  {/* Key Highlights */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Package Key Highlights:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {packageData.highlights.map((h, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium flex items-center gap-2">
                          <Check size={16} weight="bold" className="text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Travel Logistics pill summary */}
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Hotel Standard</p>
                      <p className="font-bold text-slate-800">{packageData.hotelCategory || '5-Star Luxury'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Meal Plan</p>
                      <p className="font-bold text-slate-800">{packageData.mealPlan || 'Daily Breakfast (CP)'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Transit</p>
                      <p className="font-bold text-slate-800">{packageData.transportType || 'Private AC Vehicle'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Season</p>
                      <p className="font-bold text-slate-800">{packageData.season || 'Year Round'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DAY-WISE ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  {packageData.itinerary && packageData.itinerary.length > 0 ? (
                    packageData.itinerary.map((d) => {
                      const isExpanded = expandedDay === d.dayNumber;

                      return (
                        <div key={d.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/60">
                          <button
                            type="button"
                            onClick={() => setExpandedDay(isExpanded ? null : d.dayNumber)}
                            className="w-full p-3.5 text-left flex items-center justify-between font-bold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                                {d.dayNumber}
                              </span>
                              <span className="text-xs sm:text-sm">{d.title}</span>
                            </div>
                            {isExpanded ? <CaretUp size={16} className="text-slate-400" /> : <CaretDown size={16} className="text-slate-400" />}
                          </button>

                          {isExpanded && (
                            <div className="p-4 pt-0 space-y-2 border-t border-slate-200/60 bg-white text-xs">
                              <p className="text-slate-600 leading-relaxed pt-2">{d.description}</p>
                              
                              {d.activities && d.activities.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {d.activities.map((act, idx) => (
                                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                      • {act}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                                {d.meals && d.meals.length > 0 && <span><strong>Meals:</strong> {d.meals.join(', ')}</span>}
                                {d.accommodation && <span><strong>Stay:</strong> {d.accommodation}</span>}
                                {d.transportation && <span><strong>Transit:</strong> {d.transportation}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-slate-500">
                      Full itinerary details available upon direct quotation with {packageData.agencyName}.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
              {activeTab === 'inclusions' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2">
                      <p className="font-bold text-emerald-950 text-xs uppercase tracking-wider">Inclusions (What’s Covered)</p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {(packageData.inclusions || packageData.included || []).map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check size={16} weight="bold" className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 space-y-2">
                      <p className="font-bold text-rose-950 text-xs uppercase tracking-wider">Exclusions (Out of Pocket)</p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {(packageData.exclusions || [
                          'International air tickets & visas',
                          'Personal travel insurance',
                          'Optional add-on excursions',
                          'Gratuities & tips'
                        ]).map((exc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <X size={16} weight="bold" className="text-rose-600 shrink-0 mt-0.5" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Optional Add-ons if present */}
                  {packageData.addons && packageData.addons.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <p className="font-bold text-slate-900 text-xs">Optional Experience Add-ons</p>
                      <div className="space-y-2">
                        {packageData.addons.map((ad) => (
                          <div key={ad.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-800">{ad.name}</p>
                              <p className="text-[10px] text-slate-500">{ad.description}</p>
                            </div>
                            <span className="font-bold text-blue-700 text-xs">
                              + ${ad.price} / pax
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: BOOKING POLICIES */}
              {activeTab === 'policies' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Cancellation Policy</h5>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {packageData.cancellationPolicy || 'Free cancellation up to 7 days before departure. 50% fee within 3-6 days. Non-refundable under 48 hours.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Payment Terms</h5>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {packageData.paymentPolicy || '30% advance deposit upon confirmation. 70% balance due 14 days before guest arrival.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Important Notes</h5>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {packageData.importantNotes || 'Valid international passport with minimum 6 months validity required. Tourism tax payable on arrival.'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer CTA */}
        {!submitted && !showInquiryForm && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated B2B Rate</p>
              <p className="text-sm sm:text-base font-extrabold text-blue-700">{packageData.priceEstimate}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/holiday-packages?packageId=${packageData.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <SuitcaseRolling size={16} weight="bold" />
                <span>Book This Trip</span>
              </button>

              <button
                onClick={() => setShowInquiryForm(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PaperPlaneTilt size={16} />
                <span>Send Inquiry</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
