import React, { useState } from 'react';
import {
  SquaresFour,
  SuitcaseRolling,
  Heart,
  ChatCircle,
  CreditCard,
  Gear,
  SignOut,
  MagnifyingGlass,
  Bell,
  CaretRight,
  CaretLeft,
  ShieldCheck,
  Sparkle,
  MapPin,
  Calendar as CalendarIcon,
  Plus,
  Tag
} from '@phosphor-icons/react';
import { TriiplyLogo } from './TriiplyLogo';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';

interface DashboardPreviewProps {
  onOpenRegister: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ onOpenRegister }) => {
  const [activeNav, setActiveNav] = useState<string>('Dashboard');
  const [activeCategory, setActiveCategory] = useState<string>('Most Popular');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <section id="dashboard-preview" className="py-16 lg:py-24 bg-slate-100 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Sleek, Modern Agency Portal
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Manage your verified holiday packages, monitor incoming traveler leads, and track date bookings in one powerful light-mode portal.
          </p>
        </div>

        {/* DASHBOARD SHELL CONTAINER (Clean Light Theme matching user image) */}
        <div className="bg-slate-900/90 rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-300 max-w-6xl mx-auto overflow-hidden">

          {/* Main Dashboard Canvas (White / Light Slate) */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-inner grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">

            {/* 1. LEFT SIDEBAR (Dark Charcoal / Slate 900 panel as in reference image) */}
            <div className="lg:col-span-3 bg-slate-900 text-white p-5 flex flex-col justify-between border-r border-slate-800">

              <div className="space-y-6">
                {/* Brand Logo Top */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <TriiplyLogo className="h-7" variant="white" showTagline={false} />
                  <span className="text-[10px] font-bold bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                    B2B Pro
                  </span>
                </div>

                {/* Navigation Menu Links */}
                <nav className="space-y-1.5 text-xs font-semibold">
                  {[
                    { name: 'Dashboard', icon: SquaresFour },
                    { name: 'My Packages', icon: SuitcaseRolling },
                    { name: 'Favorites', icon: Heart },
                    { name: 'Inquiries', icon: ChatCircle, badge: '12' },
                    { name: 'Transactions', icon: CreditCard },
                    { name: 'Settings', icon: Gear },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.name;

                    return (
                      <button
                        key={item.name}
                        onClick={() => setActiveNav(item.name)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${isActive
                          ? 'bg-white text-slate-950 font-bold shadow-md'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} weight={isActive ? "fill" : "regular"} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                          <span>{item.name}</span>
                        </div>

                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-600 text-white' : 'bg-lime-400 text-slate-950'
                            }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Logout Button */}
              <div className="pt-4">
                <button
                  onClick={onOpenRegister}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <SignOut size={18} />
                  <span>Logout</span>
                </button>
              </div>

            </div>

            {/* 2. CENTER MAIN DASHBOARD PANEL (White background matching reference screenshot) */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 space-y-6 overflow-y-auto">

              {/* Top Header Bar: Search Input, Bell, Profile */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Search Box */}
                <div className="relative flex-1 w-full flex items-center">
                  <div className="relative flex-1">
                    <MagnifyingGlass size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search for your favorite destination..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-100 text-xs font-medium text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="ml-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow transition-colors cursor-pointer">
                    Search
                  </button>
                </div>

                {/* Bell & User Profile */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer" aria-label="Notifications">
                    <Bell size={18} />
                    <span className="w-2 h-2 rounded-full bg-lime-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
                  </button>

                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Avatar"
                      className="w-8 h-8 rounded-xl object-cover border border-slate-300 shadow-sm"
                    />
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-extrabold text-slate-900 leading-tight flex items-center gap-1">
                        <span>Apex Travel</span>
                        <InstagramVerifiedBadge size={13} title="Verified Partner Agency" />
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold">Verified Partner</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Greeting Header */}
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Hello Apex Travel!</span>
                  <InstagramVerifiedBadge size={20} title="Verified Partner Agency" />
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Welcome back and explore direct traveler inquiries worldwide.
                </p>
              </div>

              {/* Section 1: "Easy Visa Destinations" Horizontal Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-sm font-bold text-slate-900">
                    Easy Visa Destinations
                  </h4>
                  <a href="#destinations" className="text-xs font-bold text-lime-600 hover:text-lime-700">
                    View All
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {/* Bali Card */}
                  <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-md group hover:scale-[1.02] transition-transform">
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80"
                        alt="Bali"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-lime-300 text-[10px] font-bold">
                        Top Seller
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="font-bold text-xs text-white">Bali, Indonesia</h5>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-slate-400">Starting at</span>
                        <span className="font-extrabold text-lime-400">₹ 19,800</span>
                      </div>
                    </div>
                  </div>

                  {/* Dubai Card */}
                  <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-md group hover:scale-[1.02] transition-transform">
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80"
                        alt="Dubai"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-bold text-xs text-white">Dubai, UAE</h5>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-slate-400">Starting at</span>
                        <span className="font-extrabold text-lime-400">₹ 21,700</span>
                      </div>
                    </div>
                  </div>

                  {/* Maldives Card */}
                  <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-md group hover:scale-[1.02] transition-transform">
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=300&q=80"
                        alt="Maldives"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-bold text-xs text-white">Maldives Islands</h5>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-slate-400">Starting at</span>
                        <span className="font-extrabold text-lime-400">₹ 11,300</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 2: Category Filter Tabs */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-2 text-xs font-bold text-slate-500">
                  {['Most Popular', 'Special Offers', 'Near Me'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`pb-2 transition-colors relative cursor-pointer ${activeCategory === cat
                        ? 'text-slate-900 font-extrabold border-b-2 border-slate-900'
                        : 'hover:text-slate-900'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 2x2 Grid of Packages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Kerala */}
                  <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3 shadow hover:shadow-md transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=150&q=80"
                      alt="Kerala"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-white truncate">Kerala Backwaters</h5>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-lime-400" /> India
                      </p>
                      <p className="text-xs font-extrabold text-lime-400 mt-1">₹ 248 / day</p>
                    </div>
                  </div>

                  {/* Sukhotai */}
                  <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3 shadow hover:shadow-md transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=150&q=80"
                      alt="Sukhothai"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-white truncate">Sukhothai Old City</h5>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-lime-400" /> Thailand
                      </p>
                      <p className="text-xs font-extrabold text-lime-400 mt-1">₹ 248 / day</p>
                    </div>
                  </div>

                  {/* Eiffel Tower */}
                  <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3 shadow hover:shadow-md transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80"
                      alt="Eiffel Tower"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-white truncate">Eiffel Tower Tour</h5>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-lime-400" /> Paris
                      </p>
                      <p className="text-xs font-extrabold text-lime-400 mt-1">₹ 320 / day</p>
                    </div>
                  </div>

                  {/* Kashmir */}
                  <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3 shadow hover:shadow-md transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=150&q=80"
                      alt="Kashmir"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-white truncate">Kashmir Valleys</h5>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-lime-400" /> India
                      </p>
                      <p className="text-xs font-extrabold text-lime-400 mt-1">₹ 248 / day</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* 3. RIGHT SIDEBAR PANEL (Matching calendar & bookings widget in screenshot) */}
            <div className="lg:col-span-3 bg-slate-900 text-white p-5 border-l border-slate-800 space-y-6">

              {/* Mini Calendar Widget */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>SEPTEMBER 2026</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <CaretLeft size={14} className="hover:text-white cursor-pointer" />
                    <CaretRight size={14} className="hover:text-white cursor-pointer" />
                  </div>
                </div>

                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-slate-500 text-center">
                  <span>SUN</span>
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-300 font-medium">
                  {[...Array(30)].map((_, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = dayNum === 14 || dayNum === 17;
                    return (
                      <div
                        key={dayNum}
                        className={`py-1 rounded-lg text-[11px] font-bold ${isSelected
                          ? 'bg-lime-400 text-slate-950 shadow'
                          : 'hover:bg-slate-800 text-slate-300'
                          }`}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bookings / Recent Inquiries List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-bold text-white">
                    Bookings & Leads
                  </h4>
                  <span className="text-[11px] text-lime-400 font-bold hover:underline cursor-pointer">
                    View All
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">2026</p>

                <div className="space-y-2">
                  {/* Goa */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=100&q=80"
                        alt="Goa"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">Goa Express</p>
                        <p className="text-[10px] text-slate-400">18 Apr - 24 Apr</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 text-[10px] font-bold border border-lime-400/30">
                      Confirmed
                    </span>
                  </div>

                  {/* Shimla */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=100&q=80"
                        alt="Shimla"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">Shimla Snows</p>
                        <p className="text-[10px] text-slate-400">10 Jan - 15 Jan</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                      Pending
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pt-1">2025</p>

                <div className="space-y-2">
                  {/* Andaman */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=100&q=80"
                        alt="Andaman"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">Andaman Cruise</p>
                        <p className="text-[10px] text-slate-400">07 Feb - 12 Feb</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Completed
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
