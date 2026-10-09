import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TravelTimeline } from '../components/TravelTimeline';
import {
  ShieldCheck,
  CurrencyDollar,
  WhatsappLogo,
  DeviceMobile,
  ChartLineUp,
  Globe,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkle,
  SuitcaseRolling,
  Buildings,
  Star,
  Users,
  CaretRight,
  Lock,
  FilePdf,
  Lightning
} from '@phosphor-icons/react';

export const AgencyBenefitsPage: React.FC = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(35000);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === '#how-it-works') {
      requestAnimationFrame(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    window.scrollTo(0, 0);
  }, []);

  // Calculate annual savings
  const traditionalCommission = Math.round(monthlyRevenue * 12 * 0.18); // 18% avg OTA take rate
  const triiplyCost = 0; // $0 for founding year
  const annualSavings = traditionalCommission - triiplyCost;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white relative overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300/80 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <CaretRight size={12} />
            <span className="text-white font-bold">Partner Agency Benefits</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold mb-4 backdrop-blur-md">
              <Sparkle size={14} className="text-amber-400" />
              <span>Founding Partner Program: 100% Free First Year</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Keep 100% of Your Profits.{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Zero OTA Commission.
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Triiply is the purpose-built digital growth platform for travel agencies, DMCs, and tour operators. Publish interactive holiday storefronts, build verified trust, and receive direct inquiries straight to your WhatsApp and email.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/contact#agency-onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-black text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Apply for Partner Onboarding</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                to="/agencies"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm text-center backdrop-blur-md transition-all"
              >
                Explore Partner Directory
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 6 Core Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered to Solve the Biggest Pain Points in Travel
          </h2>
          <p className="mt-3 text-sm text-slate-600 font-medium">
            Traditional OTAs squeeze your margins with 15–25% commissions, while sending raw PDF quotes on WhatsApp loses clients. Here is how Triiply supercharges your business:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all shadow-sm group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <CurrencyDollar size={28} weight="duotone" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              0% Platform Commission
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Never surrender 15–25% of your trip margins to aggregators. 100% of all client inquiries and booking payments belong entirely to your agency.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all shadow-sm group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} weight="duotone" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              Blue Shield Trust Verification
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Showcase your commercial tourism license, physical address, and authenticated reviews. Travelers wire high-value payments with complete peace of mind.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all shadow-sm group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <DeviceMobile size={28} weight="duotone" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              Interactive Web Package Links
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Stop sending 10MB PDF attachments that clients never open. Share interactive mobile-friendly web links with photo galleries, day-wise itineraries, and maps.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all shadow-sm group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <WhatsappLogo size={28} weight="duotone" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              Direct WhatsApp Lead Delivery
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Inquiries route directly to your designated agent WhatsApp number and team email instantly so you can close sales in minutes without middleman delays.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all shadow-sm group">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-transform">
              <SuitcaseRolling size={28} weight="duotone" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              Automated Booking & Vouchers
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Give your clients an interactive checkout wizard with dynamic add-ons, room tier upgrades, coupon codes, and one-click printable PDF travel vouchers.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all shadow-sm group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
              <ChartLineUp size={28} weight="duotone" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              Global Google SEO Indexing
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Every package and agency storefront you publish is pre-indexed on Google search with structured schema markup, attracting high-intent traveler traffic.
            </p>
          </div>

        </div>

      </div>

      {/* Interactive ROI & Savings Calculator */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-bold mb-3">
              <CurrencyDollar size={14} weight="bold" />
              <span>Revenue & Profit Retention Calculator</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-white">
              See How Much You Save on Triiply
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium">
              Adjust your monthly holiday sales volume to calculate annual commission leakage vs 0% on Triiply.
            </p>
          </div>

          {/* Slider Input */}
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-slate-300">Monthly Package Booking Volume:</span>
              <span className="text-sky-400 font-black text-lg">₹{monthlyRevenue.toLocaleString()} / mo</span>
            </div>

            <input
              type="range"
              min={10000}
              max={200000}
              step={5000}
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-bold">
              <span>₹10,000 / mo</span>
              <span>₹100,000 / mo</span>
              <span>₹200,000 / mo</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-slate-800">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                Typical 18% OTA Commission Paid Annually
              </div>
              <div className="text-3xl sm:text-4xl font-black text-rose-400">
                -₹{traditionalCommission.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Lost to marketplace intermediaries every year</p>
            </div>

            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/30 text-center">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Annual Commission Saved on Triiply
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                +₹{annualSavings.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-300 mt-2 font-medium">100% retained inside your travel agency profits</p>
            </div>
          </div>

        </div>
      </div>

      {/* Comparison Table: Triiply vs Old Way */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Modern Travel Companies Are Switching to Triiply
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4 sm:p-5">Platform Feature</th>
                  <th className="p-4 sm:p-5 text-blue-600 bg-blue-50/50">Triiply Ecosystem</th>
                  <th className="p-4 sm:p-5 text-slate-500">Traditional OTAs</th>
                  <th className="p-4 sm:p-5 text-slate-500">WhatsApp PDF Quotes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Booking Commission</td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-extrabold bg-blue-50/20">0% Commission</td>
                  <td className="p-4 sm:p-5 text-rose-600">15% - 25% Cut</td>
                  <td className="p-4 sm:p-5">0% (Manual Wire)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Lead Contact Ownership</td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-extrabold bg-blue-50/20">Direct WhatsApp & Email</td>
                  <td className="p-4 sm:p-5 text-rose-600">Masked Phone & Relays</td>
                  <td className="p-4 sm:p-5 text-emerald-600">Direct WhatsApp</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Verified License Trust Badge</td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-extrabold bg-blue-50/20">Blue Shield Verified</td>
                  <td className="p-4 sm:p-5 text-slate-400">OTA Brand Shield Only</td>
                  <td className="p-4 sm:p-5 text-rose-600">No Trust Proof</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Client Quote Presentation</td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-extrabold bg-blue-50/20">Interactive Mobile Web Link</td>
                  <td className="p-4 sm:p-5 text-slate-500">Standard Grid View</td>
                  <td className="p-4 sm:p-5 text-rose-600">Heavy PDF Attachment</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Voucher Generator & Add-ons</td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-extrabold bg-blue-50/20">Instant Printable PDF & Barcode</td>
                  <td className="p-4 sm:p-5 text-slate-500">Generic OTA Voucher</td>
                  <td className="p-4 sm:p-5 text-rose-600">Manual Word / PDF Typing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-20">
        <TravelTimeline onOpenRegister={() => navigate('/contact#agency-onboarding')} />
      </div>

      {/* Onboarding Call to Action */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl">
          <h3 className="font-heading text-3xl sm:text-4xl font-black text-white">
            Ready to Upgrade Your Agency's Sales Infrastructure?
          </h3>
          <p className="mt-3 text-sm text-sky-100 font-medium max-w-xl mx-auto">
            Get your agency verified, publish unlimited holiday packages, and start receiving direct customer bookings today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact#agency-onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm shadow-xl transition-all"
            >
              Start Onboarding ($0 First Year)
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all"
            >
              Sign In to Agency Portal
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
