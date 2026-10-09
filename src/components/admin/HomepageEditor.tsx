import React, { useState, useEffect } from 'react';
import {
  House,
  Sparkle,
  MapPin,
  CheckCircle,
  Clock,
  ArrowsLeftRight,
  ChatCircleText,
  Gift,
  Question,
  Megaphone,
  FloppyDisk,
  ArrowCounterClockwise,
  Plus,
  Trash,
  ArrowSquareOut,
  Info,
  Image as ImageIcon,
  ShieldCheck,
  CaretRight,
  Eye
} from '@phosphor-icons/react';
import { HomepageConfig } from '../../types';
import { getHomepageConfig, saveHomepageConfig, resetHomepageConfig } from '../../data/mockData';
import { S3ImageUploader } from '../S3ImageUploader';

interface HomepageEditorProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type SectionKey =
  | 'hero'
  | 'marquee'
  | 'destinations'
  | 'benefits'
  | 'timeline'
  | 'marketplace'
  | 'testimonials'
  | 'whyJoinEarly'
  | 'faqs'
  | 'finalCta';

export const HomepageEditor: React.FC<HomepageEditorProps> = ({ showToast }) => {
  const [config, setConfig] = useState<HomepageConfig>(getHomepageConfig());
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getHomepageConfig());
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const handleChange = <K extends keyof HomepageConfig>(section: K, data: Partial<HomepageConfig[K]>) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveHomepageConfig(config);
    setHasUnsavedChanges(false);
    showToast('Homepage contents saved & published live!', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all homepage content sections back to system defaults? Any custom copy will be overwritten.')) {
      const def = resetHomepageConfig();
      setConfig(def);
      setHasUnsavedChanges(false);
      showToast('Homepage contents reset to system defaults.', 'info');
    }
  };

  const SECTIONS: { key: SectionKey; label: string; icon: React.ElementType; badge?: string; desc: string }[] = [
    { key: 'hero', label: 'Hero Header & Hotspots', icon: Sparkle, badge: 'Main', desc: 'Opening headlines, CTA actions, and interactive destination backdrop slides' },
    { key: 'marquee', label: 'Ecosystem Marquee', icon: ShieldCheck, desc: 'Partner badges, marquee ticker items, and agency type tags' },
    { key: 'destinations', label: 'Featured Destinations', icon: MapPin, badge: 'Images', desc: 'Destination cards with S3 photo upload, DMC counts, and trending tags' },
    { key: 'benefits', label: 'Agency Value & ROI', icon: CheckCircle, desc: 'Problem vs. solution transformation cards and growth copy' },
    { key: 'timeline', label: 'How It Works Timeline', icon: Clock, desc: '4-step onboarding journey and timing badges' },
    { key: 'marketplace', label: 'Marketplace Split View', icon: ArrowsLeftRight, desc: 'DMC supplier vs. retail traveler dual value propositions' },
    { key: 'testimonials', label: 'Agency Testimonials', icon: ChatCircleText, badge: 'Avatars', desc: 'Partner reviews, metrics, and owner photos' },
    { key: 'whyJoinEarly', label: 'Why Join Early / Perks', icon: Gift, desc: 'Founding Partner VIP offer and 4 program perks' },
    { key: 'faqs', label: 'Searchable FAQs', icon: Question, desc: 'Categorized questions, answers, and onboarding assist' },
    { key: 'finalCta', label: 'Bottom Conversion Banner', icon: Megaphone, desc: 'Closing call to action, headline, and trust guarantee note' },
  ];

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      
      {/* Top Banner & Action Header (Stacked Up & Down on <=1024px, Horizontal on >=1280px) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border border-slate-200/90 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        
        {/* Content Details (Icon, Title, Badges, Description) */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <House size={26} weight="duotone" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Homepage Visual &amp; Copy Editor
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold uppercase tracking-wide shrink-0">
                Live Sync Active
              </span>
              {hasUnsavedChanges && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-extrabold animate-pulse shrink-0">
                  Unsaved Changes
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed max-w-3xl">
              Customize headlines, value propositions, high-resolution imagery, FAQ items, and testimonials across the public homepage.
            </p>
          </div>
        </div>

        {/* Global Action Toolbar (Positioned below content on <=1024px with full UX clarity) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full xl:w-auto pt-4 xl:pt-0 border-t border-slate-100 xl:border-t-0 justify-stretch sm:justify-end shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            title="View public homepage in new tab"
          >
            <Eye size={16} />
            <span>Live Site</span>
            <ArrowSquareOut size={14} />
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Reset all homepage content to default"
          >
            <ArrowCounterClockwise size={16} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-extrabold transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FloppyDisk size={17} weight="bold" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Info Notice: Photo Library & S3 Integration */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-slate-800">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" weight="fill" />
        <div className="text-xs leading-relaxed font-semibold">
          <span className="font-bold text-blue-950 block">Instant S3 Image Upload &amp; Live Synchronization</span>
          <span className="text-blue-900 font-medium">
            You can now upload high-resolution images directly from your computer to AWS S3 or paste image URLs for Hero Hotspots, Destination cards, and Testimonial avatars. Changes are synchronized across all devices in real-time.
          </span>
        </div>
      </div>

      {/* Mobile, Tablet & 1024px Horizontal Scrollable Section Bar */}
      <div className="block xl:hidden bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 pb-1.5">
          Select Section to Edit ({SECTIONS.length})
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {SECTIONS.map(sec => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveSection(sec.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon size={16} weight={isActive ? 'fill' : 'bold'} />
                <span>{sec.label}</span>
                {sec.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Responsive Grid Layout - 1024px uses full width with side scroll, >=1280px uses two-column desktop sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Desktop Section Picker Sidebar (1280px+) */}
        <div className="hidden xl:block xl:col-span-4 space-y-1.5 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-sm sticky top-6">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-1">
            Homepage Sections ({SECTIONS.length})
          </p>
          {SECTIONS.map(sec => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveSection(sec.key)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon size={18} weight={isActive ? 'fill' : 'bold'} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-600'} />
                  <span className="truncate">{sec.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {sec.badge && (
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sec.badge}
                    </span>
                  )}
                  <CaretRight size={13} className={isActive ? 'text-white' : 'text-slate-300'} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Section Configuration Panel Workspace */}
        <div className="xl:col-span-8 bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200/90 shadow-sm min-w-0">
          <form onSubmit={handleSave} className="space-y-6">

            {/* ── 1. HERO SECTION ── */}
            {activeSection === 'hero' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Hero Section Content &amp; Hotspots</h3>
                  <p className="text-xs text-slate-500 font-medium">Main top banner copy and interactive background destination slides</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Headline (Opening Words)</label>
                  <input
                    type="text"
                    value={config.hero.headlineStart}
                    onChange={e => handleChange('hero', { headlineStart: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800"
                    placeholder="e.g. Showcase Your Travel Experiences"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Headline Gradient Highlight Text</label>
                  <input
                    type="text"
                    value={config.hero.headlineGradient}
                    onChange={e => handleChange('hero', { headlineGradient: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800"
                    placeholder="e.g. To Thousands of Future Travelers"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Subtitle / Hero Description</label>
                  <textarea
                    rows={3}
                    value={config.hero.subtitle}
                    onChange={e => handleChange('hero', { subtitle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Primary CTA Button</label>
                    <input
                      type="text"
                      value={config.hero.primaryCtaText}
                      onChange={e => handleChange('hero', { primaryCtaText: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Secondary CTA Button</label>
                    <input
                      type="text"
                      value={config.hero.secondaryCtaText}
                      onChange={e => handleChange('hero', { secondaryCtaText: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Hotspot Destination Tabs with S3 Image Uploaders */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Interactive Hotspot Slides ({config.hero.hotspots.length})</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Tabs shown on the hero banner for background destination switching</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newHs = {
                          id: `hs-${Date.now()}`,
                          name: 'New Destination',
                          tagline: 'Scenic Paradise & Exquisite Stays',
                          img: 'https://images.unsplash.com/photo-1506665531195-3566af294e99?auto=format&fit=crop&w=2000&q=85',
                          agencyCount: '120+ DMCs'
                        };
                        handleChange('hero', { hotspots: [...config.hero.hotspots, newHs] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer transition-colors"
                    >
                      <Plus size={14} />
                      <span>Add Hotspot</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.hero.hotspots.map((hs, index) => (
                      <div key={hs.id || index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            placeholder="Destination Name"
                            value={hs.name}
                            onChange={e => {
                              const next = [...config.hero.hotspots];
                              next[index] = { ...next[index], name: e.target.value };
                              handleChange('hero', { hotspots: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (config.hero.hotspots.length <= 1) {
                                showToast('Hero requires at least one destination hotspot.', 'warning');
                                return;
                              }
                              const next = config.hero.hotspots.filter((_, i) => i !== index);
                              handleChange('hero', { hotspots: next });
                            }}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Remove Hotspot"
                          >
                            <Trash size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Tagline (e.g. Luxury Water Villas)"
                            value={hs.tagline}
                            onChange={e => {
                              const next = [...config.hero.hotspots];
                              next[index] = { ...next[index], tagline: e.target.value };
                              handleChange('hero', { hotspots: next });
                            }}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                          <input
                            type="text"
                            placeholder="DMC count (e.g. 140+ DMCs)"
                            value={hs.agencyCount}
                            onChange={e => {
                              const next = [...config.hero.hotspots];
                              next[index] = { ...next[index], agencyCount: e.target.value };
                              handleChange('hero', { hotspots: next });
                            }}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                        </div>

                        {/* S3 Image Uploader Component */}
                        <div className="pt-2 border-t border-slate-200">
                          <S3ImageUploader
                            label={`Hotspot #${index + 1} Background Image`}
                            value={hs.img}
                            onChange={newUrl => {
                              const next = [...config.hero.hotspots];
                              next[index] = { ...next[index], img: newUrl };
                              handleChange('hero', { hotspots: next });
                            }}
                            bucketPath="homepage/hero-hotspots"
                            helperText="High-resolution landscape photo for hero banner."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. ECOSYSTEM MARQUEE ── */}
            {activeSection === 'marquee' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Ecosystem Marquee Strip</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage top badge, title, and marquee partner brand tags</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Badge Tag</label>
                  <input
                    type="text"
                    value={config.marquee.badgeText}
                    onChange={e => handleChange('marquee', { badgeText: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading</label>
                    <input
                      type="text"
                      value={config.marquee.heading}
                      onChange={e => handleChange('marquee', { heading: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Subheading</label>
                    <input
                      type="text"
                      value={config.marquee.subheading}
                      onChange={e => handleChange('marquee', { subheading: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">Marquee Partners List ({config.marquee.partners.length})</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newPartner = {
                          id: `m-${Date.now()}`,
                          name: 'New Partner DMC',
                          location: 'Location, Country',
                          type: 'DMC',
                          initial: 'NP',
                          bg: 'bg-blue-600'
                        };
                        handleChange('marquee', { partners: [...config.marquee.partners, newPartner] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Partner</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {config.marquee.partners.map((p, index) => (
                      <div key={p.id || index} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <input
                          type="text"
                          placeholder="Partner Name"
                          value={p.name}
                          onChange={e => {
                            const next = [...config.marquee.partners];
                            next[index] = { ...next[index], name: e.target.value, initial: e.target.value.slice(0, 2).toUpperCase() };
                            handleChange('marquee', { partners: next });
                          }}
                          className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Location"
                            value={p.location}
                            onChange={e => {
                              const next = [...config.marquee.partners];
                              next[index] = { ...next[index], location: e.target.value };
                              handleChange('marquee', { partners: next });
                            }}
                            className="w-full sm:w-36 p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Type"
                            value={p.type}
                            onChange={e => {
                              const next = [...config.marquee.partners];
                              next[index] = { ...next[index], type: e.target.value };
                              handleChange('marquee', { partners: next });
                            }}
                            className="w-full sm:w-28 p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = config.marquee.partners.filter((_, i) => i !== index);
                              handleChange('marquee', { partners: next });
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer shrink-0"
                            title="Remove partner"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. FEATURED DESTINATIONS ── */}
            {activeSection === 'destinations' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Featured Destinations Section</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage destination showcase cards, S3 photos, and headlines</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Start</label>
                    <input
                      type="text"
                      value={config.destinations.headingStart}
                      onChange={e => handleChange('destinations', { headingStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Gradient</label>
                    <input
                      type="text"
                      value={config.destinations.headingGradient}
                      onChange={e => handleChange('destinations', { headingGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Subtitle</label>
                  <textarea
                    rows={2}
                    value={config.destinations.subtitle}
                    onChange={e => handleChange('destinations', { subtitle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold leading-relaxed"
                  />
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                      Destination Cards ({config.destinations.destinations.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newCard = {
                          id: `dest-${Date.now()}`,
                          name: 'New Destination',
                          country: 'Country Name',
                          imageUrl: 'https://images.unsplash.com/photo-1506665531195-3566af294e99?auto=format&fit=crop&w=800&q=80',
                          agencyCount: 100,
                          packageCount: 250,
                          featuredTag: 'Trending'
                        };
                        handleChange('destinations', { destinations: [...config.destinations.destinations, newCard] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Destination</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.destinations.destinations.map((d, index) => (
                      <div key={d.id || index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                          <input
                            type="text"
                            placeholder="Destination Name"
                            value={d.name}
                            onChange={e => {
                              const next = [...config.destinations.destinations];
                              next[index] = { ...next[index], name: e.target.value };
                              handleChange('destinations', { destinations: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Country"
                              value={d.country}
                              onChange={e => {
                                const next = [...config.destinations.destinations];
                                next[index] = { ...next[index], country: e.target.value };
                                handleChange('destinations', { destinations: next });
                              }}
                              className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium w-36"
                            />
                            <input
                              type="text"
                              placeholder="Badge Tag"
                              value={d.featuredTag || ''}
                              onChange={e => {
                                const next = [...config.destinations.destinations];
                                next[index] = { ...next[index], featuredTag: e.target.value };
                                handleChange('destinations', { destinations: next });
                              }}
                              className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium w-28"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = config.destinations.destinations.filter((_, i) => i !== index);
                                handleChange('destinations', { destinations: next });
                              }}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0"
                              title="Remove destination"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Counts */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">DMC Count</label>
                            <input
                              type="number"
                              value={d.agencyCount}
                              onChange={e => {
                                const next = [...config.destinations.destinations];
                                next[index] = { ...next[index], agencyCount: parseInt(e.target.value) || 0 };
                                handleChange('destinations', { destinations: next });
                              }}
                              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Packages Count</label>
                            <input
                              type="number"
                              value={d.packageCount}
                              onChange={e => {
                                const next = [...config.destinations.destinations];
                                next[index] = { ...next[index], packageCount: parseInt(e.target.value) || 0 };
                                handleChange('destinations', { destinations: next });
                              }}
                              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>
                        </div>

                        {/* S3 Image Uploader for Destination Card */}
                        <div className="pt-2 border-t border-slate-200">
                          <S3ImageUploader
                            label={`Destination Photo (${d.name || 'Showcase'})`}
                            value={d.imageUrl}
                            onChange={newUrl => {
                              const next = [...config.destinations.destinations];
                              next[index] = { ...next[index], imageUrl: newUrl };
                              handleChange('destinations', { destinations: next });
                            }}
                            bucketPath="homepage/destinations"
                            helperText="High-res scenic photo displayed on homepage showcase cards."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. AGENCY BENEFITS & ROI ── */}
            {activeSection === 'benefits' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Agency Value Proposition &amp; Benefits</h3>
                  <p className="text-xs text-slate-500 font-medium">Headlines and pain-point transformation solution cards</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Headline Start</label>
                    <input
                      type="text"
                      value={config.benefits.headingStart}
                      onChange={e => handleChange('benefits', { headingStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Headline Gradient</label>
                    <input
                      type="text"
                      value={config.benefits.headingGradient}
                      onChange={e => handleChange('benefits', { headingGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Subtitle</label>
                  <textarea
                    rows={2}
                    value={config.benefits.subtitle}
                    onChange={e => handleChange('benefits', { subtitle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold leading-relaxed"
                  />
                </div>

                <div className="space-y-3 pt-3">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">Benefit Solution Cards</label>
                  <div className="space-y-3">
                    {config.benefits.benefits.map((b, index) => (
                      <div key={b.id || index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                        <input
                          type="text"
                          placeholder="Benefit Title"
                          value={b.title}
                          onChange={e => {
                            const next = [...config.benefits.benefits];
                            next[index] = { ...next[index], title: e.target.value };
                            handleChange('benefits', { benefits: next });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <textarea
                            rows={2}
                            placeholder="Legacy Problem"
                            value={b.problem}
                            onChange={e => {
                              const next = [...config.benefits.benefits];
                              next[index] = { ...next[index], problem: e.target.value };
                              handleChange('benefits', { benefits: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-rose-800"
                          />
                          <textarea
                            rows={2}
                            placeholder="Triiply Solution"
                            value={b.solution}
                            onChange={e => {
                              const next = [...config.benefits.benefits];
                              next[index] = { ...next[index], solution: e.target.value };
                              handleChange('benefits', { benefits: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-emerald-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 5. HOW IT WORKS TIMELINE ── */}
            {activeSection === 'timeline' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">How It Works Timeline</h3>
                  <p className="text-xs text-slate-500 font-medium">4 onboarding steps and timing badges</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Start</label>
                    <input
                      type="text"
                      value={config.timeline.headingStart}
                      onChange={e => handleChange('timeline', { headingStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Gradient</label>
                    <input
                      type="text"
                      value={config.timeline.headingGradient}
                      onChange={e => handleChange('timeline', { headingGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">Timeline Steps</label>
                  <div className="space-y-3">
                    {config.timeline.steps.map((step, index) => (
                      <div key={step.id || index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {step.stepNumber}
                          </span>
                          <input
                            type="text"
                            placeholder="Step Title"
                            value={step.title}
                            onChange={e => {
                              const next = [...config.timeline.steps];
                              next[index] = { ...next[index], title: e.target.value };
                              handleChange('timeline', { steps: next });
                            }}
                            className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Badge (e.g. 2 Minutes)"
                            value={step.highlightBadge || ''}
                            onChange={e => {
                              const next = [...config.timeline.steps];
                              next[index] = { ...next[index], highlightBadge: e.target.value };
                              handleChange('timeline', { steps: next });
                            }}
                            className="w-full sm:w-36 p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Step description"
                          value={step.description}
                          onChange={e => {
                            const next = [...config.timeline.steps];
                            next[index] = { ...next[index], description: e.target.value };
                            handleChange('timeline', { steps: next });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 6. FUTURE MARKETPLACE SPLIT ── */}
            {activeSection === 'marketplace' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Future Marketplace Split View</h3>
                  <p className="text-xs text-slate-500 font-medium">DMC suppliers vs. retail travelers dual value propositions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Start</label>
                    <input
                      type="text"
                      value={config.marketplace.headingStart}
                      onChange={e => handleChange('marketplace', { headingStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Gradient</label>
                    <input
                      type="text"
                      value={config.marketplace.headingGradient}
                      onChange={e => handleChange('marketplace', { headingGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                  {/* Agency Column */}
                  <div className="space-y-3 p-4 bg-sky-50/60 rounded-2xl border border-sky-200">
                    <h4 className="text-xs font-black uppercase text-sky-900">Agencies &amp; DMCs Column</h4>
                    <input
                      type="text"
                      value={config.marketplace.agencyColumnTitle}
                      onChange={e => handleChange('marketplace', { agencyColumnTitle: e.target.value })}
                      className="w-full p-2 bg-white border border-sky-300 rounded-xl text-xs font-bold"
                    />
                    <div className="space-y-2 pt-2">
                      {config.marketplace.agencyFeatures.map((f, i) => (
                        <div key={f.id || i} className="p-2.5 bg-white rounded-xl border border-sky-200 space-y-1">
                          <input
                            type="text"
                            value={f.title}
                            onChange={e => {
                              const next = [...config.marketplace.agencyFeatures];
                              next[i] = { ...next[i], title: e.target.value };
                              handleChange('marketplace', { agencyFeatures: next });
                            }}
                            className="w-full text-xs font-bold border-b pb-1"
                          />
                          <input
                            type="text"
                            value={f.description}
                            onChange={e => {
                              const next = [...config.marketplace.agencyFeatures];
                              next[i] = { ...next[i], description: e.target.value };
                              handleChange('marketplace', { agencyFeatures: next });
                            }}
                            className="w-full text-[11px] text-slate-600 font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traveler Column */}
                  <div className="space-y-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                    <h4 className="text-xs font-black uppercase text-emerald-900">Travelers &amp; Buyers Column</h4>
                    <input
                      type="text"
                      value={config.marketplace.travelerColumnTitle}
                      onChange={e => handleChange('marketplace', { travelerColumnTitle: e.target.value })}
                      className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold"
                    />
                    <div className="space-y-2 pt-2">
                      {config.marketplace.travelerFeatures.map((f, i) => (
                        <div key={f.id || i} className="p-2.5 bg-white rounded-xl border border-emerald-200 space-y-1">
                          <input
                            type="text"
                            value={f.title}
                            onChange={e => {
                              const next = [...config.marketplace.travelerFeatures];
                              next[i] = { ...next[i], title: e.target.value };
                              handleChange('marketplace', { travelerFeatures: next });
                            }}
                            className="w-full text-xs font-bold border-b pb-1"
                          />
                          <input
                            type="text"
                            value={f.description}
                            onChange={e => {
                              const next = [...config.marketplace.travelerFeatures];
                              next[i] = { ...next[i], description: e.target.value };
                              handleChange('marketplace', { travelerFeatures: next });
                            }}
                            className="w-full text-[11px] text-slate-600 font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 7. TESTIMONIALS ── */}
            {activeSection === 'testimonials' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Agency Testimonials &amp; Reviews</h3>
                  <p className="text-xs text-slate-500 font-medium">Customer trust quotes, S3 owner avatar photos, and metric badges</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Start</label>
                    <input
                      type="text"
                      value={config.testimonials.headingStart}
                      onChange={e => handleChange('testimonials', { headingStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Gradient</label>
                    <input
                      type="text"
                      value={config.testimonials.headingGradient}
                      onChange={e => handleChange('testimonials', { headingGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                      Testimonials List ({config.testimonials.testimonials.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newTest = {
                          id: `test-${Date.now()}`,
                          quote: 'Triiply helped us scale our luxury inquiries and partner credibility significantly.',
                          authorName: 'Agency Leader',
                          authorRole: 'Founder & CEO',
                          agencyName: 'Partner DMC',
                          location: 'Destination, Country',
                          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                          rating: 5,
                          verifiedPartner: true,
                          metricBadge: 'Verified DMC'
                        };
                        handleChange('testimonials', { testimonials: [...config.testimonials.testimonials, newTest] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.testimonials.testimonials.map((t, index) => (
                      <div key={t.id || index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                          <input
                            type="text"
                            placeholder="Author Name"
                            value={t.authorName}
                            onChange={e => {
                              const next = [...config.testimonials.testimonials];
                              next[index] = { ...next[index], authorName: e.target.value };
                              handleChange('testimonials', { testimonials: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold flex-1"
                          />
                          <input
                            type="text"
                            placeholder="Agency Name"
                            value={t.agencyName}
                            onChange={e => {
                              const next = [...config.testimonials.testimonials];
                              next[index] = { ...next[index], agencyName: e.target.value };
                              handleChange('testimonials', { testimonials: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Metric (e.g. +42% Inquiries)"
                              value={t.metricBadge}
                              onChange={e => {
                                const next = [...config.testimonials.testimonials];
                                next[index] = { ...next[index], metricBadge: e.target.value };
                                handleChange('testimonials', { testimonials: next });
                              }}
                              className="w-full sm:w-36 p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = config.testimonials.testimonials.filter((_, i) => i !== index);
                                handleChange('testimonials', { testimonials: next });
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer shrink-0"
                              title="Remove testimonial"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Author Role (e.g. Managing Director)"
                            value={t.authorRole}
                            onChange={e => {
                              const next = [...config.testimonials.testimonials];
                              next[index] = { ...next[index], authorRole: e.target.value };
                              handleChange('testimonials', { testimonials: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Location (e.g. Dubai, UAE)"
                            value={t.location}
                            onChange={e => {
                              const next = [...config.testimonials.testimonials];
                              next[index] = { ...next[index], location: e.target.value };
                              handleChange('testimonials', { testimonials: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Quote review"
                          value={t.quote}
                          onChange={e => {
                            const next = [...config.testimonials.testimonials];
                            next[index] = { ...next[index], quote: e.target.value };
                            handleChange('testimonials', { testimonials: next });
                          }}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium leading-relaxed"
                        />

                        {/* S3 Image Uploader for Testimonial Profile Avatar */}
                        <div className="pt-2 border-t border-slate-200">
                          <S3ImageUploader
                            label={`Author Avatar Photo (${t.authorName || 'Profile'})`}
                            value={t.avatarUrl}
                            onChange={newUrl => {
                              const next = [...config.testimonials.testimonials];
                              next[index] = { ...next[index], avatarUrl: newUrl };
                              handleChange('testimonials', { testimonials: next });
                            }}
                            bucketPath="homepage/testimonials"
                            helperText="Square profile avatar photograph."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 8. WHY JOIN EARLY ── */}
            {activeSection === 'whyJoinEarly' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Why Join Early (Founding Partner Offer)</h3>
                  <p className="text-xs text-slate-500 font-medium">Founding partner offer banner &amp; 4 VIP perks</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Start</label>
                    <input
                      type="text"
                      value={config.whyJoinEarly.headingStart}
                      onChange={e => handleChange('whyJoinEarly', { headingStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Gradient</label>
                    <input
                      type="text"
                      value={config.whyJoinEarly.headingGradient}
                      onChange={e => handleChange('whyJoinEarly', { headingGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Subtitle</label>
                  <textarea
                    rows={2}
                    value={config.whyJoinEarly.subtitle}
                    onChange={e => handleChange('whyJoinEarly', { subtitle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">CTA Button Text</label>
                  <input
                    type="text"
                    value={config.whyJoinEarly.primaryCtaText}
                    onChange={e => handleChange('whyJoinEarly', { primaryCtaText: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-3 pt-3">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">Founding Perks List</label>
                  <div className="space-y-3">
                    {config.whyJoinEarly.perks.map((p, index) => (
                      <div key={p.id || index} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <input
                          type="text"
                          placeholder="Perk Title"
                          value={p.title}
                          onChange={e => {
                            const next = [...config.whyJoinEarly.perks];
                            next[index] = { ...next[index], title: e.target.value };
                            handleChange('whyJoinEarly', { perks: next });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Perk Description"
                          value={p.description}
                          onChange={e => {
                            const next = [...config.whyJoinEarly.perks];
                            next[index] = { ...next[index], description: e.target.value };
                            handleChange('whyJoinEarly', { perks: next });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 9. FAQS ── */}
            {activeSection === 'faqs' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage questions, answers, categories, and headlines</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Start</label>
                    <input
                      type="text"
                      value={config.faqs.headingStart}
                      onChange={e => handleChange('faqs', { headingStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Heading Gradient</label>
                    <input
                      type="text"
                      value={config.faqs.headingGradient}
                      onChange={e => handleChange('faqs', { headingGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                      Questions List ({config.faqs.faqs.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaq = {
                          id: `faq-${Date.now()}`,
                          category: 'General',
                          question: 'New Question?',
                          answer: 'Answer description goes here...'
                        };
                        handleChange('faqs', { faqs: [...config.faqs.faqs, newFaq] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Question</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {config.faqs.faqs.map((f, index) => (
                      <div key={f.id || index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                          <input
                            type="text"
                            placeholder="Question"
                            value={f.question}
                            onChange={e => {
                              const next = [...config.faqs.faqs];
                              next[index] = { ...next[index], question: e.target.value };
                              handleChange('faqs', { faqs: next });
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Category"
                              value={f.category}
                              onChange={e => {
                                const next = [...config.faqs.faqs];
                                next[index] = { ...next[index], category: e.target.value };
                                handleChange('faqs', { faqs: next });
                              }}
                              className="w-full sm:w-32 p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = config.faqs.faqs.filter((_, i) => i !== index);
                                handleChange('faqs', { faqs: next });
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer shrink-0"
                              title="Delete Question"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Answer description"
                          value={f.answer}
                          onChange={e => {
                            const next = [...config.faqs.faqs];
                            next[index] = { ...next[index], answer: e.target.value };
                            handleChange('faqs', { faqs: next });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 10. FINAL CTA ── */}
            {activeSection === 'finalCta' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Bottom Final Conversion Banner</h3>
                  <p className="text-xs text-slate-500 font-medium">Bottom call to action and trust guarantee note</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Headline Start</label>
                    <input
                      type="text"
                      value={config.finalCta.headlineStart}
                      onChange={e => handleChange('finalCta', { headlineStart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Headline Gradient</label>
                    <input
                      type="text"
                      value={config.finalCta.headlineGradient}
                      onChange={e => handleChange('finalCta', { headlineGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Subtitle</label>
                  <textarea
                    rows={2}
                    value={config.finalCta.subtitle}
                    onChange={e => handleChange('finalCta', { subtitle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Button Text</label>
                    <input
                      type="text"
                      value={config.finalCta.buttonText}
                      onChange={e => handleChange('finalCta', { buttonText: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Guarantee Trust Line</label>
                    <input
                      type="text"
                      value={config.finalCta.guaranteeNote}
                      onChange={e => handleChange('finalCta', { guaranteeNote: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Save Action */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
                Changes take effect immediately on the public website.
              </span>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FloppyDisk size={16} weight="bold" />
                <span>Save &amp; Publish Changes</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
