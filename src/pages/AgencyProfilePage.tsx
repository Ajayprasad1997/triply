import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Medal, 
  Globe, 
  CheckCircle, 
  ArrowLeft, 
  Envelope, 
  Phone, 
  Calendar, 
  Users, 
  Warning, 
  SuitcaseRolling, 
  WhatsappLogo, 
  ArrowRight, 
  ThumbsUp, 
  ChatDots, 
  Plus, 
  X, 
  Sparkle, 
  User, 
  CaretRight,
  Camera,
  Eye
} from '@phosphor-icons/react';
import { getAgencies, getPackages, getAgencyReviews, addAgencyReview, voteHelpfulReview, getGalleryPhotos } from '../data/mockData';
import { AGENCY_PARTNERS } from '../data/landingData';
import { PackageDetailModal } from '../components/PackageDetailModal';
import { InstagramVerifiedBadge } from '../components/InstagramVerifiedBadge';
import { LoadMoreButton } from '../components/LoadMoreButton';
import { TravelPackage, AgencyReview, GalleryPhoto, AgencyPartner } from '../types';
import { sanitizeInput } from '../utils/security';

export default function AgencyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [agencies, setAgencies] = useState<AgencyPartner[]>(getAgencies());
  const [packages, setPackages] = useState<TravelPackage[]>(getPackages());

  const refreshAllData = () => {
    setAgencies(getAgencies());
    setPackages(getPackages());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Find agency with resilient matching (ID, slug, or fallback)
  const agency = useMemo(() => {
    const pool = agencies.length > 0 ? agencies : AGENCY_PARTNERS;
    const targetId = id ? decodeURIComponent(id).trim().toLowerCase() : '';
    return (
      pool.find(ag => ag.id?.toLowerCase() === targetId) ||
      pool.find(ag => ag.name?.toLowerCase() === targetId || ag.name?.toLowerCase().replace(/\s+/g, '-') === targetId) ||
      AGENCY_PARTNERS.find(ag => ag.id?.toLowerCase() === targetId) ||
      AGENCY_PARTNERS.find(ag => ag.name?.toLowerCase() === targetId || ag.name?.toLowerCase().replace(/\s+/g, '-') === targetId)
    );
  }, [agencies, id]);

  // States
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [reviews, setReviews] = useState<AgencyReview[]>([]);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'ALL'>('ALL');
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);
  const [visiblePackages, setVisiblePackages] = useState(6);
  const [visiblePhotos, setVisiblePhotos] = useState(6);
  const [visibleReviews, setVisibleReviews] = useState(6);
  
  // Write Review Modal State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [newReviewForm, setNewReviewForm] = useState({
    travelerName: '',
    travelerCountry: '',
    rating: 5,
    tripType: 'Couple' as AgencyReview['tripType'],
    packageTitle: '',
    reviewTitle: '',
    comment: ''
  });
  const [formError, setFormError] = useState<string>('');

  const loadReviews = () => {
    if (agency) {
      setReviews(getAgencyReviews(agency.id));
    }
  };

  const loadPhotos = () => {
    const allPhotos = getGalleryPhotos();
    if (agency) {
      const agencyNameClean = agency.name.toLowerCase().trim();
      const matched = allPhotos.filter(photo => {
        const creditClean = (photo.credit || '').toLowerCase().trim();
        return (
          creditClean === agencyNameClean ||
          creditClean.includes(agencyNameClean) ||
          agencyNameClean.includes(creditClean) ||
          (agency.id === 'ag-4' && (creditClean.includes('kashmir') || photo.destination?.toLowerCase().includes('kashmir'))) ||
          (agency.id === 'ag-1' && (creditClean.includes('apex') || creditClean.includes('emirates'))) ||
          (agency.id === 'ag-2' && (creditClean.includes('nusa') || creditClean.includes('bali'))) ||
          (agency.id === 'ag-3' && (creditClean.includes('swiss') || photo.destination?.toLowerCase().includes('switzerland')))
        );
      });
      setGalleryPhotos(matched);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadReviews();
    loadPhotos();

    const handleDataUpdated = () => {
      refreshAllData();
      loadReviews();
      loadPhotos();
    };
    window.addEventListener('triiply_agencies_updated', handleDataUpdated);
    window.addEventListener('triiply_packages_updated', handleDataUpdated);
    window.addEventListener('triiply_reviews_updated', handleDataUpdated);
    window.addEventListener('triiply_photos_updated', handleDataUpdated);
    window.addEventListener('storage', handleDataUpdated);
    return () => {
      window.removeEventListener('triiply_agencies_updated', handleDataUpdated);
      window.removeEventListener('triiply_packages_updated', handleDataUpdated);
      window.removeEventListener('triiply_reviews_updated', handleDataUpdated);
      window.removeEventListener('triiply_photos_updated', handleDataUpdated);
      window.removeEventListener('storage', handleDataUpdated);
    };
  }, [agency?.id, agency?.name]);

  useEffect(() => {
    setVisiblePackages(6);
    setVisiblePhotos(6);
    setVisibleReviews(6);
  }, [agency?.id]);

  useEffect(() => setVisibleReviews(6), [selectedRatingFilter]);

  if (!agency) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-200 shadow max-w-sm">
          <Warning size={48} weight="fill" className="text-rose-500 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-slate-900">Agency Not Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">The requested travel partner does not exist or has been suspended.</p>
          <Link to="/agencies" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  // Filter packages for this agency
  const agencyPackages = packages.filter(pkg => pkg.agencyName === agency.name || pkg.agencyId === agency.id);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (selectedRatingFilter === 'ALL') return reviews;
    return reviews.filter(r => r.rating === selectedRatingFilter);
  }, [reviews, selectedRatingFilter]);

  // Review statistics calculation
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : (agency.rating || 5.0).toFixed(1);

  const star5Count = reviews.filter(r => r.rating === 5).length;
  const star4Count = reviews.filter(r => r.rating === 4).length;
  const star3Count = reviews.filter(r => r.rating === 3).length;

  const handleVoteHelpful = (reviewId: string) => {
    voteHelpfulReview(reviewId);
    loadReviews();
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = sanitizeInput(newReviewForm.travelerName).trim();
    const cleanCountry = sanitizeInput(newReviewForm.travelerCountry).trim();
    const cleanTitle = sanitizeInput(newReviewForm.reviewTitle).trim();
    const cleanComment = sanitizeInput(newReviewForm.comment).trim();
    const cleanPkg = sanitizeInput(newReviewForm.packageTitle).trim() || (agencyPackages[0]?.title || 'Custom Tour');

    if (!cleanName || !cleanCountry || !cleanTitle || !cleanComment) {
      setFormError('Please fill out all required fields.');
      return;
    }

    addAgencyReview({
      agencyId: agency.id,
      agencyName: agency.name,
      travelerName: cleanName,
      travelerAvatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=120&q=80`,
      travelerCountry: cleanCountry,
      packageTitle: cleanPkg,
      rating: newReviewForm.rating,
      tripType: newReviewForm.tripType,
      reviewTitle: cleanTitle,
      comment: cleanComment,
      verifiedBooking: true
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);
      setNewReviewForm({
        travelerName: '',
        travelerCountry: '',
        rating: 5,
        tripType: 'Couple',
        packageTitle: '',
        reviewTitle: '',
        comment: ''
      });
      loadReviews();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* ── PROFILE BRAND BANNER ── */}
      <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-slate-900">
        <img
          src={agency.bannerUrl}
          alt={agency.name}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {/* Top Back Nav Button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            to="/agencies"
            className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 shadow-lg"
          >
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </Link>
        </div>

        {/* Floating Verified Trust Shield */}
        <div className="absolute top-6 right-4 sm:right-8">
          <div className="px-3.5 py-1.5 rounded-full bg-blue-600/90 text-white text-xs font-extrabold flex items-center gap-1.5 backdrop-blur-md shadow-lg border border-blue-400/40">
            <ShieldCheck size={16} weight="fill" />
            <span>Blue Shield Verified Partner</span>
          </div>
        </div>
      </div>

      {/* ── PROFILE HEADER & CREDENTIALS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={agency.logoUrl}
              alt={agency.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
            />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wide">
                  {agency.type || 'DMC Partner'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Member since {agency.joinedDate || '2024'}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight flex items-center gap-2 flex-wrap">
                <span>{agency.name}</span>
                {agency.verified && (
                  <InstagramVerifiedBadge size={24} title="Verified Partner Agency" />
                )}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-600 font-medium flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{agency.location}</span>
                </span>
                <a href="#reviews" className="flex items-center gap-1 text-amber-500 font-bold hover:underline">
                  <Star size={14} weight="fill" />
                  <span>{avgRating} ({totalReviews} Verified Reviews)</span>
                </a>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <Medal size={14} weight="fill" />
                  <span>Licensed Ground Operator</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {agency.whatsapp && (
              <a
                href={`https://wa.me/${agency.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(agency.name)},%20I%20saw%20your%20verified%20storefront%20on%20Triiply.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <WhatsappLogo size={18} weight="fill" />
                <span>WhatsApp Direct</span>
              </a>
            )}

            <button
              onClick={() => setShowReviewModal(true)}
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} weight="bold" />
              <span>Write Review</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── AGENCY OVERVIEW & CREDENTIALS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid lg:grid-cols-3 gap-8">
        
        {/* Bio & Mission */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            About {agency.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {agency.bio || `${agency.name} is a licensed Destination Management Company operating premium holiday packages, custom FIT group transfers, VIP concierge services, and verified excursions with experienced multilingual guides.`}
          </p>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Destinations &amp; Territories Handled
            </h3>
            <div className="flex flex-wrap gap-2">
              {agency.primaryDestinations?.map((dest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <MapPin size={12} className="text-blue-600" />
                  <span>{dest}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Credentials Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
            <ShieldCheck size={18} weight="fill" />
            <span>Compliance Verification</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Commercial License:</span>
              <span className="font-bold text-slate-900 font-mono">{agency.licenseNumber || 'LIC-DXB-984210'}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Office Location:</span>
              <span className="font-bold text-slate-900">{agency.location}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Verification Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle size={14} weight="fill" />
                <span>Active Blue Shield</span>
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium">Avg. Response Time:</span>
              <span className="font-bold text-blue-600">&lt; 2 Hours</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── PACKAGES SHOWCASE (FULL WIDTH) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-slate-900">
              Published Holiday Packages &amp; Itineraries
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore verified tours operated directly on the ground by {agency.name}.
            </p>
          </div>

          <Link
            to={`/holiday-packages?agencyId=${agency.id}`}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View all packages</span>
            <CaretRight size={12} weight="bold" />
          </Link>
        </div>

        {agencyPackages.length > 0 ? (
          <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencyPackages.slice(0, visiblePackages).map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  <span className="absolute top-3 left-3 bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow">
                    {pkg.theme || pkg.category}
                  </span>

                  <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                    <MapPin size={14} className="text-sky-300" />
                    <span>{pkg.destination}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {pkg.duration}
                    </span>
                    <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mt-1">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {pkg.overview || pkg.highlights?.join(', ')}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col items-start gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Starting Price</span>
                      <span className="text-sm font-extrabold text-blue-700">{pkg.priceEstimate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                      <Link
                        to={`/holiday-packages?packageId=${pkg.id}`}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        Book Trip
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <LoadMoreButton visible={visiblePackages} total={agencyPackages.length} label="packages" onLoadMore={() => setVisiblePackages(count => count + 6)} />
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            <SuitcaseRolling size={40} weight="duotone" className="mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-slate-600">No public packages listed yet for this agency.</p>
            <p className="text-xs text-slate-400 mt-1">Check back soon or explore all available holiday packages.</p>
          </div>
        )}
      </div>

      {/* ── SHOWCASE PHOTOGRAPHY & MEDIA GALLERY ── */}
      <div id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Camera size={16} weight="fill" className="text-emerald-500" />
              <span>Media Assets &amp; Destination Portfolio</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Photographs Contributed by {agency.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              High-resolution ground photography, luxury houseboat &amp; resort captures, and curated destination visuals.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-700 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
            {galleryPhotos.length} {galleryPhotos.length === 1 ? 'Photograph' : 'Photographs'} in Portfolio
          </span>
        </div>

        {galleryPhotos.length > 0 ? (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPhotos.slice(0, visiblePhotos).map((photo) => (
              <div
                key={photo.id}
                onClick={() => setPreviewPhoto(photo)}
                className="group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:border-emerald-500 transition-all duration-300"
              >
                <div className="relative h-64 bg-slate-950 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                  {/* Category & Featured Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-white/15">
                      {photo.category}
                    </span>
                    {photo.featured && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <Sparkle size={12} weight="fill" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Action */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-2 rounded-xl bg-white/90 text-slate-900 backdrop-blur-md shadow-md flex items-center justify-center">
                      <Eye size={16} weight="bold" />
                    </span>
                  </div>

                  {/* Destination & Title on image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-xs text-sky-300 font-semibold mb-0.5">
                      <MapPin size={13} className="text-sky-300" />
                      <span>{photo.destination}</span>
                    </div>
                    <h4 className="font-heading text-base font-bold truncate group-hover:text-sky-200 transition-colors">
                      {photo.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  {photo.caption && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {photo.caption}
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
                      <span>Credit:</span>
                      <strong className="text-slate-800 font-bold truncate">{photo.credit}</strong>
                      <InstagramVerifiedBadge size={13} title="Official Verified Partner" />
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {photo.uploadDate || '2026-08'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <LoadMoreButton visible={visiblePhotos} total={galleryPhotos.length} label="photos" onLoadMore={() => setVisiblePhotos(count => count + 6)} />
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-400">
            <Camera size={40} weight="duotone" className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700">No showcase photographs published yet for {agency.name}.</p>
            <p className="text-xs text-slate-400 mt-1">High-resolution photography assets uploaded by this agency in the photo gallery will appear here.</p>
          </div>
        )}
      </div>

      {/* ── VERIFIED CUSTOMER REVIEWS SECTION ── */}
      <div id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-24 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Star size={16} weight="fill" className="text-amber-500" />
              <span>Verified Guest Reviews</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Customer Experiences with {agency.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Authentic reviews submitted by travelers who booked verified packages with this ground partner.
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} weight="bold" />
            <span>Write a Guest Review</span>
          </button>
        </div>

        {/* Rating Breakdown Scorecard */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Overall Score */}
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6 space-y-2">
            <div className="text-5xl font-black text-slate-900">
              {avgRating}
              <span className="text-xl text-slate-400 font-bold"> / 5.0</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} weight="fill" />
              ))}
            </div>

            <div className="text-xs font-bold text-slate-600">
              Based on {totalReviews} authenticated traveler ratings
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                <ShieldCheck size={14} weight="fill" />
                <span>100% Verified Bookings</span>
              </span>
            </div>
          </div>

          {/* Category Scores */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div className="text-lg font-black text-slate-900">5.0 ★</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase mt-1">Guide Service</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div className="text-lg font-black text-slate-900">4.9 ★</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase mt-1">Transfers</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div className="text-lg font-black text-slate-900">4.9 ★</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase mt-1">Hotel Stay</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div className="text-lg font-black text-slate-900">5.0 ★</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase mt-1">Value</div>
            </div>
          </div>

        </div>

        {/* Review Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedRatingFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRatingFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Reviews ({totalReviews})
            </button>

            <button
              onClick={() => setSelectedRatingFilter(5)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRatingFilter === 5
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              5 Stars ({star5Count})
            </button>

            {star4Count > 0 && (
              <button
                onClick={() => setSelectedRatingFilter(4)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRatingFilter === 4
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                4 Stars ({star4Count})
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-blue-600 font-extrabold">{filteredReviews.length}</span> verified experiences
          </div>
        </div>

        {/* Reviews List Feed */}
        <div>
          {filteredReviews.length > 0 ? (
            <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {filteredReviews.slice(0, visibleReviews).map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex h-full flex-col gap-4"
              >
                {/* Review Header: User Info & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={rev.travelerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={rev.travelerName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-bold text-sm text-slate-900">
                          {rev.travelerName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {rev.travelerCountry}
                        </span>
                        {rev.verifiedBooking && (
                          <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[11px] font-bold">
                            <CheckCircle size={14} weight="fill" />
                            <span>Verified Stay</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                        <span>Traveled as {rev.tripType}</span>
                        <span>•</span>
                        <span>{rev.reviewDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} size={16} weight="fill" />
                    ))}
                  </div>
                </div>

                {/* Package Tag & Review Title */}
                <div>
                  <div className="text-[11px] font-bold text-blue-600 mb-1 flex items-center gap-1">
                    <SuitcaseRolling size={13} />
                    <span>Package: {rev.packageTitle}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    "{rev.reviewTitle}"
                  </h3>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {rev.comment}
                </p>

                {/* Partner Official Response (if present) */}
                {rev.agencyResponse && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5 mt-3">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                      <div className="flex items-center gap-1.5">
                        <ChatDots size={16} className="text-blue-600" />
                        <span>Response from {agency.name}</span>
                      </div>
                      <span className="text-[11px] text-blue-600 font-medium">{rev.agencyResponse.date}</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      "{rev.agencyResponse.message}"
                    </p>
                    <div className="text-[10px] text-blue-600 font-bold pt-1">
                      — {rev.agencyResponse.responderName}
                    </div>
                  </div>
                )}

                {/* Helpful Button Bar */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px]">Was this review helpful?</span>

                  <button
                    onClick={() => handleVoteHelpful(rev.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ThumbsUp size={14} />
                    <span>Helpful ({rev.helpfulCount || 0})</span>
                  </button>
                </div>

              </div>
            ))}
            </div>
            <div className="mt-6">
              <LoadMoreButton visible={visibleReviews} total={filteredReviews.length} label="reviews" onLoadMore={() => setVisibleReviews(count => count + 6)} />
            </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              <Star size={36} weight="duotone" className="mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-600">No reviews found for this filter.</p>
              <button
                onClick={() => setSelectedRatingFilter('ALL')}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── WRITE A REVIEW MODAL ── */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star size={20} weight="fill" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-slate-900">
                    Review {agency.name}
                  </h3>
                  <p className="text-xs text-slate-500">Share your verified holiday experience</p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle size={36} weight="fill" />
                </div>
                <h4 className="font-heading font-bold text-lg text-slate-900">Thank You For Your Review!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your feedback has been published to {agency.name}'s verified partner storefront.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateReview} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <Warning size={16} weight="fill" className="text-rose-500 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Rating Stars Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setNewReviewForm({ ...newReviewForm, rating: starValue })}
                        className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          size={28}
                          weight="fill"
                          className={starValue <= newReviewForm.rating ? 'text-amber-500' : 'text-slate-200'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">
                      {newReviewForm.rating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jessica Miller"
                      value={newReviewForm.travelerName}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, travelerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Country / City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Canada"
                      value={newReviewForm.travelerCountry}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, travelerCountry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Trip Type</label>
                    <select
                      value={newReviewForm.tripType}
                      onChange={(e: any) => setNewReviewForm({ ...newReviewForm, tripType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Couple">Couple / Honeymoon</option>
                      <option value="Family">Family Holiday</option>
                      <option value="Friends">Friends Group</option>
                      <option value="Solo">Solo Travel</option>
                      <option value="Business">Corporate / Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Package / Tour</label>
                    <input
                      type="text"
                      placeholder="e.g. 5D Dubai Desert Tour"
                      value={newReviewForm.packageTitle}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, packageTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Incredible private tour, exceeded all expectations!"
                    value={newReviewForm.reviewTitle}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, reviewTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Feedback *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your tour guides, hotels, vehicles, and overall experience..."
                    value={newReviewForm.comment}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Verified Review</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Package Detail Modal for inspecting individual tours */}
      <PackageDetailModal
        packageData={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onOpenRegister={() => {}}
      />

      {/* ── PHOTOGRAPH FULLSCREEN LIGHTBOX MODAL ── */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative text-white">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={previewPhoto.imageUrl}
                alt={previewPhoto.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {previewPhoto.category} • {previewPhoto.destination}
                </span>
                <h3 className="font-heading text-xl font-bold mt-1.5">{previewPhoto.title}</h3>
                {previewPhoto.caption && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{previewPhoto.caption}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-400">Photo Credit</p>
                <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-end mt-0.5">
                  <span>{previewPhoto.credit || agency.name}</span>
                  <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
