import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  MagnifyingGlass,
  Sparkle,
  Eye,
  X,
  ArrowLeft,
  ShareNetwork,
  DownloadSimple,
  SlidersHorizontal,
  MapPin,
  CheckCircle,
  Tag,
  Compass,
  ArrowRight
} from '@phosphor-icons/react';
import { getGalleryPhotos } from '../data/mockData';
import { GalleryPhoto, PhotoCategory } from '../types';
import { InstagramVerifiedBadge } from '../components/InstagramVerifiedBadge';
import { Footer } from '../components/Footer';
import { LoadMoreButton } from '../components/LoadMoreButton';

export const PhotoLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhotoModal, setActivePhotoModal] = useState<GalleryPhoto | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const refreshPhotos = () => {
      setPhotos(getGalleryPhotos());
    };
    refreshPhotos();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.addEventListener('triiply_photos_updated', refreshPhotos);
    window.addEventListener('storage', refreshPhotos);
    return () => {
      window.removeEventListener('triiply_photos_updated', refreshPhotos);
      window.removeEventListener('storage', refreshPhotos);
    };
  }, []);

  const categories = [
    'All',
    'Resorts & Villas',
    'Desert & Adventure',
    'Alpine & Scenic',
    'Beaches & Islands',
    'Culture & Heritage',
    'Festivals & Events'
  ];

  // Filtering
  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    const matchesSearch =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.credit && photo.credit.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (photo.caption && photo.caption.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  useEffect(() => setVisibleCount(6), [searchQuery, selectedCategory]);

  const handleSharePhoto = (photo: GalleryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(photo.imageUrl);
    setCopiedId(photo.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* ── HERO BANNER ── */}
      <section className="bg-slate-900 text-white py-14 lg:py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-sky-600/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={14} />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-sky-400 font-bold">Holiday Photo Library</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Camera size={16} weight="duotone" />
              <span>Curated Visual Destination Hub</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Triiply Holiday{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Photo Library
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
              Explore high-resolution destination photographs, luxury overwater villas, desert safari landscapes, and alpine vistas curated and uploaded by verified travel partners.
            </p>
          </div>

          {/* Search Bar & Stats */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 max-w-2xl">
            <div className="relative flex-1 w-full">
              <MagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search photograph title, destination, resort, agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="text-xs font-bold text-slate-400 bg-slate-800/80 px-4 py-3.5 rounded-2xl border border-slate-700/80 whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{filteredPhotos.length} Photos Available</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── CATEGORY PILLS BAR ── */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO GALLERY GRID ── */}
      <section className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredPhotos.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3 max-w-lg mx-auto shadow-sm">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Camera size={28} />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800">No Photographs Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No destination photos matched your filter query. Try searching with different keywords.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredPhotos.slice(0, visibleCount).map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoModal(photo)}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                >
                  {/* Photo Canvas */}
                  <div className="relative h-64 sm:h-72 bg-slate-950 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/30"></div>

                    {/* Top Pill Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase border border-white/10 shadow">
                        {photo.category}
                      </span>
                      {photo.featured && (
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                          <Sparkle size={11} weight="fill" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <p className="text-[11px] text-sky-300 font-bold mb-0.5 flex items-center gap-1">
                        <MapPin size={12} weight="fill" />
                        <span>{photo.destination}</span>
                      </p>
                      <h3 className="font-heading text-base sm:text-lg font-bold leading-snug line-clamp-1">{photo.title}</h3>
                    </div>
                  </div>

                  {/* Photo Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {photo.caption && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                          {photo.caption}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {/* Photo Credit & Verified Badge */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold truncate max-w-[200px]">
                        <span className="text-slate-400 font-normal text-[11px]">Credit:</span>
                        <strong className="text-slate-900 truncate">{photo.credit || 'Triiply Partner'}</strong>
                        <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleSharePhoto(photo, e)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title="Copy Image URL"
                        >
                          <ShareNetwork size={15} />
                        </button>

                        <button
                          onClick={() => setActivePhotoModal(photo)}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                          title="Fullscreen Lightbox Preview"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <LoadMoreButton visible={visibleCount} total={filteredPhotos.length} label="photos" onLoadMore={() => setVisibleCount(count => count + 6)} />
            </>
          )}

          {/* Copied Toast */}
          {copiedId && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
              <CheckCircle size={16} weight="fill" className="text-emerald-400" />
              <span>Image link copied to clipboard!</span>
            </div>
          )}

        </div>
      </section>

      {/* ── ONBOARDING PARTNER CALLOUT ── */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-heading text-xl sm:text-2xl font-bold">
                Publish Your Destination Photography on Triiply
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Verified travel agencies and ground DMCs can upload high-resolution package assets to our public showcase, boosting direct inquiries and brand authority.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/benefits#agency-onboarding"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <span>Become a Verified Partner</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL ── */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative text-white flex flex-col max-h-[90vh]">
            
            {/* Top Close Bar */}
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>

            {/* High-Res Viewport */}
            <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center shrink-0">
              <img
                src={activePhotoModal.imageUrl}
                alt={activePhotoModal.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            {/* Bottom Modal Metadata */}
            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    {activePhotoModal.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {activePhotoModal.destination}</span>
                </div>
                <h3 className="font-heading text-xl font-bold leading-snug">{activePhotoModal.title}</h3>
                {activePhotoModal.caption && (
                  <p className="text-xs text-slate-300 leading-relaxed font-medium max-w-xl">{activePhotoModal.caption}</p>
                )}
              </div>

              <div className="text-left sm:text-right shrink-0 space-y-1">
                <p className="text-[11px] text-slate-400 font-medium">Photo Credit</p>
                <p className="text-xs font-bold text-white flex items-center gap-1.5 sm:justify-end">
                  <span>{activePhotoModal.credit || 'Triiply Partner'}</span>
                  <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                </p>
                <a
                  href={activePhotoModal.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline pt-1 font-semibold"
                >
                  <DownloadSimple size={14} />
                  <span>Open Full HD Asset</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onOpenRegister={() => navigate('/benefits#agency-onboarding')} />

    </div>
  );
};
