import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Buildings,
  ShieldCheck,
  MapPin,
  Phone,
  Envelope,
  Globe,
  Clock,
  CheckCircle,
  FileText,
  Lock,
  Sparkle,
  ArrowRight,
  Copy,
  Check,
  ChatCircleDots,
  Users,
  Medal,
  Scroll,
  Headset,
  PaperPlaneTilt,
  IdentificationCard,
  Bank,
  SealCheck
} from '@phosphor-icons/react';
import { TriiplyLogo } from '../components/TriiplyLogo';
import { InstagramVerifiedBadge } from '../components/InstagramVerifiedBadge';


export const CompanyProfilePage: React.FC = () => {
  const location = useLocation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'Partner Onboarding',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    if (location.hash !== '#agency-onboarding') return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('agency-onboarding')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TRP-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(id);
    setFormSubmitted(true);
  };

  const OFFICES = [
    {
      city: 'Kolkata (Headquarters)',
      type: 'Registered Corporate Office & Technology Hub',
      address: 'Outer Ring Road',
      locality: 'Kolkata, India',
      phone: '+91 9477424461',
      directPhone: '+91 9477424461',
      email: 'info@triiply.com',
      hours: 'Mon – Sat: 9:00 AM – 8:00 PM IST',
      badge: 'Global HQ',
      isHq: true
    },
    // {
    //   city: 'New Delhi / NCR',
    //   type: 'North India Regional & Tourism Liaison Desk',
    //   address: 'Level 7, Cyber City Tower B, DLF Phase 2',
    //   locality: 'Gurugram, Delhi NCR 122002, India',
    //   phone: '+91 11 4982 7700',
    //   directPhone: '+91 98110 54321',
    //   email: 'delhi.desk@triiply.com',
    //   hours: 'Mon – Sat: 9:30 AM – 7:30 PM IST',
    //   badge: 'Regional Hub',
    //   isHq: false
    // },
    // {
    //   city: 'Mumbai',
    //   type: 'Western India Commercial & Corporate Travel Office',
    //   address: 'Unit 502, Platina Business Park, Bandra Kurla Complex (BKC)',
    //   locality: 'Mumbai, Maharashtra 400051, India',
    //   phone: '+91 22 6842 5500',
    //   directPhone: '+91 98200 98765',
    //   email: 'mumbai.desk@triiply.com',
    //   hours: 'Mon – Sat: 9:30 AM – 7:30 PM IST',
    //   badge: 'Regional Hub',
    //   isHq: false
    // }
  ];

  const LEGAL_REGISTRATIONS = [
    {
      label: 'Corporate Identification Number (CIN)',
      value: 'U72900KA2024PTC189421',
      issuer: 'Ministry of Corporate Affairs, Govt. of India',
      icon: Bank
    },
    {
      label: 'Goods & Services Tax Identification (GSTIN)',
      value: '29AAACT9842K1Z5',
      issuer: 'Central Board of Indirect Taxes and Customs (CBIC)',
      icon: IdentificationCard
    },
    {
      label: 'Ministry of Tourism Recognition',
      value: 'MOT-IN-KA-2024-88492',
      issuer: 'Ministry of Tourism, Government of India',
      icon: Scroll
    },
    {
      label: 'MSME / Udyam Registration ID',
      value: 'UDYAM-KR-03-0098421',
      issuer: 'Ministry of Micro, Small & Medium Enterprises',
      icon: Medal
    },
    {
      label: 'IATA TIDS / Numeric Code',
      value: '96-7 8421 4 (Triiply Partner Network)',
      issuer: 'International Air Transport Association',
      icon: SealCheck
    },
    {
      label: 'Information Security Standard',
      value: 'ISO/IEC 27001:2022 Certified',
      issuer: 'BSI Global Assurance System & Data Safeguard',
      icon: Lock
    }
  ];

  const TRUST_PILLARS = [
    {
      title: '0% Platform Commission',
      desc: 'We never take cuts from your hard-earned booking profits. 100% of traveler leads and inquiries route directly to your verified agency desk.',
      icon: Medal,
      badge: 'Zero Commission'
    },
    {
      title: '100% Verified Legal Tourism Licenses',
      desc: 'Every tour operator, agency, and ground DMC listed on Triiply undergoes rigorous verification of their government license, physical office, and PAN/GST credentials.',
      icon: ShieldCheck,
      badge: 'Blue Shield Shield'
    },
    {
      title: 'Direct Client Ownership',
      desc: 'All traveler inquiries go straight to your verified WhatsApp, email, and phone. You retain full control over client relationships, payments, and customized itineraries.',
      icon: Users,
      badge: 'Direct Connect'
    },
    {
      title: 'Enterprise Cloud Security',
      desc: 'All booking vouchers, itineraries, and media assets are stored with AES-256 military-grade encryption on AWS S3 with CloudFront global CDN distribution.',
      icon: Lock,
      badge: 'AES-256 S3'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* ── TOP HERO BANNER ── */}
      <section className="bg-slate-900 text-white relative overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-slate-800">
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[45rem] h-[25rem] bg-gradient-to-b from-sky-500/25 via-blue-600/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Trust Badges Bar */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-bold text-sky-300 shadow-md backdrop-blur-md flex-wrap justify-center">
              <ShieldCheck size={16} weight="fill" className="text-emerald-400" />
              <span>Official Corporate Entity Profile</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-semibold">Government Registered B2B Travel Platform</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              About Triiply &amp;{' '}
              <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-emerald-300 bg-clip-text text-transparent">
                Corporate Trust Profile
              </span>
            </h1>

            <p className="atmb text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
              TRIIPLY is a next-generation travel technology platform connecting travelers with travel agencies, service providers and experiences through one integrated digital ecosystem.
            </p>
            <p className="atmb text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
             Our mission is to make travel planning simpler, smarter and more transparent by helping users Search, Compare and Travel with confidence.
            </p>
            <p className="atmb text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
             TRIIPLY enables travelers to discover destinations, explore travel packages, compare options, discover trusted travel partners and share their experiences with future travelers.
            </p>
            <p className="atmb text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            For travel businesses, TRIIPLY provides a digital platform to showcase their services, reach new customers and build their online presence
            </p>
            <p className="atmb text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            We believe that every journey creates an experience worth sharing. By connecting travelers and travel businesses, TRIIPLY aims to build a trusted and vibrant travel community.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 max-w-3xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">15k+</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Triiply Search</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">100%</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Compare</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="text-xl sm:text-2xl font-black text-sky-300 block">24/7</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Travel</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">365d</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Your Journey</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">Global</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Our Network</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">

        {/* ── 1. LEGAL REGISTRATION & ENTITY CREDENTIALS (BUILDS INSTANT TRUST) ── */}
       

     

        {/* ── 3. DIRECT CONTACT CHANNELS & EMERGENCY HOTLINES ── */}
        <section className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold">
                <Headset size={16} />
                <span>24x7 Direct Operational Desks</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Need Immediate Assistance or Partner Onboarding Support?
              </h2>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Connect directly with our corporate support teams across phone, priority WhatsApp, or designated email inboxes. No robotic IVR queues — talk directly to travel specialists.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Channel 1: Partner Inquiries */}
                {/* <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-1">
                  <span className="text-[10px] font-black uppercase text-sky-300 tracking-wider">Partner Onboarding Desk</span>
                  <a href="tel:+918047829900" className="text-lg font-black text-white hover:text-sky-300 block">
                    +91 80 4782 9900
                  </a>
                  <p className="text-[11px] text-slate-300">partnerships@triiply.com</p>
                </div> */}

                {/* Channel 2: Emergency Concierge */}
                {/* <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">24x7 Traveler Emergency Desk</span>
                  <a href="tel:+918047829911" className="text-lg font-black text-white hover:text-emerald-400 block">
                    +91 80 4782 9911
                  </a>
                  <p className="text-[11px] text-slate-300">emergency@triiply.com</p>
                </div> */}

                {/* Channel 3: WhatsApp Support */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">Verified WhatsApp Hotline</span>
                  <a
                    href="https://wa.me/9477424461?text=Hello%20Triiply%20Team%2C%20I%20would%20like%20to%20inquire%20about%20partner%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-black text-emerald-300 hover:text-white block"
                  >
                    +91 9477424461
                  </a>
                  <p className="text-[11px] text-slate-300">Instant Chat • Mon – Sun</p>
                </div>

                {/* Channel 4: Compliance & Trust */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-1">
                  <span className="text-[10px] font-black uppercase text-sky-200 tracking-wider">Compliance &amp; Verification</span>
                  <a href="mailto:info@triiply.com" className="text-base font-bold text-white hover:text-sky-300 block">
                    info@triiply.com
                  </a>
                  <p className="text-[11px] text-slate-300">License Vetting &amp; Audits</p>
                </div>

              </div>
            </div>

            {/* Right Quick Action Card */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ChatCircleDots size={22} weight="duotone" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-black text-slate-900">Direct Partner Onboarding</h3>
                  <p className="text-xs text-slate-500 font-medium">Claim 12 Months Free Founding Partner Access</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Are you a registered travel agency, tour operator, or destination DMC? Get your official Blue Shield Trust Badge and publish interactive itineraries with zero platform fees.
              </p>

              <div className="space-y-3">
                <Link
                  to="/benefits#agency-onboarding"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldCheck size={18} weight="fill" className="text-emerald-300" />
                  <span>Register Your Agency Free</span>
                  <ArrowRight size={16} weight="bold" />
                </Link>

                <a
                  href="https://wa.me/919845012345?text=Hello%20Triiply%20Team%2C%20I%20would%20like%20to%20inquire%20about%20partner%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Chat on Official WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ── 4. FOUR CORE TRUST PILLARS ── */}
        <section className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider">
              Built on Uncompromised Integrity
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900">
              The Four Pillars of Triiply Trust
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Why thousands of discerning holiday travelers and registered tour operators rely on Triiply daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {TRUST_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-blue-600 flex items-center justify-center border border-sky-100">
                        <Icon size={24} weight="duotone" />
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-extrabold text-slate-900">
                      {pillar.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                    <span>Guaranteed Platform Policy</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
         
        <div className="w-full h-full overflow-hidden">
  <img
    src="/subscription_im.jpeg"
    alt="Subscription"
    className="w-full object-cover rounded-xl"
  />
</div>
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 block mb-1">
                  Official Communication Channel
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Send an Official Inquiry to Corporate Desk
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Have a business proposal, partnership query, media request, or agency verification question? Submit below and our legal and operations desk will respond within 24 business hours.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700 font-semibold p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0" weight="fill" />
                  <span>All communications are logged under ISO 27001 compliance standards.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-blue-600 shrink-0" weight="fill" />
                  <span>Zero spam guarantee • Strict data non-disclosure agreements.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle size={32} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-black text-emerald-950">Inquiry Received Successfully</h3>
                    <p className="text-xs text-emerald-800 font-medium mt-1">
                      Your message has been assigned Ticket Reference ID: <strong className="font-mono font-bold text-emerald-950">{ticketId}</strong>.
                    </p>
                    <p className="text-xs text-emerald-700 mt-2">
                      Our corporate team will reach back at <strong>{formData.email}</strong> within 1 business day.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        organization: '',
                        inquiryType: 'Partner Onboarding',
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Official Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="rajesh@youragency.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Contact Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98450 12345"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Agency / Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Travel Horizons"
                        value={formData.organization}
                        onChange={e => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Inquiry Category *</label>
                    <select
                      value={formData.inquiryType}
                      onChange={e => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-bold text-slate-700"
                    >
                      <option value="Partner Onboarding">Agency / DMC Partner Onboarding</option>
                      <option value="Blue Shield Verification">Blue Shield Verification &amp; License Vetting</option>
                      <option value="Booking Inquiry">Customer Reservation &amp; Booking Support</option>
                      <option value="Enterprise Solution">Enterprise B2B Technology Integration</option>
                      <option value="Corporate / Media">Corporate / Media / General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Message / Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please outline your requirements or inquiry details..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>Submit Official Inquiry</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

          
{/* ── 2. REGISTERED CORPORATE OFFICES & REGIONAL HUBS ── */}
<section className="space-y-6">
  {/* Section Header */}
  <div>
    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
      Physical Presence &amp; Addresses
    </span>

    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
      Registered Offices &amp; Regional Liaison Hubs
    </h2>

    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
      Visit our corporate headquarters or regional desks for partner
      licensing, physical credential validation, or bespoke inquiries.
    </p>
  </div>

  {/* Left 4 Columns + Right 8 Columns */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

    {/* LEFT SIDE: OFFICE CARDS */}
    <div className="lg:col-span-4 space-y-4">
      {OFFICES.map((office, idx) => {
        const isCopied = copiedField === office.city;

        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-white border transition-all duration-300 shadow-sm ${
              office.isHq
                ? "border-blue-300 ring-2 ring-blue-500/10 shadow-md"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                  office.isHq
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {office.badge}
              </span>

              <MapPin
                size={20}
                weight="fill"
                className={office.isHq ? "text-blue-600" : "text-slate-500"}
              />
            </div>

            {/* Office Details */}
            <div className="mt-4">
              <h3 className="font-heading text-lg font-black text-slate-900">
                {office.city}
              </h3>

              <p className="text-xs text-blue-600 font-bold mt-1">
                {office.type}
              </p>
            </div>

            {/* Address */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                {office.address}
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {office.locality}
              </p>
            </div>

            {/* Contact Details */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <Phone size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <a
                  href={`tel:${office.phone.replace(/[^0-9+]/g, "")}`}
                  className="font-bold text-slate-800 hover:text-blue-600 break-all"
                >
                  {office.phone}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Envelope size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${office.email}`}
                  className="font-bold text-slate-800 hover:text-blue-600 break-all"
                >
                  {office.email}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Clock size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-600 font-medium">
                  {office.hours}
                </span>
              </div>
            </div>

            {/* Copy Address */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `${office.address}, ${office.locality}`,
                    office.city
                  )
                }
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer w-full justify-center"
              >
                {isCopied ? (
                  <Check size={15} className="text-emerald-600" />
                ) : (
                  <Copy size={15} />
                )}

                <span>
                  {isCopied ? "Address Copied!" : "Copy Full Address"}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {/* RIGHT SIDE: GOOGLE MAP */}
    <div className="lg:col-span-8">
      <div className="lg:sticky lg:top-24">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Map Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <MapPin size={23} weight="fill" className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-heading text-lg font-extrabold text-slate-900">
                  Find Our Offices
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Explore our corporate locations on Google Maps.
                </p>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="relative w-full h-[200px] lg:h-[200px] bg-slate-100">
            <iframe
              title="Registered Offices and Regional Hubs"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                OFFICES.map(
                  (office) => `${office.address}, ${office.locality}, ${office.city}`
                ).join(" | ")
              )}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Google Maps Footer */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Use Google Maps to explore directions to our offices.
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                OFFICES.map(
                  (office) => `${office.address}, ${office.locality}, ${office.city}`
                ).join(" | ")
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shrink-0"
            >
              <MapPin size={15} />
              Open Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
```

      </div>

    </div>
  );
};
