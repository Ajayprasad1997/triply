import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, Eye, Camera, X, ArrowRight } from '@phosphor-icons/react';
import { getGalleryPhotos } from '../data/mockData';
import { GalleryPhoto } from '../types';
import { InstagramVerifiedBadge } from './InstagramVerifiedBadge';
import { LoadMoreButton } from './LoadMoreButton';

export const MasonryTravelGallery: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhotoModal, setActivePhotoModal] = useState<GalleryPhoto | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const loadPhotos = () => {
    const all = getGalleryPhotos();
    setPhotos(all);
  };

  useEffect(() => {
    loadPhotos();
    const handleUpdate = () => loadPhotos();
    window.addEventListener('triiply_photos_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('triiply_photos_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categories = ['All', 'Resorts & Villas', 'Desert & Adventure', 'Alpine & Scenic', 'Beaches & Islands', 'Culture & Heritage'];

  // Strict Ruling:
  // 1. If total photos in library <= 5, show those photos (featured or not).
  // 2. If total photos in library > 5, show ONLY the photos marked featured (never show unfeatured photos), capped at exactly 5.
  const candidatePhotos = photos.length <= 5
    ? photos
    : photos.filter((p) => p.featured === true);

  // Category filtering on the candidate pool
  const categoryFiltered = selectedCategory === 'All'
    ? candidatePhotos
    : candidatePhotos.filter((p) => p.category === selectedCategory);

  const displayPhotos = categoryFiltered.slice(0, visibleCount);

  useEffect(() => setVisibleCount(6), [selectedCategory]);

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Your Packages Deserve{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              World-Class Presentation
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Stop sending static PDFs on WhatsApp. Triiply transforms your tour itineraries into high-converting, shareable web storefronts complete with high-resolution media galleries and verified badges.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Photo Featured Grid Layout */}
        {displayPhotos.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 p-6 text-slate-500">
            <p className="font-bold text-sm">No featured photographs found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-3 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              View All Featured Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPhotos.map((photo, index) => {
              // 1st photo is wide hero tile (spans 2 cols on lg)
              const isHeroTile = index === 0;

              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoModal(photo)}
                  className={`group relative rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-950 ${isHeroTile ? 'md:col-span-2 lg:col-span-2 h-80 sm:h-96' : 'h-80 sm:h-96'
                    }`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-500/90 backdrop-blur-md text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase shadow">
                        {photo.category}
                      </span>
                      {photo.featured && (
                        <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                          <Sparkle size={12} weight="fill" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={16} />
                    </div>
                  </div>

                  {/* Bottom Metadata */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="text-xs text-sky-300 font-bold mb-1 flex items-center gap-1.5 flex-wrap">
                      <span>{photo.destination}</span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1 text-slate-200">
                        Credit: <strong>{photo.credit || 'Triiply Partner'}</strong>
                        <InstagramVerifiedBadge size={13} title="Verified Partner Agency" />
                      </span>
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-extrabold leading-snug">{photo.title}</h3>
                    {photo.caption && (
                      <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 font-medium leading-relaxed">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <LoadMoreButton visible={visibleCount} total={categoryFiltered.length} label="photos" onLoadMore={() => setVisibleCount(count => count + 6)} />

        {/* ── MORE PHOTOS CTA BUTTON ── */}
        <div className="mt-12 text-center flex flex-col items-center">
          <Link
            to="/photo-library"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-heading font-extrabold text-sm sm:text-base shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group cursor-pointer"
          >
            <Camera size={20} weight="bold" className="text-sky-400 group-hover:text-white transition-colors" />
            <span>More Photos</span>
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <p className="text-xs text-slate-500 mt-3 font-semibold">
            Explore {photos.length > 5 ? `${photos.length}+` : 'all'} high-resolution destination photographs &amp; visual media assets in the Triiply Photo Library
          </p>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative text-white">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>

            <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activePhotoModal.imageUrl}
                alt={activePhotoModal.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {activePhotoModal.category} • {activePhotoModal.destination}
                </span>
                <h3 className="font-heading text-xl font-bold mt-1.5 leading-snug">{activePhotoModal.title}</h3>
                {activePhotoModal.caption && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activePhotoModal.caption}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-400">Photo Credit</p>
                <p className="text-xs font-bold text-white flex items-center gap-1 mt-0.5 justify-end">
                  <span>{activePhotoModal.credit || 'Triiply Partner'}</span>
                  <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
