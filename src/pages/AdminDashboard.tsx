import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Buildings,
  Package,
  SignOut,
  CheckCircle,
  XCircle,
  Warning,
  MagnifyingGlass,
  Check,
  X,
  Clock,
  Eye,
  WarningCircle,
  Camera,
  Megaphone,
  Plus,
  Trash,
  PencilSimple,
  Sparkle,
  ArrowSquareOut,
  Tag,
  Calendar,
  Sliders,
  Percent,
  Compass,
  CurrencyDollar,
  Info,
  ChatCenteredDots,
  Star,
  PaperPlaneTilt,
  ArrowRight,
  Receipt,
  SuitcaseRolling,
  Users,
  Printer,
  DownloadSimple,
  CreditCard,
  WhatsappLogo,
  Phone,
  Envelope,
  MapPin,
  Bed,
  SealCheck,
  House,
  CaretDown,
  CaretUp,
  CaretLeft,
  CaretRight,
  Bell,
  SquaresFour,
  Heart,
  ChatCircle,
  Gear
} from '@phosphor-icons/react';
import { TriiplyLogo } from '../components/TriiplyLogo';
import { S3ImageUploader } from '../components/S3ImageUploader';
import { InstagramVerifiedBadge } from '../components/InstagramVerifiedBadge';
import { HomepageEditor } from '../components/admin/HomepageEditor';
import { getSecureSession, clearSecureSession, sanitizeInput } from '../utils/security';
import {
  getAgencies,
  getGalleryPhotos,
  getPromotions,
  getBookings,
  saveAgencies,
  saveBookings,
  addBooking,
  cancelBooking,
  exportDataToCSV,
  updateAgencyVerification,
  addGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  addPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionActive
} from '../data/mockData';
import {
  getSecurePackages,
  deleteSecurePackage,
  moderateSecurePackage,
  toggleFeatureSecurePackage
} from '../data/packageService';
import { AgencyPartner, TravelPackage, GalleryPhoto, PromotionalCampaign, PhotoCategory, PromoPlacement, PackageStatus, CustomerBooking, BookingStatus } from '../types';
import { TravelPackageFormWizard } from '../components/TravelPackageFormWizard';
import { PackageDetailModal } from '../components/PackageDetailModal';
import { AdminBookingModal } from '../components/AdminBookingModal';
import { LoadMoreButton } from '../components/LoadMoreButton';
import { api } from '../services/api';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastState {
  message: string;
  type: ToastType;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSecureSession();

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/login');
    }
  }, [session, navigate]);

  // Compute Active Tab from URL Sub-Route (Deep Linking)
  const getTabFromPath = (): 'console' | 'bookings' | 'packages' | 'photos' | 'promotions' | 'agencies' | 'homepage' => {
    const path = location.pathname.toLowerCase().replace(/^\/admin\/?/, '').split('/')[0] || '';
    if (path === 'homepage' || path === 'cms') return 'homepage';
    if (path === 'bookings' || path === 'booking' || path === 'orders') return 'bookings';
    if (path === 'packages' || path === 'package' || path === 'itineraries') return 'packages';
    if (path === 'photos' || path === 'photo' || path === 'gallery') return 'photos';
    if (path === 'promotions' || path === 'promotion' || path === 'promo' || path === 'coupons') return 'promotions';
    if (path === 'agencies' || path === 'agency' || path === 'partners' || path === 'verification') return 'agencies';
    return 'console';
  };

  const activeTab = getTabFromPath();

  const handleTabChange = (tabId: string) => {
    setSearchQuery('');
    if (tabId === 'console') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  // Data States
  const [agenciesList, setAgenciesList] = useState<AgencyPartner[]>(getAgencies());
  const [packagesList, setPackagesList] = useState<TravelPackage[]>(getSecurePackages(session));
  const [photosList, setPhotosList] = useState<GalleryPhoto[]>(getGalleryPhotos());
  const [promotionsList, setPromotionsList] = useState<PromotionalCampaign[]>(getPromotions());
  const [bookingsList, setBookingsList] = useState<CustomerBooking[]>(getBookings());

  // Bookings Filter & Inspection States
  const [bookingFilterStatus, setBookingFilterStatus] = useState<'all' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('all');
  const [bookingFilterPayment, setBookingFilterPayment] = useState<'all' | 'DEPOSIT_20' | 'FULL_PAY' | 'HOLD_CARD'>('all');
  const [bookingFilterAgency, setBookingFilterAgency] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<CustomerBooking | null>(null);
  const [cancelPromptBooking, setCancelPromptBooking] = useState<CustomerBooking | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState<string>('Customer requested reservation cancellation via Admin Desk.');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState<'all' | 'SUBMITTED' | 'CORRECTION_REQUIRED' | 'APPROVED' | 'REJECTED' | 'DRAFT'>('all');
  const [packageAgencyFilter, setPackageAgencyFilter] = useState<string>('all');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState<string>('All');
  const [promoPlacementFilter, setPromoPlacementFilter] = useState<string>('All');
  const [visiblePhotoCards, setVisiblePhotoCards] = useState(6);
  const [visiblePromotionCards, setVisiblePromotionCards] = useState(6);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Overview Console Interactive States (matching reference UI)
  const [overviewCategoryTab, setOverviewCategoryTab] = useState<'Most Popular' | 'Special Offers' | 'Near Me' | 'Pending Review'>('Most Popular');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(17);
  const destinationSliderRef = useRef<HTMLDivElement>(null);

  // Modals
  const [selectedAgency, setSelectedAgency] = useState<AgencyPartner | null>(null);
  const [showAgencyForm, setShowAgencyForm] = useState(false);
  const [isAddingAgency, setIsAddingAgency] = useState(false);
  const [agencyForm, setAgencyForm] = useState({
    name: '', type: 'Travel Agency' as AgencyPartner['type'], location: '', destinations: '',
    contactName: '', contactDesignation: '', contactEmail: '', contactPhone: '', contactWhatsapp: '',
    established: '', website: '', logoUrl: '', tagline: '', about: '', registeredAddress: '',
    panNumber: '', gstNumber: '', verified: true
  });
  const [previewPackage, setPreviewPackage] = useState<TravelPackage | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);

  // Package Form Wizard
  const [showPackageWizard, setShowPackageWizard] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);

  // Admin Direct Booking Manager Modal
  const [showAdminBookingModal, setShowAdminBookingModal] = useState(false);
  const [editingAdminBooking, setEditingAdminBooking] = useState<CustomerBooking | null>(null);

  // Correction Request Feedback Modal
  const [correctionTargetPackage, setCorrectionTargetPackage] = useState<TravelPackage | null>(null);
  const [correctionFeedback, setCorrectionFeedback] = useState<string>('');

  // Photo Create / Edit Modal
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    destination: '',
    category: 'Resorts & Villas' as PhotoCategory,
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    caption: '',
    credit: '',
    featured: true
  });

  // Promotional Campaign Create / Edit Modal
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoForm, setPromoForm] = useState({
    title: '',
    subtitle: '',
    badge: 'Limited Promo',
    discountText: 'Special B2B Rebate',
    promoCode: 'TRIP2026',
    placement: 'top_banner' as PromoPlacement,
    ctaText: 'Claim Offer',
    ctaLink: '/holiday-packages',
    bgGradient: 'from-blue-700 via-indigo-700 to-sky-600',
    terms: 'Valid for registered travel operators. Terms & conditions apply.',
    validUntil: '2026-12-31'
  });

  // Dynamic Colored Toast Notification System
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (msg: string, type: ToastType = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === msg ? null : prev));
    }, 3800);
  };

  // Sync state data on trigger
  const refreshData = () => {
    setAgenciesList(getAgencies());
    setPackagesList(getSecurePackages(session));
    setPhotosList(getGalleryPhotos());
    setPromotionsList(getPromotions());
    setBookingsList(getBookings());
  };

  useEffect(() => {
    api.getAgencies()
      .then(response => {
        saveAgencies(response.agencies);
        setAgenciesList(response.agencies);
      })
      .catch(error => console.warn('[AdminDashboard] Agency sync failed:', error));

    api.getBookings()
      .then(response => saveBookings(response.bookings))
      .catch(error => console.warn('[AdminDashboard] Booking sync failed:', error));

    const handleUpdate = () => refreshData();
    window.addEventListener('triiply_bookings_updated', handleUpdate);
    window.addEventListener('triiply_packages_updated', handleUpdate);
    window.addEventListener('triiply_agencies_updated', handleUpdate);
    return () => {
      window.removeEventListener('triiply_bookings_updated', handleUpdate);
      window.removeEventListener('triiply_packages_updated', handleUpdate);
      window.removeEventListener('triiply_agencies_updated', handleUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      clearSecureSession();
      navigate('/login', { replace: true });
    }
  };

  // ── AGENCY HANDLERS ──
  const handleToggleVerification = async (agencyId: string, verified: boolean) => {
    try {
      const updatedAgency = await updateAgencyVerification(agencyId, verified);
      refreshData();
      if (selectedAgency?.id === agencyId) setSelectedAgency(updatedAgency);
      showToast(`Agency verification status updated to ${verified ? 'Verified' : 'Unverified'}`, verified ? 'success' : 'warning');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update agency verification.', 'error');
    }
  };

  const handleAddAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingAgency(true);
    try {
      const response = await api.createAgency({
        ...agencyForm,
        destinations: agencyForm.destinations.split(',').map(item => item.trim()).filter(Boolean),
        about: agencyForm.about || agencyForm.tagline
      });
      const nextAgencies = [response.agency, ...agenciesList];
      saveAgencies(nextAgencies);
      setAgenciesList(nextAgencies);
      setShowAgencyForm(false);
      setAgencyForm({ name: '', type: 'Travel Agency', location: '', destinations: '', contactName: '', contactDesignation: '', contactEmail: '', contactPhone: '', contactWhatsapp: '', established: '', website: '', logoUrl: '', tagline: '', about: '', registeredAddress: '', panNumber: '', gstNumber: '', verified: true });
      showToast(`Agency "${response.agency.name}" added successfully.`, 'success');
    } catch (error: any) {
      showToast(error?.message || 'Failed to add agency.', 'error');
    } finally {
      setIsAddingAgency(false);
    }
  };

  // ── PACKAGE HANDLERS ──
  const handleApprovePackage = async (packageId: string) => {
    const res = await moderateSecurePackage(packageId, 'APPROVE', '', session);
    if (res.success) {
      refreshData();
      showToast('Package approved and published live.', 'success');
    } else {
      showToast(res.error || 'Failed to approve package.', 'error');
    }
  };

  const handleRejectPackage = async (packageId: string) => {
    if (!window.confirm('Are you sure you want to reject this package?')) return;
    const res = await moderateSecurePackage(packageId, 'REJECT', 'Package rejected by platform moderation desk.', session);
    if (res.success) {
      refreshData();
      showToast('Package marked as Rejected.', 'error');
    } else {
      showToast(res.error || 'Failed to reject package.', 'error');
    }
  };

  const handleOpenCorrectionModal = (pkg: TravelPackage) => {
    setCorrectionTargetPackage(pkg);
    setCorrectionFeedback('Please update the day-wise itinerary and clarify included hotel classifications.');
  };

  const handleSubmitCorrectionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTargetPackage) return;

    const res = await moderateSecurePackage(
      correctionTargetPackage.id,
      'REQUEST_CORRECTION',
      correctionFeedback,
      session
    );

    if (res.success) {
      refreshData();
      setCorrectionTargetPackage(null);
      setCorrectionFeedback('');
      showToast('Correction request and feedback sent to agency.', 'warning');
    } else {
      showToast(res.error || 'Failed to send correction request.', 'error');
    }
  };

  const handleToggleFeatured = async (packageId: string) => {
    const res = await toggleFeatureSecurePackage(packageId, session);
    if (res.success) {
      refreshData();
      showToast('Homepage featured status updated.', 'info');
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (window.confirm('Are you sure you want to permanently remove this travel package?')) {
      const res = await deleteSecurePackage(packageId, session);
      if (res.success) {
        refreshData();
        showToast('Travel package deleted from catalog.', 'error');
      } else {
        showToast(res.error || 'Failed to delete package.', 'error');
      }
    }
  };

  // ── PHOTOGRAPHS HANDLERS ──
  const handleOpenCreatePhoto = () => {
    setEditingPhotoId(null);
    const currentFeatured = photosList.filter(p => p.featured).length;
    setPhotoForm({
      title: '',
      destination: 'Maldives',
      category: 'Resorts & Villas',
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
      caption: '',
      credit: 'Triiply Official Partner',
      featured: currentFeatured < 5
    });
    setShowPhotoModal(true);
  };

  const handleOpenEditPhoto = (photo: GalleryPhoto) => {
    setEditingPhotoId(photo.id);
    setPhotoForm({
      title: photo.title,
      destination: photo.destination,
      category: photo.category,
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      credit: photo.credit,
      featured: photo.featured
    });
    setShowPhotoModal(true);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm('Delete this photograph from the global media asset showcase?')) {
      try {
        await deleteGalleryPhoto(photoId);
        refreshData();
        showToast('Photograph deleted from gallery.', 'error');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not delete photograph.', 'error');
      }
    }
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(photoForm.title).trim();
    const cleanDest = sanitizeInput(photoForm.destination).trim();
    const cleanUrl = photoForm.imageUrl.trim();

    if (!cleanTitle || !cleanDest || !cleanUrl) {
      alert('Please fill out photo title, destination, and high-resolution image URL.');
      return;
    }

    // Strict Ruling: Enforce Maximum 5 Featured Photos across the entire platform
    if (photoForm.featured) {
      const currentFeaturedCount = photosList.filter(
        p => p.featured && p.id !== editingPhotoId
      ).length;

      if (currentFeaturedCount >= 5) {
        alert('Strict Limit Reached: Exactly 5 featured photos are allowed on the homepage showcase. Please uncheck "Feature in Showcase" on an existing photo first.');
        return;
      }
    }

    if (editingPhotoId) {
      const existing = photosList.find(p => p.id === editingPhotoId);
      const updated: GalleryPhoto = {
        ...existing!,
        id: editingPhotoId,
        title: cleanTitle,
        destination: cleanDest,
        category: photoForm.category,
        imageUrl: cleanUrl,
        caption: sanitizeInput(photoForm.caption).trim(),
        credit: sanitizeInput(photoForm.credit).trim() || 'Triiply Partner',
        featured: photoForm.featured
      };
      try {
        await updateGalleryPhoto(updated);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not update photograph.', 'error');
        return;
      }
      showToast('Photograph asset updated successfully.', 'success');
    } else {
      const newPhoto: GalleryPhoto = {
        id: `photo-${Date.now()}`,
        title: cleanTitle,
        destination: cleanDest,
        category: photoForm.category,
        imageUrl: cleanUrl,
        caption: sanitizeInput(photoForm.caption).trim(),
        credit: sanitizeInput(photoForm.credit).trim() || 'Triiply Partner',
        featured: photoForm.featured,
        uploadDate: new Date().toISOString().slice(0, 10)
      };
      try {
        await addGalleryPhoto(newPhoto);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not create photograph.', 'error');
        return;
      }
      showToast('New photograph uploaded to showcase gallery.', 'success');
    }

    setShowPhotoModal(false);
    refreshData();
  };

  const handleToggleFeaturedPhoto = async (photoId: string) => {
    const target = photosList.find(p => p.id === photoId);
    if (!target) return;

    if (!target.featured) {
      const currentFeaturedCount = photosList.filter(p => p.featured).length;
      if (currentFeaturedCount >= 5) {
        showToast('Strict Limit: Maximum 5 featured showcase photos allowed. Un-feature an existing photo first.', 'warning');
        return;
      }
    }

    const updated: GalleryPhoto = { ...target, featured: !target.featured };
    try {
      await updateGalleryPhoto(updated);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update photograph.', 'error');
      return;
    }
    refreshData();
    showToast(`Photo "${target.title}" ${!target.featured ? 'marked as Featured (1 of 5)' : 'removed from Featured'}.`, !target.featured ? 'success' : 'warning');
  };

  // ── PROMOTIONAL INFORMATION HANDLERS ──
  const handleOpenCreatePromo = () => {
    setEditingPromoId(null);
    setPromoForm({
      title: '',
      subtitle: '',
      badge: 'Limited Promo',
      discountText: 'Special B2B Rebate',
      promoCode: 'B2BDEAL',
      placement: 'top_banner',
      active: true,
      validUntil: '2026-12-31',
      ctaText: 'Explore Packages',
      ctaLink: '/#packages',
      bgGradient: 'from-blue-700 via-indigo-700 to-sky-600',
      terms: 'Valid on select tour packages booked directly with verified DMCs.'
    });
    setShowPromoModal(true);
  };

  const handleOpenEditPromo = (promo: PromotionalCampaign) => {
    setEditingPromoId(promo.id);
    setPromoForm({
      title: promo.title,
      subtitle: promo.subtitle,
      badge: promo.badge,
      discountText: promo.discountText,
      promoCode: promo.promoCode || '',
      placement: promo.placement,
      active: promo.active,
      validUntil: promo.validUntil,
      ctaText: promo.ctaText,
      ctaLink: promo.ctaLink,
      bgGradient: promo.bgGradient,
      terms: promo.terms || ''
    });
    setShowPromoModal(true);
  };

  const handleTogglePromo = async (promoId: string) => {
    try {
      await togglePromotionActive(promoId);
      refreshData();
      showToast('Promotion status updated.', 'info');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update promotion status.', 'error');
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    if (window.confirm('Are you sure you want to delete this promotional campaign?')) {
      try {
        await deletePromotion(promoId);
        refreshData();
        showToast('Promotional campaign deleted.', 'error');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not delete promotion.', 'error');
      }
    }
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(promoForm.title).trim();
    const cleanSub = sanitizeInput(promoForm.subtitle).trim();
    if (!cleanTitle || !cleanSub) {
      alert('Please provide a campaign title and subtitle description.');
      return;
    }

    if (editingPromoId) {
      const existing = promotionsList.find(p => p.id === editingPromoId);
      const updated: PromotionalCampaign = {
        ...existing!,
        id: editingPromoId,
        title: cleanTitle,
        subtitle: cleanSub,
        badge: sanitizeInput(promoForm.badge).trim() || 'Promo',
        discountText: sanitizeInput(promoForm.discountText).trim(),
        promoCode: sanitizeInput(promoForm.promoCode).trim(),
        placement: promoForm.placement,
        active: promoForm.active,
        validUntil: promoForm.validUntil,
        ctaText: sanitizeInput(promoForm.ctaText).trim() || 'Learn More',
        ctaLink: sanitizeInput(promoForm.ctaLink).trim() || '/',
        bgGradient: promoForm.bgGradient,
        terms: sanitizeInput(promoForm.terms).trim()
      };
      try {
        await updatePromotion(updated);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not update promotion.', 'error');
        return;
      }
      showToast('Promotional campaign updated successfully.', 'success');
    } else {
      const newPromo: PromotionalCampaign = {
        id: `promo-${Date.now()}`,
        title: cleanTitle,
        subtitle: cleanSub,
        badge: sanitizeInput(promoForm.badge).trim() || 'Special Offer',
        discountText: sanitizeInput(promoForm.discountText).trim(),
        promoCode: sanitizeInput(promoForm.promoCode).trim(),
        placement: promoForm.placement,
        active: promoForm.active,
        validUntil: promoForm.validUntil,
        ctaText: sanitizeInput(promoForm.ctaText).trim() || 'Learn More',
        ctaLink: sanitizeInput(promoForm.ctaLink).trim() || '/',
        bgGradient: promoForm.bgGradient,
        terms: sanitizeInput(promoForm.terms).trim(),
        impressions: 1,
        clicks: 0
      };
      try {
        await addPromotion(newPromo);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not publish promotion.', 'error');
        return;
      }
      showToast('New promotional campaign published live.', 'success');
    }

    setShowPromoModal(false);
    refreshData();
  };

  // ── BOOKINGS HANDLERS ──
  const handleUpdateBookingStatus = async (bookingId: string, nextStatus: BookingStatus) => {
    try {
      await api.updateBookingStatus(bookingId, nextStatus);
    } catch (error: any) {
      showToast(error.message || 'Could not update booking status.', 'error');
      return;
    }
    const list = getBookings();
    const updated = list.map(b => b.id === bookingId ? { ...b, status: nextStatus } : b);
    saveBookings(updated);
    refreshData();
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? { ...prev, status: nextStatus } : null);
    }
    const toastType: ToastType = nextStatus === 'CONFIRMED' ? 'success' : nextStatus === 'CANCELLED' ? 'error' : 'warning';
    showToast(`Booking ${bookingId} status updated to ${nextStatus}`, toastType);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm(`Are you sure you want to permanently remove reservation ${bookingId}?`)) {
      try {
        await api.deleteBooking(bookingId);
      } catch (error: any) {
        showToast(error.message || 'Could not delete booking.', 'error');
        return;
      }
      const list = getBookings();
      const updated = list.filter(b => b.id !== bookingId);
      saveBookings(updated);
      refreshData();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(null);
      }
      showToast(`Booking ${bookingId} permanently deleted.`, 'error');
    }
  };

  const handleConfirmAdminCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelPromptBooking) return;
    try {
      await api.updateBookingStatus(cancelPromptBooking.id, 'CANCELLED', cancelReasonInput);
    } catch (error: any) {
      showToast(error.message || 'Could not cancel booking.', 'error');
      return;
    }
    cancelBooking(cancelPromptBooking.id, cancelReasonInput);
    refreshData();
    if (selectedBooking && selectedBooking.id === cancelPromptBooking.id) {
      setSelectedBooking(prev => prev ? { ...prev, status: 'CANCELLED', notes: cancelReasonInput } : null);
    }
    setCancelPromptBooking(null);
    showToast(`Booking ${cancelPromptBooking.id} cancelled.`, 'error');
  };

  const handleSaveAdminBooking = async (savedBooking: CustomerBooking) => {
    try {
      await api.saveAdminBooking(savedBooking);
    } catch (error: any) {
      showToast(error.message || 'Could not save booking.', 'error');
      return;
    }
    const list = getBookings();
    const existingIndex = list.findIndex(b => b.id === savedBooking.id);
    if (existingIndex >= 0) {
      list[existingIndex] = savedBooking;
      saveBookings(list);
      showToast(`Reservation ${savedBooking.id} updated successfully.`, 'success');
    } else {
      addBooking(savedBooking);
      showToast(`Reservation ${savedBooking.id} created & confirmed.`, 'success');
    }
    setShowAdminBookingModal(false);
    setEditingAdminBooking(null);
    refreshData();
    setSelectedBooking(savedBooking);
  };

  const handleExportBookingsCSV = () => {
    const exportRows = filteredBookings.map(b => ({
      Booking_ID: b.id,
      Status: b.status,
      Guest_Name: b.leadGuest.fullName,
      Guest_Email: b.leadGuest.email,
      Guest_Phone: b.leadGuest.phone,
      Guest_Country: b.leadGuest.country || 'N/A',
      Package_Title: b.packageTitle,
      Destination: b.destination,
      Ground_DMC: b.agencyName,
      Travel_Date: b.travelDate,
      Return_Date: b.returnDate || 'N/A',
      Adults: b.pricing.adultsCount,
      Children: b.pricing.childrenCount,
      Infants: b.pricing.infantsCount || 0,
      Room_Tier: b.roomType,
      Payment_Mode: b.paymentMode,
      Total_Fare_USD: b.pricing.totalAmount,
      Deposit_Paid_USD: b.pricing.depositAmount || b.pricing.totalAmount,
      Discount_USD: b.pricing.discount || 0,
      Promo_Code: b.promoCode || 'N/A',
      Booking_Timestamp: b.bookingDate,
      Special_Requests: b.notes || b.leadGuest.specialRequests || ''
    }));
    exportDataToCSV(exportRows, 'triiply_customer_bookings');
    showToast('Customer bookings CSV exported successfully.', 'success');
  };

  // Calculations
  const pendingAgencies = agenciesList.filter(ag => !ag.verified);
  const pendingReviewPackages = packagesList.filter(p => (p.status || 'APPROVED') === 'SUBMITTED' || (p.status || 'APPROVED') === 'UNDER_REVIEW');
  const correctionPackages = packagesList.filter(p => (p.status || 'APPROVED') === 'CORRECTION_REQUIRED');
  const activePromotionsCount = promotionsList.filter(p => p.active).length;

  // Bookings Calculations
  const confirmedBookingsCount = bookingsList.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookingsCount = bookingsList.filter(b => b.status === 'PENDING').length;
  const cancelledBookingsCount = bookingsList.filter(b => b.status === 'CANCELLED').length;
  const totalGrossBookingVolume = bookingsList
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.pricing.totalAmount || 0), 0);
  const totalTravelersCount = bookingsList
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.pricing.adultsCount || 0) + (b.pricing.childrenCount || 0), 0);

  // Filtered Lists
  const filteredBookings = bookingsList.filter(booking => {
    const matchesStatus = bookingFilterStatus === 'all' || booking.status === bookingFilterStatus;
    const matchesPayment = bookingFilterPayment === 'all' || booking.paymentMode === bookingFilterPayment;
    const matchesAgency = bookingFilterAgency === 'all' || booking.agencyId === bookingFilterAgency;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (booking.id || '').toLowerCase().includes(q) ||
      (booking.leadGuest?.fullName || '').toLowerCase().includes(q) ||
      (booking.leadGuest?.email || '').toLowerCase().includes(q) ||
      (booking.leadGuest?.phone || '').toLowerCase().includes(q) ||
      (booking.destination || '').toLowerCase().includes(q) ||
      (booking.packageTitle || '').toLowerCase().includes(q) ||
      (booking.agencyName || '').toLowerCase().includes(q);

    return matchesStatus && matchesPayment && matchesAgency && matchesSearch;
  });

  const filteredAgencies = agenciesList.filter(ag =>
    (ag.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ag.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPackages = packagesList.filter(pkg => {
    const pkgStatus = pkg.status || 'APPROVED';
    const matchesStatus = packageFilter === 'all' || pkgStatus === packageFilter;
    const matchesAgency = packageAgencyFilter === 'all' || pkg.agencyId === packageAgencyFilter;
    const matchesSearch = (pkg.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.agencyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesAgency && matchesSearch;
  });

  const filteredPhotos = photosList.filter(photo => {
    const matchesSearch = (photo.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.credit || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = photoCategoryFilter === 'All' || photo.category === photoCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredPromotions = promotionsList.filter(promo => {
    const matchesSearch = (promo.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.promoCode && promo.promoCode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlacement = promoPlacementFilter === 'All' || promo.placement === promoPlacementFilter;
    return matchesSearch && matchesPlacement;
  });

  useEffect(() => {
    setVisiblePhotoCards(6);
    setVisiblePromotionCards(6);
  }, [searchQuery, photoCategoryFilter, promoPlacementFilter, activeTab]);


  if (!session || session.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 animate-pulse">
          <ShieldCheck className="w-8 h-8" weight="duotone" />
        </div>
        <h2 className="text-xl font-bold mb-2">Authenticating Administrative Session...</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          Verifying platform administrator credentials. If you are not redirected automatically, please log in with your Super Admin credentials.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">

      {/* ── TOP NAV BAR ── */}
      <nav className="bg-slate-950 text-white border-b border-slate-850 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <TriiplyLogo className="h-8" variant="white" showTagline={false} />
          <span className="h-5 w-[1px] bg-slate-850"></span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Super Administrator Workspace
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-sky-400 bg-sky-950/50 border border-sky-900/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Root Admin</span>
          </span>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
            title="Log Out Session"
            aria-label="Log Out Session"
          >
            <SignOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ── WORKSPACE SHELL ── */}
      <div className="flex-1 flex flex-col md:flex-row">

        {/* MOBILE NAVIGATION DROPDOWN (Shown on < md) */}
        <div className="block md:hidden bg-slate-950 border-b border-slate-800 p-3 relative z-30">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Super Admin Console</p>
            <span className="text-[10px] font-mono text-emerald-400">ROOT_PRIVILEGE</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(prev => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-slate-850 transition-all"
              aria-expanded={isMobileNavOpen}
              aria-label="Toggle navigation menu"
            >
              <div className="flex items-center gap-2.5">
                {(() => {
                  const tabs = [
                    { id: 'console', name: 'Overview Console', icon: Buildings },
                    { id: 'homepage', name: 'Homepage Editor', icon: House, badge: 'CMS' },
                    { id: 'bookings', name: 'Customer Bookings', icon: Receipt, badge: bookingsList.length.toString() },
                    { id: 'packages', name: 'Travel Packages', icon: Package, badge: pendingReviewPackages.length > 0 ? `${pendingReviewPackages.length} New` : packagesList.length.toString() },
                    { id: 'photos', name: 'Photographs Gallery', icon: Camera, badge: photosList.length.toString() },
                    { id: 'promotions', name: 'Promotional Info & Banners', icon: Megaphone, badge: activePromotionsCount.toString() },
                    { id: 'agencies', name: 'Agency Verifications', icon: ShieldCheck, badge: pendingAgencies.length.toString() },
                  ];
                  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
                  const Icon = currentTab.icon;
                  return (
                    <>
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-100">{currentTab.name}</span>
                    </>
                  );
                })()}
              </div>

              <div className="flex items-center gap-2">
                {(() => {
                  const tabs = [
                    { id: 'console', name: 'Overview Console', icon: Buildings },
                    { id: 'homepage', name: 'Homepage Editor', icon: House, badge: 'CMS' },
                    { id: 'bookings', name: 'Customer Bookings', icon: Receipt, badge: bookingsList.length.toString() },
                    { id: 'packages', name: 'Travel Packages', icon: Package, badge: pendingReviewPackages.length > 0 ? `${pendingReviewPackages.length} New` : packagesList.length.toString() },
                    { id: 'photos', name: 'Photographs Gallery', icon: Camera, badge: photosList.length.toString() },
                    { id: 'promotions', name: 'Promotional Info & Banners', icon: Megaphone, badge: activePromotionsCount.toString() },
                    { id: 'agencies', name: 'Agency Verifications', icon: ShieldCheck, badge: pendingAgencies.length.toString() },
                  ];
                  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
                  if (currentTab.badge && currentTab.badge !== '0') {
                    return (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        {currentTab.badge}
                      </span>
                    );
                  }
                  return null;
                })()}
                {isMobileNavOpen ? <CaretUp className="w-4 h-4 text-slate-400" /> : <CaretDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Dropdown Options */}
            {isMobileNavOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {[
                  { id: 'console', name: 'Overview Console', icon: Buildings },
                  { id: 'homepage', name: 'Homepage Editor', icon: House, badge: 'CMS' },
                  { id: 'bookings', name: 'Customer Bookings', icon: Receipt, badge: bookingsList.length.toString() },
                  { id: 'packages', name: 'Travel Packages', icon: Package, badge: pendingReviewPackages.length > 0 ? `${pendingReviewPackages.length} New` : packagesList.length.toString() },
                  { id: 'photos', name: 'Photographs Gallery', icon: Camera, badge: photosList.length.toString() },
                  { id: 'promotions', name: 'Promotional Info & Banners', icon: Megaphone, badge: activePromotionsCount.toString() },
                  { id: 'agencies', name: 'Agency Verifications', icon: ShieldCheck, badge: pendingAgencies.length.toString() },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        handleTabChange(tab.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer leading-normal ${
                        isActive
                          ? 'bg-blue-600 text-white font-extrabold shadow-md'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-semibold">{tab.name}</span>
                      </div>
                      {tab.badge && tab.badge !== '0' && (
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full leading-none ${
                            isActive ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP SIDEBAR NAVIGATION (Shown on md+) */}
        <aside className="hidden md:flex w-64 bg-[#0e131f] text-slate-300 flex-col border-r border-slate-850 shrink-0">
          <div className="p-4 border-b border-slate-850/60 flex items-center justify-between">
            <TriiplyLogo className="h-6" variant="white" showTagline={false} />
            <span className="text-[10px] font-black bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              B2B PRO
            </span>
          </div>

          <nav className="flex-1 p-3 space-y-1.5 text-xs font-semibold">
            {[
              { id: 'console', name: 'Dashboard', icon: SquaresFour },
              { id: 'homepage', name: 'Homepage Editor', icon: House, badge: 'CMS' },
              { id: 'bookings', name: 'Customer Bookings', icon: Receipt, badge: bookingsList.length.toString() },
              { id: 'packages', name: 'My Packages', icon: Package, badge: pendingReviewPackages.length > 0 ? `${pendingReviewPackages.length} New` : packagesList.length.toString() },
              { id: 'photos', name: 'Photographs Gallery', icon: Camera, badge: photosList.length.toString() },
              { id: 'promotions', name: 'Promotions & Banners', icon: Megaphone, badge: activePromotionsCount.toString() },
              { id: 'agencies', name: 'Agency Verifications', icon: ShieldCheck, badge: pendingAgencies.length.toString() },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer leading-normal ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950 font-black' : 'text-slate-400'}`} weight={isActive ? 'fill' : 'regular'} />
                    <span className="leading-normal">{tab.name}</span>
                  </div>
                  {tab.badge && tab.badge !== '0' && (
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full leading-none ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-lime-400 text-slate-950'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-850 flex items-center justify-between text-xs font-semibold">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors"
            >
              <SignOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
            <span className="text-[10px] font-mono text-emerald-400">ROOT_PRIVILEGE</span>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">

          {/* ══════════════════════════════════════════════════════════════
              TAB 1: OVERVIEW CONSOLE (High-End Agency & Admin Portal)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'console' && (
            <div className="space-y-6 animate-in fade-in duration-200">

              {/* TWO-COLUMN GRID: Main Content (8 cols) + Right Widget Sidebar (4 cols) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                {/* ── LEFT & CENTER WORKSPACE (xl:col-span-8) ── */}
                <div className="xl:col-span-8 space-y-6">

                  {/* 1. Main Interactive White Canvas */}
                  <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">

                    {/* Top Search & Profile Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      
                      {/* Search Bar with Dark Action Pill Button */}
                      <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                        <MagnifyingGlass className="w-5 h-5 text-slate-400 ml-2.5 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search for your favorite packages, bookings or DMCs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (searchQuery.trim()) {
                              handleTabChange('packages');
                            }
                          }}
                          className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                        >
                          Search
                        </button>
                      </div>

                      {/* Right Action Icons: Notification Bell & Profile Pill */}
                      <div className="flex items-center justify-end gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => showToast('All notifications are up to date.', 'info')}
                          className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center relative cursor-pointer transition-colors"
                          title="View Notifications"
                        >
                          <Bell size={18} weight="bold" />
                          <span className="w-2 h-2 rounded-full bg-lime-500 absolute top-2.5 right-2.5 ring-2 ring-white"></span>
                        </button>

                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                            alt="Apex Travel"
                            className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="text-left">
                            <p className="text-xs font-black text-slate-900 leading-none flex items-center gap-1">
                              <span>Apex Travel</span>
                              <InstagramVerifiedBadge size={13} title="Verified Root Partner" />
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Verified Partner</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Greeting Header */}
                    <div className="space-y-1">
                      <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Hello Apex Travel!</span>
                        <InstagramVerifiedBadge size={22} title="Verified Partner Agency" />
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        Welcome back and explore direct traveler inquiries worldwide.
                      </p>
                    </div>

                    {/* ── Easy Visa Destinations (Horizontal Carousel / Slider) ── */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                          Easy Visa Destinations
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              destinationSliderRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
                            }}
                            className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Scroll Left"
                          >
                            <CaretLeft size={14} weight="bold" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              destinationSliderRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
                            }}
                            className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Scroll Right"
                          >
                            <CaretRight size={14} weight="bold" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTabChange('destinations' in {} ? 'console' : 'homepage')}
                            className="text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline ml-1 cursor-pointer"
                          >
                            View All
                          </button>
                        </div>
                      </div>

                      {/* Slider Row */}
                      <div
                        ref={destinationSliderRef}
                        className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
                      >
                        {[
                          {
                            id: 'ev-1',
                            name: 'Bali, Indonesia',
                            badge: 'Top Seller',
                            price: '₹ 19,800',
                            img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
                          },
                          {
                            id: 'ev-2',
                            name: 'Dubai, UAE',
                            price: '₹ 21,700',
                            img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
                          },
                          {
                            id: 'ev-3',
                            name: 'Maldives Islands',
                            price: '₹ 11,300',
                            img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80'
                          },
                          {
                            id: 'ev-4',
                            name: 'Kashmir Valleys',
                            badge: 'Trending',
                            price: '₹ 14,500',
                            img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
                          },
                          {
                            id: 'ev-5',
                            name: 'Switzerland Alps',
                            price: '₹ 45,000',
                            img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
                          },
                          {
                            id: 'ev-6',
                            name: 'Sukhothai Old City',
                            price: '₹ 18,200',
                            img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80'
                          }
                        ].map((dest) => (
                          <div
                            key={dest.id}
                            className="min-w-[210px] sm:min-w-[230px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 text-white relative group shadow-sm shrink-0 cursor-pointer hover:shadow-md transition-all"
                            onClick={() => {
                              setSearchQuery(dest.name.split(',')[0]);
                              handleTabChange('packages');
                            }}
                          >
                            <div className="h-32 w-full relative overflow-hidden">
                              <img
                                src={dest.img}
                                alt={dest.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                              
                              {dest.badge && (
                                <span className="absolute top-2.5 right-2.5 bg-lime-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wide shadow-sm">
                                  {dest.badge}
                                </span>
                              )}
                            </div>

                            <div className="p-3.5 bg-slate-950 flex flex-col justify-between">
                              <p className="font-bold text-xs text-white truncate">{dest.name}</p>
                              <div className="flex items-center justify-between mt-1 text-[11px]">
                                <span className="text-slate-400 font-medium">Starting at</span>
                                <span className="font-extrabold text-lime-400">{dest.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Subcategory Tabs with Active Underline ── */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
                        {[
                          'Most Popular',
                          'Special Offers',
                          'Near Me',
                          'Pending Review'
                        ].map((cat) => {
                          const isActive = overviewCategoryTab === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setOverviewCategoryTab(cat as any)}
                              className={`pb-2 whitespace-nowrap transition-all cursor-pointer relative ${
                                isActive
                                  ? 'text-slate-900 font-black border-b-2 border-slate-900'
                                  : 'text-slate-400 hover:text-slate-700 font-semibold'
                              }`}
                            >
                              <span>{cat}</span>
                              {cat === 'Pending Review' && pendingReviewPackages.length > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                                  {pendingReviewPackages.length}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* ── 2x2 / 4-card Package Grid ── */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {(() => {
                          // Display appropriate packages matching category
                          let displayItems = packagesList;
                          if (overviewCategoryTab === 'Pending Review') {
                            displayItems = pendingReviewPackages.length > 0 ? pendingReviewPackages : packagesList;
                          } else if (overviewCategoryTab === 'Special Offers') {
                            displayItems = packagesList.slice(2, 6);
                          } else if (overviewCategoryTab === 'Near Me') {
                            displayItems = packagesList.filter(p => p.destination?.toLowerCase().includes('india') || p.destination?.toLowerCase().includes('kerala') || p.destination?.toLowerCase().includes('kashmir')).concat(packagesList).slice(0, 4);
                          } else {
                            displayItems = packagesList.slice(0, 4);
                          }

                          return displayItems.slice(0, 4).map((pkg) => (
                            <div
                              key={pkg.id}
                              className="p-3.5 bg-slate-950 text-white rounded-2xl border border-slate-800 flex items-center justify-between gap-3 group hover:border-slate-700 transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={pkg.imageUrl}
                                  alt={pkg.title}
                                  className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-xs sm:text-sm text-slate-100 truncate leading-snug">
                                    {pkg.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                                    <MapPin size={12} className="text-lime-400 shrink-0" />
                                    <span>{pkg.destination || 'Global Destination'}</span>
                                  </p>
                                  <p className="text-xs font-black text-lime-400 mt-1">
                                    {pkg.startingPrice ? `₹ ${pkg.startingPrice.toLocaleString()} / day` : (pkg.priceEstimate || '₹ 248 / day')}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setPreviewPackage(pkg)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-colors cursor-pointer"
                                  title="Inspect package itinerary in modal"
                                >
                                  Inspect
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPackage(pkg);
                                    setShowPackageWizard(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 text-[10px] font-black transition-colors cursor-pointer"
                                  title="Edit package wizard"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                  </div>

                  {/* 2. Platform Governance Fast Actions Bar */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-base font-black text-slate-900">
                        Platform Governance &amp; Publishing Tower
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Manage packages, direct client bookings, high-res photos, and promotional campaigns.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPackage(null);
                          setShowPackageWizard(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} weight="bold" />
                        <span>Publish Package</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAdminBooking(null);
                          setShowAdminBookingModal(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Receipt size={14} />
                        <span>New Booking</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Moderation Fast Action List */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 leading-snug">
                        <Clock className="w-4 h-4 text-sky-600" />
                        <span>Compliance Pipeline ({pendingReviewPackages.length} Pending Review)</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleTabChange('packages')}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        Open Pipeline
                      </button>
                    </div>

                    {pendingReviewPackages.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center leading-relaxed">
                        No packages pending compliance review. All verified.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {pendingReviewPackages.map((pkg) => (
                          <div key={pkg.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-semibold">
                            <div className="flex items-center gap-3.5">
                              <img src={pkg.imageUrl} alt={pkg.title} className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                              <div className="space-y-0.5">
                                <p className="font-bold text-slate-900 leading-snug">{pkg.title}</p>
                                <p className="text-[11px] text-slate-500 leading-normal flex items-center gap-1">
                                  <span>Partner: {pkg.agencyName}</span>
                                  {(pkg.agencyVerified ?? true) && (
                                    <InstagramVerifiedBadge size={13} title="Verified Partner Agency" />
                                  )}
                                  <span>• {pkg.destination} • {pkg.priceEstimate}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewPackage(pkg)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[10px] font-bold"
                              >
                                Inspect Itinerary
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenCorrectionModal(pkg)}
                                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold cursor-pointer"
                              >
                                Request Correction
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApprovePackage(pkg.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-sm cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* ── RIGHT WIDGET SIDE BAR (xl:col-span-4) ── */}
                <div className="xl:col-span-4 bg-[#0e131f] text-white rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-6 shadow-xl sticky top-20">

                  {/* 1. Interactive Calendar Widget */}
                  <div className="space-y-4">
                    
                    {/* Month Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                        {calendarDate.toLocaleString('default', { month: 'long' }).toUpperCase()} {calendarDate.getFullYear()}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Previous Month"
                        >
                          <CaretLeft size={14} weight="bold" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Next Month"
                        >
                          <CaretRight size={14} weight="bold" />
                        </button>
                      </div>
                    </div>

                    {/* Days of Week Row */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-500">
                      <span>SUN</span>
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                    </div>

                    {/* 30-Day Grid with Highlighted Lime Dates */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                      {/* Empty padding days if month starts later */}
                      <span></span>
                      <span></span>

                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                        const isSpecial14 = day === 14;
                        const isSpecial17 = day === 17;
                        const isSpecialEvent = isSpecial14 || isSpecial17;
                        const isSelected = selectedCalendarDay === day;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setSelectedCalendarDay(day);
                              if (isSpecialEvent) {
                                showToast(`Day ${day}: Confirmed tour departure scheduled with active travelers.`, 'success');
                              }
                            }}
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-[11px] transition-all cursor-pointer ${
                              isSpecialEvent
                                ? 'bg-lime-400 text-slate-950 font-black shadow-md scale-105'
                                : isSelected
                                ? 'bg-white text-slate-950 font-extrabold'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Bookings & Leads Feed Section */}
                  <div className="space-y-4 pt-3 border-t border-slate-850">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-extrabold text-xs sm:text-sm text-slate-100">
                        Bookings &amp; Leads
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleTabChange('bookings')}
                        className="text-xs font-bold text-lime-400 hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {/* Grouped by Year List */}
                    <div className="space-y-4 text-xs">
                      
                      {/* Year 2026 */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">2026</p>
                        
                        {/* Goa Express */}
                        <div
                          onClick={() => {
                            const b = bookingsList[0];
                            if (b) setSelectedBooking(b);
                          }}
                          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=120&q=80"
                              alt="Goa Express"
                              className="w-9 h-9 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-100 truncate">Goa Express</p>
                              <p className="text-[10px] text-slate-400 font-medium">18 Apr - 24 Apr</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-black shrink-0">
                            Confirmed
                          </span>
                        </div>

                        {/* Shimla Snows */}
                        <div
                          onClick={() => {
                            const b = bookingsList[1] || bookingsList[0];
                            if (b) setSelectedBooking(b);
                          }}
                          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=120&q=80"
                              alt="Shimla Snows"
                              className="w-9 h-9 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-100 truncate">Shimla Snows</p>
                              <p className="text-[10px] text-slate-400 font-medium">10 Jan - 15 Jan</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-sky-400 text-[9px] font-black shrink-0">
                            Pending
                          </span>
                        </div>
                      </div>

                      {/* Year 2025 */}
                      <div className="space-y-2 pt-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">2025</p>

                        {/* Andaman Cruise */}
                        <div
                          onClick={() => {
                            const b = bookingsList[2] || bookingsList[0];
                            if (b) setSelectedBooking(b);
                          }}
                          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=120&q=80"
                              alt="Andaman Cruise"
                              className="w-9 h-9 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-100 truncate">Andaman Cruise</p>
                              <p className="text-[10px] text-slate-400 font-medium">07 Feb - 12 Feb</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[9px] font-black shrink-0">
                            Completed
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 2: CUSTOMER BOOKINGS & RESERVATIONS LEDGER
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-in fade-in duration-200">

              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    <span>Customer Bookings &amp; Reservations Ledger</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Comprehensive ledger of traveler reservations, passenger details, payment authorized/deposited, assigned DMCs, and voucher issuance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportBookingsCSV}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <DownloadSimple className="w-4 h-4 text-blue-600" />
                    <span>Export CSV Report</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingAdminBooking(null);
                      setShowAdminBookingModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Customer Booking</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">{bookingsList.length}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{confirmedBookingsCount} confirmed</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Gross Booking Volume</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-emerald-600">₹{totalGrossBookingVolume.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">INR ₹</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Confirmed Active Trips</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-blue-600">{confirmedBookingsCount}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">100% Guaranteed</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Pending / Hold</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-amber-600">{pendingBookingsCount}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{cancelledBookingsCount} cancelled</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Travelers Hosted</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">{totalTravelersCount}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">Guests / Pax</span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-80">
                    <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Booking ID, Guest name, email, phone, trip..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value as any)}
                    className="w-full sm:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  {/* Payment Mode Filter */}
                  <select
                    value={bookingFilterPayment}
                    onChange={(e) => setBookingFilterPayment(e.target.value as any)}
                    className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Payment Modes</option>
                    <option value="DEPOSIT_20">20% Deposit</option>
                    <option value="FULL_PAY">Pay in Full</option>
                    <option value="HOLD_CARD">Free Hold</option>
                  </select>

                  {/* Agency Filter */}
                  <select
                    value={bookingFilterAgency}
                    onChange={(e) => setBookingFilterAgency(e.target.value)}
                    className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Partner DMCs</option>
                    {agenciesList.map(ag => (
                      <option key={ag.id} value={ag.id}>{ag.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto text-xs text-slate-500 font-semibold">
                  <span>Found <strong>{filteredBookings.length}</strong> bookings</span>
                  {(searchQuery || bookingFilterStatus !== 'all' || bookingFilterPayment !== 'all' || bookingFilterAgency !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setBookingFilterStatus('all');
                        setBookingFilterPayment('all');
                        setBookingFilterAgency('all');
                      }}
                      className="text-blue-600 font-bold hover:underline cursor-pointer ml-2"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Bookings Ledger Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredBookings.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 p-8 space-y-2">
                    <Receipt className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="font-heading font-bold text-slate-700 text-sm">No Customer Bookings Found</p>
                    <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-4.5">Booking Ref</th>
                          <th className="py-3.5 px-4.5">Lead Guest</th>
                          <th className="py-3.5 px-4.5">Holiday Package &amp; Destination</th>
                          <th className="py-3.5 px-4.5">Partner DMC</th>
                          <th className="py-3.5 px-4.5">Travel Date</th>
                          <th className="py-3.5 px-4.5">Guests</th>
                          <th className="py-3.5 px-4.5">Fare &amp; Mode</th>
                          <th className="py-3.5 px-4.5">Status</th>
                          <th className="py-3.5 px-4.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredBookings.map((b) => {
                          return (
                            <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Ref ID */}
                              <td className="py-4 px-4.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                                <span className="text-blue-600 block leading-snug">{b.id}</span>
                                <span className="text-[10px] text-slate-400 font-sans font-normal leading-normal block mt-0.5">
                                  {new Date(b.bookingDate).toLocaleDateString()}
                                </span>
                              </td>

                              {/* Lead Guest */}
                              <td className="py-4 px-4.5">
                                <p className="font-bold text-slate-900 leading-snug">{b.leadGuest.fullName}</p>
                                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{b.leadGuest.email}</p>
                                <p className="text-[10px] text-slate-400 leading-normal">{b.leadGuest.phone}</p>
                              </td>

                              {/* Package */}
                              <td className="py-4 px-4.5 max-w-[230px]">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={b.imageUrl}
                                    alt={b.packageTitle}
                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                  <div className="truncate">
                                    <p className="font-bold text-slate-900 truncate leading-snug" title={b.packageTitle}>{b.packageTitle}</p>
                                    <p className="text-[10px] text-blue-600 font-semibold leading-normal mt-0.5">{b.destination} • {b.duration}</p>
                                  </div>
                                </div>
                              </td>

                              {/* DMC */}
                              <td className="py-4 px-4.5 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-slate-800 leading-snug">{b.agencyName}</span>
                                  <InstagramVerifiedBadge size={14} title="Verified Operator" />
                                </div>
                                <span className="text-[10px] text-emerald-600 font-bold leading-normal block mt-0.5">✓ Verified Operator</span>
                              </td>

                              {/* Dates */}
                              <td className="py-4 px-4.5 whitespace-nowrap">
                                <span className="font-bold text-slate-900 block leading-snug">{b.travelDate}</span>
                                {b.returnDate && <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">until {b.returnDate}</span>}
                              </td>

                              {/* Guests */}
                              <td className="py-4 px-4.5 whitespace-nowrap">
                                <span className="font-bold text-slate-900 block leading-snug">
                                  {b.pricing.adultsCount} Ad {b.pricing.childrenCount > 0 ? `, ${b.pricing.childrenCount} Ch` : ''}
                                </span>
                                <span className="block text-[10px] text-slate-400 truncate max-w-[120px] leading-normal mt-0.5" title={b.roomType}>
                                  {b.roomType.replace(/\(Included\)/i, '')}
                                </span>
                              </td>

                              {/* Pricing */}
                              <td className="py-4 px-4.5 whitespace-nowrap">
                                <span className="font-extrabold text-slate-900 block text-sm leading-snug">
                                  ₹{b.pricing.totalAmount.toLocaleString('en-IN')}
                                </span>
                                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-1 leading-normal ${b.paymentMode === 'FULL_PAY'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.paymentMode === 'DEPOSIT_20'
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-amber-100 text-amber-800'
                                  }`}>
                                  {b.paymentMode === 'FULL_PAY' ? 'Full Paid' : b.paymentMode === 'DEPOSIT_20' ? '20% Token' : 'Free Hold'}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4.5 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full leading-normal ${b.status === 'CONFIRMED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                  }`}>
                                  {b.status}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedBooking(b)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                                    title="View Full Booking Voucher & Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setEditingAdminBooking(b);
                                      setShowAdminBookingModal(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                                    title="Edit Reservation Details & Rates"
                                  >
                                    <PencilSimple className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedBooking(b);
                                      setTimeout(() => window.print(), 200);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                    title="Print Travel Voucher"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>

                                  {b.status !== 'CONFIRMED' && (
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                                      title="Mark as Confirmed"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}

                                  {b.status !== 'CANCELLED' && (
                                    <button
                                      onClick={() => {
                                        setCancelPromptBooking(b);
                                        setCancelReasonInput('Reservation cancelled by admin moderation.');
                                      }}
                                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
                                      title="Cancel Reservation"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleDeleteBooking(b.id)}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                    title="Delete from Ledger"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: TRAVEL PACKAGES PIPELINE (SUPER ADMIN)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'packages' && (

            <div className="space-y-6 animate-in fade-in duration-200">

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">Travel Packages Management & Moderation</h3>
                  <p className="text-xs text-slate-500 font-medium">Global package governance: author itineraries, approve/reject submissions, send correction feedback, and feature packages.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingPackage(null);
                    setShowPackageWizard(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Author New Package</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search title, destination, agency..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={packageAgencyFilter}
                    onChange={(e) => setPackageAgencyFilter(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 w-full sm:w-auto"
                  >
                    <option value="all">All Agencies</option>
                    {agenciesList.map(ag => (
                      <option key={ag.id} value={ag.id}>{ag.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Pills */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'SUBMITTED', label: `Pending (${pendingReviewPackages.length})` },
                    { id: 'CORRECTION_REQUIRED', label: `Correction (${correctionPackages.length})` },
                    { id: 'APPROVED', label: 'Approved' },
                    { id: 'REJECTED', label: 'Rejected' },
                    { id: 'DRAFT', label: 'Drafts' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setPackageFilter(st.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${packageFilter === st.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Packages Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4.5">Package Itinerary</th>
                      <th className="py-3.5 px-4.5">Agency Partner</th>
                      <th className="py-3.5 px-4.5">B2B Rate Basis</th>
                      <th className="py-3.5 px-4.5">Duration &amp; Theme</th>
                      <th className="py-3.5 px-4.5">Approval Status</th>
                      <th className="py-3.5 px-4.5 text-right">Moderator Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredPackages.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                          No packages found matching search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((pkg) => {
                        const pkgStatus = pkg.status || 'APPROVED';

                        return (
                          <tr key={pkg.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-4.5 flex items-center gap-3">
                              <img
                                src={pkg.imageUrl}
                                alt={pkg.title}
                                className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-slate-900 leading-snug line-clamp-1">{pkg.title}</p>
                                  {pkg.featured && (
                                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shrink-0 leading-normal">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">{pkg.destination}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4.5">
                              <div className="flex items-center gap-1.5">
                                <p className="text-slate-800 font-bold leading-snug">{pkg.agencyName}</p>
                                {(pkg.agencyVerified ?? true) && (
                                  <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">{pkg.agencyType}</span>
                            </td>
                            <td className="py-4 px-4.5 text-blue-700 font-bold leading-snug">{pkg.priceEstimate}</td>
                            <td className="py-4 px-4.5 text-slate-600">
                              <p className="leading-snug font-bold text-slate-800">{pkg.duration}</p>
                              <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">{pkg.theme || pkg.category}</span>
                            </td>
                            <td className="py-4 px-4.5">
                              <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full leading-normal ${pkgStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                pkgStatus === 'SUBMITTED' || pkgStatus === 'UNDER_REVIEW' ? 'bg-sky-100 text-sky-800' :
                                  pkgStatus === 'CORRECTION_REQUIRED' ? 'bg-rose-100 text-rose-800' :
                                    pkgStatus === 'REJECTED' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                                }`}>
                                {pkgStatus.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-4 px-4.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleFeatured(pkg.id)}
                                className={`p-1.5 rounded-lg cursor-pointer transition-all ${pkg.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                                  }`}
                                title="Toggle Featured on Homepage"
                                aria-label="Toggle Featured on Homepage"
                              >
                                <Star className="w-4 h-4" weight="fill" />
                              </button>
                              <button
                                onClick={() => setPreviewPackage(pkg)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                                title="Inspect Day-Wise Itinerary"
                                aria-label="Inspect Day-Wise Itinerary"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingPackage(pkg);
                                  setShowPackageWizard(true);
                                }}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer"
                                title="Edit Full Package"
                                aria-label="Edit Full Package"
                              >
                                <PencilSimple className="w-4 h-4" />
                              </button>
                              {pkgStatus !== 'APPROVED' && (
                                <button
                                  onClick={() => handleApprovePackage(pkg.id)}
                                  className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                                  title="Approve Package"
                                  aria-label="Approve Package"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {pkgStatus !== 'CORRECTION_REQUIRED' && (
                                <button
                                  onClick={() => handleOpenCorrectionModal(pkg)}
                                  className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg cursor-pointer"
                                  title="Request Correction"
                                  aria-label="Request Correction"
                                >
                                  <ChatCenteredDots className="w-4 h-4" />
                                </button>
                              )}
                              {pkgStatus !== 'REJECTED' && (
                                <button
                                  onClick={() => handleRejectPackage(pkg.id)}
                                  className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                                  title="Reject Package"
                                  aria-label="Reject Package"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-lg cursor-pointer"
                                title="Delete Package"
                                aria-label="Delete Package"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: PHOTOGRAPHS & MEDIA GALLERY
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'photos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">Photographs & Media Gallery Hub</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage high-resolution destination photographs, resort visuals, and public showcase assets.</p>
                </div>

                <button
                  onClick={handleOpenCreatePhoto}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Photograph</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search photograph title, destination, credit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {['All', 'Resorts & Villas', 'Desert & Adventure', 'Alpine & Scenic', 'Beaches & Islands', 'Culture & Heritage'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPhotoCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${photoCategoryFilter === cat
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photographs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.slice(0, visiblePhotoCards).map((photo) => (
                  <div key={photo.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all">
                    <div className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewPhoto(photo)}>
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-white/10">
                          {photo.category}
                        </span>
                        {photo.featured && (
                          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <Sparkle className="w-2.5 h-2.5" weight="fill" /> Featured
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-[10px] text-sky-300 font-bold">{photo.destination}</p>
                        <h4 className="font-heading text-sm font-bold truncate">{photo.title}</h4>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {photo.caption && (
                          <p className="text-xs text-slate-500 line-clamp-2">{photo.caption}</p>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-2">
                          <span>Credit:</span>
                          <strong className="text-slate-800 font-bold">{photo.credit || 'Triiply Official Partner'}</strong>
                          <InstagramVerifiedBadge size={13} title="Official Verified Partner" />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">{photo.uploadDate}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleFeaturedPhoto(photo.id)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-all ${photo.featured
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                              }`}
                            title={photo.featured ? 'Remove from Homepage Featured (1 of 5)' : 'Feature on Homepage (Max 5)'}
                          >
                            <Star className="w-4 h-4" weight={photo.featured ? 'fill' : 'regular'} />
                          </button>
                          <button
                            onClick={() => setPreviewPhoto(photo)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Fullscreen View"
                            aria-label="Fullscreen View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditPhoto(photo)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Edit Photo"
                            aria-label="Edit Photo"
                          >
                            <PencilSimple className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete Photo"
                            aria-label="Delete Photo"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <LoadMoreButton visible={visiblePhotoCards} total={filteredPhotos.length} label="photos" onLoadMore={() => setVisiblePhotoCards(count => count + 6)} />
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 4: PROMOTIONAL INFORMATION & CAMPAIGNS
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'promotions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">Promotional Information & Announcement Banners</h3>
                  <p className="text-xs text-slate-500 font-medium">Deploy live announcements, seasonal surge discounts, Founding Partner offers, and hero deal banners.</p>
                </div>

                <button
                  onClick={handleOpenCreatePromo}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Campaign</span>
                </button>
              </div>

              {/* Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search promotion title, promo code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {['All', 'top_banner', 'hero_spotlight', 'package_deal'].map((plc) => (
                    <button
                      key={plc}
                      onClick={() => setPromoPlacementFilter(plc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${promoPlacementFilter === plc
                        ? 'bg-indigo-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {plc === 'All' ? 'All Placements' : plc.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promotions Cards (3 Cards Per Row on Desktop / Full Screen) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPromotions.slice(0, visiblePromotionCards).map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                  >
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wide truncate">
                          {promo.badge}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider truncate">
                          {promo.placement.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 border ${promo.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${promo.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {promo.active ? 'Live Banner' : 'Paused'}
                      </span>
                    </div>

                    {/* Banner Visual Preview */}
                    <div className={`p-5 rounded-2xl bg-gradient-to-r ${promo.bgGradient} text-white shadow-sm space-y-3 relative overflow-hidden`}>
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 tracking-wide">
                          {promo.discountText}
                        </span>
                        {promo.promoCode && (
                          <span className="text-xs font-mono font-bold bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20 tracking-wider">
                            {promo.promoCode}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-heading text-lg font-extrabold leading-snug tracking-tight text-white line-clamp-2">
                          {promo.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-white/90 mt-1 leading-relaxed line-clamp-2">
                          {promo.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between text-xs border-t border-white/20">
                        <span className="text-white/80 font-medium">
                          Valid: {promo.validUntil}
                        </span>
                        <span className="bg-white text-slate-900 font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0">
                          {promo.ctaText} <ArrowRight className="w-3.5 h-3.5 inline" />
                        </span>
                      </div>
                    </div>

                    {/* Details & Controls */}
                    <div className="space-y-3">
                      {promo.terms && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-150/80 line-clamp-2 leading-relaxed">
                          <strong className="text-slate-800 font-bold">Terms:</strong> {promo.terms}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {/* Analytics Stats */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md">{promo.impressions || 1} Views</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md">{promo.clicks || 0} Clicks</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleTogglePromo(promo.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${promo.active
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                              }`}
                          >
                            {promo.active ? 'Pause' : 'Activate'}
                          </button>

                          <button
                            onClick={() => handleOpenEditPromo(promo)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                            title="Edit Campaign"
                            aria-label="Edit Campaign"
                          >
                            <PencilSimple className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeletePromo(promo.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                            title="Delete Campaign"
                            aria-label="Delete Campaign"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <LoadMoreButton visible={visiblePromotionCards} total={filteredPromotions.length} label="promotions" onLoadMore={() => setVisiblePromotionCards(count => count + 6)} />
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 5: AGENCY VERIFICATIONS
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'agencies' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">Agency Identity Verifications</h3>
                  <p className="text-xs text-slate-500 font-medium">Verify credentials and toggle physical address validations.</p>
                </div>

                <div className="flex w-full sm:w-auto gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search agencies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button onClick={() => setShowAgencyForm(true)} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors whitespace-nowrap">
                    <Plus className="w-4 h-4" /> Add Agency
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4.5">Travel Partner</th>
                      <th className="py-3.5 px-4.5">HQ Location</th>
                      <th className="py-3.5 px-4.5">Specialization</th>
                      <th className="py-3.5 px-4.5">Blue Badge</th>
                      <th className="py-3.5 px-4.5 text-right">Verification Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredAgencies.map((ag) => (
                      <tr key={ag.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-4.5 flex items-center gap-3">
                          <img
                            src={ag.logoUrl}
                            alt={ag.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 leading-snug">{ag.name}</p>
                              {ag.verified && (
                                <InstagramVerifiedBadge size={16} title="Verified Partner Agency" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">{ag.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4.5 text-slate-600 leading-normal">{ag.location}</td>
                        <td className="py-4 px-4.5 text-slate-600 leading-normal">
                          {ag.destinations.slice(0, 2).join(', ')}
                          {ag.destinations.length > 2 && ' +'}
                        </td>
                        <td className="py-4 px-4.5">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full leading-normal ${ag.verified ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-amber-100 text-amber-800'
                            }`}>
                            {ag.verified ? (
                              <>
                                <InstagramVerifiedBadge size={12} title="Verified Partner" />
                                <span>Verified Partner</span>
                              </>
                            ) : (
                              <span>Unverified</span>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedAgency(ag)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[10px] font-bold cursor-pointer transition-colors leading-normal"
                          >
                            Review File
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── 7. HOMEPAGE CONTENT EDITOR ── */}
          {activeTab === 'homepage' && (
            <HomepageEditor showToast={showToast} />
          )}

        </main>
      </div>

      {/* ── 8-STEP TRAVEL PACKAGE FORM WIZARD MODAL ── */}
      {showPackageWizard && (
        <TravelPackageFormWizard
          initialData={editingPackage}
          session={session}
          onClose={() => {
            setShowPackageWizard(false);
            setEditingPackage(null);
          }}
          onSaved={(pkg) => {
            setShowPackageWizard(false);
            setEditingPackage(null);
            refreshData();
            showToast(`Package "${pkg.title}" published with status [${pkg.status || 'APPROVED'}]`);
          }}
        />
      )}

      {/* ── CORRECTION REQUEST MODAL ── */}
      {correctionTargetPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative text-slate-900 max-h-[90vh] h-auto flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-heading text-lg font-bold">Request Package Corrections</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Package: {correctionTargetPackage.title}</p>
              </div>
              <button onClick={() => setCorrectionTargetPackage(null)} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCorrectionRequest} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-6 space-y-4 text-xs font-semibold flex-1 overflow-y-auto">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <WarningCircle className="w-4 h-4 text-amber-600" />
                    <span>Correction Workflow Notice</span>
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-normal">
                    Sending this note will set the package status to <strong>CORRECTION_REQUIRED</strong> and alert the partner agency (<strong>{correctionTargetPackage.agencyName}</strong>) to update and resubmit.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Feedback / Revision Instructions *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain specific changes needed (e.g. Please clarify hotel classification in Day 3 and verify airport transfer inclusion)..."
                    value={correctionFeedback}
                    onChange={(e) => setCorrectionFeedback(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCorrectionTargetPackage(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <PaperPlaneTilt className="w-3.5 h-3.5" />
                  <span>Send Correction Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PHOTOGRAPH CREATE / EDIT MODAL ── */}
      {showPhotoModal && (() => {
        const otherFeaturedCount = photosList.filter(p => p.featured && p.id !== editingPhotoId).length;
        const isFeatureDisabled = !photoForm.featured && otherFeaturedCount >= 5;
        const totalFeaturedCount = photosList.filter(p => p.featured).length;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden relative text-slate-900 max-h-[90vh] h-[85vh] sm:h-[820px] flex flex-col">
              <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold leading-snug">
                    {editingPhotoId ? 'Edit Photograph Asset' : 'Upload Showcase Photograph'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Media Asset Hub &amp; Curated Gallery Showcase</p>
                </div>
                <button onClick={() => setShowPhotoModal(false)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs font-semibold">
                  {/* Photo Credit / Agency */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">
                          Photo Credit / Agency *
                        </label>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold">
                          <InstagramVerifiedBadge size={13} title="Verified Partner" />
                          <span>Verified Partner</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isFeatureDisabled}
                        onClick={() => setPhotoForm({ ...photoForm, featured: !photoForm.featured })}
                        title={
                          isFeatureDisabled
                            ? 'Showcase is full (5/5 slots used). Unfeature another photo first to feature this one.'
                            : photoForm.featured
                            ? 'Featured on Homepage (Click to unfeature)'
                            : 'Click to feature on Homepage'
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border shadow-sm ${
                          isFeatureDisabled
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : photoForm.featured
                            ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20 ring-2 ring-amber-400/20 hover:bg-amber-600 cursor-pointer'
                            : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border-slate-200 hover:border-amber-300 cursor-pointer'
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isFeatureDisabled
                              ? 'text-slate-400'
                              : photoForm.featured
                              ? 'text-amber-100 fill-white'
                              : 'text-amber-500'
                          }`}
                          weight={photoForm.featured ? 'fill' : 'bold'}
                        />
                        <span>{photoForm.featured ? 'Featured' : 'Feature'}</span>
                        <span className="text-[10px] font-semibold opacity-90">({totalFeaturedCount}/5 in use)</span>
                      </button>
                    </div>
                  {/* Warning note shown below High-Resolution Image */}
                  <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-slate-800">
                    <Warning className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" weight="fill" />
                    <div className="space-y-0.5 text-[11px] leading-relaxed">
                      <p className="text-amber-900 font-medium">
                        Homepage Showcase Slot(Strict Limit): Exactly 5 featured showcase photos maximum will appear on the Homepage curated gallery.
                      </p>

                    </div>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={photoForm.credit || 'Triiply Official Partner'}
                      onChange={(e) => setPhotoForm({ ...photoForm, credit: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-semibold text-slate-800 leading-normal"
                    >
                      <option value="Triiply Official Partner">Triiply Official Partner (Verified)</option>
                      {agenciesList
                        .filter((a) => a.verified)
                        .map((agency) => (
                          <option key={agency.id} value={agency.name}>
                            {agency.name} (Verified Partner)
                          </option>
                        ))}
                    </select>

                    {/* Selected Partner Verified Badge Display */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-900 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 truncate">
                        <InstagramVerifiedBadge size={16} title="Verified Partner" />
                        <span className="truncate">
                          Assigned: <strong className="font-bold text-slate-900">{photoForm.credit || 'Triiply Official Partner'}</strong>
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-sky-300 text-sky-700 text-[10px] font-black shrink-0 shadow-2xs">
                        <InstagramVerifiedBadge size={12} />
                        <span>Verified Partner</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Photo Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Overwater Bungalow Horizon at Sunset"
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Destination *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maldives, Baa Atoll"
                      value={photoForm.destination}
                      onChange={(e) => setPhotoForm({ ...photoForm, destination: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Category</label>
                    <select
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as PhotoCategory })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-semibold leading-normal"
                    >
                      <option value="Resorts & Villas">Resorts & Villas</option>
                      <option value="Desert & Adventure">Desert & Adventure</option>
                      <option value="Alpine & Scenic">Alpine & Scenic</option>
                      <option value="Beaches & Islands">Beaches & Islands</option>
                      <option value="Culture & Heritage">Culture & Heritage</option>
                      <option value="Festivals & Events">Festivals & Events</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Caption Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief descriptive caption of the destination photo..."
                    value={photoForm.caption}
                    onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium leading-relaxed"
                  />
                </div>

                {/* AWS S3 Image Uploader Component (All the way below) */}
                <div className="pt-2 space-y-2.5">
                  <S3ImageUploader
                    value={photoForm.imageUrl}
                    onChange={(url) => setPhotoForm({ ...photoForm, imageUrl: url })}
                    label="High-Resolution Image"
                    bucketPath="gallery/curated"
                    helperText="Asset is optimized for ultra high-resolution retina displays."
                    required={true}
                  />
                </div>
              </div>

              {/* Fixed Non-Scrollable Footer */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer leading-normal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer leading-normal"
                >
                  {editingPhotoId ? 'Update Photo' : 'Upload Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    })()}

      {/* ── PROMOTION CREATE / EDIT MODAL ── */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden relative text-slate-900 flex flex-col max-h-[90vh] h-[85vh] sm:h-[760px]">
            <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-bold leading-snug">
                  {editingPromoId ? 'Edit Promotional Campaign' : 'Create Promotional Campaign'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Promotional Information &amp; Announcement Management</p>
              </div>
              <button onClick={() => setShowPromoModal(false)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Campaign Headline Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founding Partner Program: 0% Platform Commission"
                    value={promoForm.title}
                    onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-medium leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Subtitle / Promotional Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Register today and receive 12 months fee-free verified onboarding..."
                    value={promoForm.subtitle}
                    onChange={(e) => setPromoForm({ ...promoForm, subtitle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-medium leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Limited Founding Offer"
                      value={promoForm.badge}
                      onChange={(e) => setPromoForm({ ...promoForm, badge: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-medium leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Discount / Incentive Text</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Free Tier ($0/yr)"
                      value={promoForm.discountText}
                      onChange={(e) => setPromoForm({ ...promoForm, discountText: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Promo Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FOUNDER2026"
                      value={promoForm.promoCode}
                      onChange={(e) => setPromoForm({ ...promoForm, promoCode: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 uppercase text-xs sm:text-sm font-mono font-bold leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Placement</label>
                    <select
                      value={promoForm.placement}
                      onChange={(e) => setPromoForm({ ...promoForm, placement: e.target.value as PromoPlacement })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-semibold leading-normal"
                    >
                      <option value="top_banner">Top Announcement Banner (Global)</option>
                      <option value="hero_spotlight">Hero Section Deal Spotlight</option>
                      <option value="package_deal">Package Directory Deal</option>
                      <option value="founding_partner">Founding Partner Program</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Valid Expiry Date</label>
                    <input
                      type="date"
                      value={promoForm.validUntil}
                      onChange={(e) => setPromoForm({ ...promoForm, validUntil: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-medium leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Gradient Theme</label>
                    <select
                      value={promoForm.bgGradient}
                      onChange={(e) => setPromoForm({ ...promoForm, bgGradient: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-semibold leading-normal"
                    >
                      <option value="from-blue-700 via-indigo-700 to-sky-600">Royal Blue & Indigo</option>
                      <option value="from-amber-600 via-orange-600 to-rose-600">Sunset Amber & Coral</option>
                      <option value="from-emerald-700 via-teal-700 to-sky-700">Alpine Emerald & Teal</option>
                      <option value="from-purple-700 via-violet-700 to-indigo-700">Velvet Purple & Violet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">CTA Button Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Claim Founding Badge"
                      value={promoForm.ctaText}
                      onChange={(e) => setPromoForm({ ...promoForm, ctaText: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-medium leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">CTA Target Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /contact"
                      value={promoForm.ctaLink}
                      onChange={(e) => setPromoForm({ ...promoForm, ctaLink: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 leading-normal uppercase tracking-wide">Terms & Conditions</label>
                  <input
                    type="text"
                    placeholder="e.g. Valid for verified registered travel operators..."
                    value={promoForm.terms}
                    onChange={(e) => setPromoForm({ ...promoForm, terms: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="promoActive"
                    checked={promoForm.active}
                    onChange={(e) => setPromoForm({ ...promoForm, active: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <label htmlFor="promoActive" className="text-slate-700 font-bold cursor-pointer">
                    Activate Live Immediately across Platform
                  </label>
                </div>
              </div>

              {/* Fixed Non-Scrollable Footer */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer"
                >
                  {editingPromoId ? 'Update Campaign' : 'Deploy Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PACKAGE DETAIL PREVIEW MODAL ── */}
      <PackageDetailModal
        packageData={previewPackage}
        onClose={() => setPreviewPackage(null)}
        onOpenRegister={() => { }}
      />

      {/* ── PHOTOGRAPH FULLSCREEN LIGHTBOX MODAL ── */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative text-white">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white"
            >
              <X className="w-5 h-5" />
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
                  <p className="text-xs text-slate-400 mt-1">{previewPhoto.caption}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-400">Photo Credit</p>
                <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-end mt-0.5">
                  <span>{previewPhoto.credit || 'Triiply Official Partner'}</span>
                  <InstagramVerifiedBadge size={14} title="Verified Partner Agency" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AGENCY VERIFICATION DOSSIER MODAL ── */}
      {showAgencyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white p-5 sm:px-7 flex items-center justify-between shrink-0">
              <div><h3 className="font-heading text-xl font-bold">Add Agency</h3><p className="text-xs text-slate-400 mt-1">Create a partner agency directly from the admin panel.</p></div>
              <button type="button" onClick={() => setShowAgencyForm(false)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddAgency} className="flex flex-col min-h-0">
              <div className="p-5 sm:p-7 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                {[
                  ['Agency name *', 'name', 'text', 'Example Travels'], ['Head office location *', 'location', 'text', 'Mumbai, India'],
                  ['Contact person *', 'contactName', 'text', 'Full name'], ['Official email *', 'contactEmail', 'email', 'name@agency.com'],
                  ['Contact phone', 'contactPhone', 'tel', '+91 ...'], ['WhatsApp', 'contactWhatsapp', 'tel', '+91 ...'],
                  ['Contact designation', 'contactDesignation', 'text', 'Founder / Manager'], ['Established', 'established', 'text', '2018'],
                  ['Destinations', 'destinations', 'text', 'Dubai, Bali, Kashmir'], ['Website', 'website', 'url', 'https://...'],
                  ['Logo URL', 'logoUrl', 'url', 'https://...'], ['Registered address', 'registeredAddress', 'text', 'Full legal address'],
                  ['PAN / License number', 'panNumber', 'text', 'Registration identifier'], ['GSTIN / Tax ID', 'gstNumber', 'text', 'Tax identifier']
                ].map(([label, key, type, placeholder]) => (
                  <label key={key} className="space-y-1.5"><span className="text-slate-700">{label}</span><input required={label.endsWith('*')} type={type} placeholder={placeholder} value={(agencyForm as any)[key]} onChange={e => setAgencyForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
                ))}
                <label className="space-y-1.5"><span className="text-slate-700">Agency type</span><select value={agencyForm.type} onChange={e => setAgencyForm(prev => ({ ...prev, type: e.target.value as AgencyPartner['type'] }))} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">{['DMC', 'Tour Operator', 'Travel Agency', 'Holiday Provider', 'Independent Consultant'].map(type => <option key={type}>{type}</option>)}</select></label>
                <label className="space-y-1.5"><span className="text-slate-700">Short tagline</span><input value={agencyForm.tagline} onChange={e => setAgencyForm(prev => ({ ...prev, tagline: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
                <label className="sm:col-span-2 space-y-1.5"><span className="text-slate-700">About agency</span><textarea rows={3} value={agencyForm.about} onChange={e => setAgencyForm(prev => ({ ...prev, about: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></label>
                <label className="sm:col-span-2 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3"><input type="checkbox" checked={agencyForm.verified} onChange={e => setAgencyForm(prev => ({ ...prev, verified: e.target.checked }))} className="w-4 h-4 accent-blue-600" /><span><strong className="block text-slate-900">Issue verified badge immediately</strong><span className="text-[10px] text-slate-500">Turn this off to add the agency as pending verification.</span></span></label>
              </div>
              <div className="p-4 sm:px-7 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 shrink-0"><button type="button" onClick={() => setShowAgencyForm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold">Cancel</button><button disabled={isAddingAgency} type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold">{isAddingAgency ? 'Adding agency...' : 'Add Agency'}</button></div>
            </form>
          </div>
        </div>
      )}

      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden relative text-slate-900 flex flex-col max-h-[92vh] h-[88vh] sm:h-[780px]">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-heading text-lg font-bold">Review License Credentials</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Dossier: {selectedAgency.name}</p>
              </div>
              <button onClick={() => setSelectedAgency(null)} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs font-semibold text-slate-800 flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img
                  src={selectedAgency.logoUrl}
                  alt="Logo"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{selectedAgency.name}</h4>
                    {selectedAgency.verified && (
                      <InstagramVerifiedBadge size={18} title="Verified Partner Agency" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{selectedAgency.type} · Est. {selectedAgency.established}</p>
                  {selectedAgency.submittedAt && <p className="mt-0.5 text-[10px] text-slate-400">Submitted {new Date(selectedAgency.submittedAt).toLocaleString()}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">License Key Number</p>
                  <p className="text-slate-900 font-bold font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                    {selectedAgency.panNumber || selectedAgency.licenseNumber || 'Not supplied'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">GSTIN / Tax ID</p>
                  <p className="text-slate-900 font-bold font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                    {selectedAgency.gstNumber || 'Not applicable / not supplied'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Registered Office HQ Address</p>
                <p className="text-slate-900 font-bold">
                  {selectedAgency.registeredAddress || selectedAgency.location}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-extrabold">Authorised contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <p><strong>Name:</strong> {selectedAgency.contactName || selectedAgency.ownerName || 'Not supplied'}</p>
                  <p><strong>Role:</strong> {selectedAgency.contactDesignation || selectedAgency.ownerRole || 'Not supplied'}</p>
                  <p><strong>Email:</strong> {selectedAgency.contactEmail || 'Not supplied'}</p>
                  <p><strong>Phone:</strong> {selectedAgency.contactPhone || 'Not supplied'}</p>
                  <p className="sm:col-span-2"><strong>WhatsApp:</strong> {selectedAgency.contactWhatsapp || selectedAgency.whatsapp || 'Not supplied'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-extrabold">Business profile</p>
                <p className="leading-relaxed text-slate-700">{selectedAgency.businessDescription || selectedAgency.about}</p>
                <p><strong>Operating location:</strong> {selectedAgency.operatingLocation || selectedAgency.location}</p>
                <p><strong>Regions served:</strong> {selectedAgency.serviceRegions?.join(', ') || 'Not supplied'}</p>
                <p><strong>Destinations:</strong> {selectedAgency.destinations.join(', ') || 'Not supplied'}</p>
                <p><strong>Categories:</strong> {selectedAgency.packageCategories?.join(', ') || 'Not supplied'}</p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-blue-700">Submitted verification files</p>
                {[
                  ['Registration certificate', selectedAgency.registrationDocumentUrl],
                  ['Address proof', selectedAgency.addressProofUrl],
                  ['Travel certification', selectedAgency.travelCertificationUrl],
                  ['Company brochure', selectedAgency.brochureUrl],
                  ['Website', selectedAgency.website]
                ].map(([label, url]) => url ? (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-blue-700 hover:underline">
                    <span>{label}</span><span>Open ↗</span>
                  </a>
                ) : null)}
                {selectedAgency.supportingDocumentUrls?.map((url, index) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-blue-700 hover:underline">
                    <span>Supporting document {index + 1}</span><span>Open ↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Fixed Non-Scrollable Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Blue Badge Shield</p>
                <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${selectedAgency.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                  {selectedAgency.verified ? (
                    <>
                      <InstagramVerifiedBadge size={12} title="Verified Partner" />
                      <span>Active Shield</span>
                    </>
                  ) : (
                    <span>Pending Verification</span>
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                {selectedAgency.verified ? (
                  <button
                    onClick={() => handleToggleVerification(selectedAgency.id, false)}
                    className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Suspend Access
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleVerification(selectedAgency.id, true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Issue Trust Badge</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── CUSTOMER BOOKING INSPECTION & VOUCHER MODAL ── */}
      {selectedBooking && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden relative text-slate-900 max-h-[92vh] flex flex-col">

            {/* Top Bar */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-sky-400" />
                <div>
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Customer Booking Dossier</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold">{selectedBooking.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${selectedBooking.status === 'CONFIRMED'
                      ? 'bg-emerald-500 text-white'
                      : selectedBooking.status === 'PENDING'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                      }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">

              {/* Package & Trip Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={selectedBooking.imageUrl}
                  alt={selectedBooking.packageTitle}
                  className="w-full sm:w-28 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-blue-600 font-bold mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedBooking.destination}</span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedBooking.duration}</span>
                  </div>
                  <h4 className="font-heading text-base font-bold text-slate-900 leading-snug">{selectedBooking.packageTitle}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>Fulfill Ground Operator: <strong>{selectedBooking.agencyName}</strong> (ID: {selectedBooking.agencyId})</span>
                    <InstagramVerifiedBadge size={14} title="Verified Operator" />
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Lead Traveler Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Lead Traveler Details</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <p><span className="text-slate-400 font-semibold">Legal Name:</span> <strong className="text-slate-900">{selectedBooking.leadGuest.fullName}</strong></p>
                    <p><span className="text-slate-400 font-semibold">Email:</span> {selectedBooking.leadGuest.email}</p>
                    <p><span className="text-slate-400 font-semibold">WhatsApp/Phone:</span> <strong className="text-slate-900">{selectedBooking.leadGuest.phone}</strong></p>
                    <p><span className="text-slate-400 font-semibold">Country:</span> {selectedBooking.leadGuest.country || 'N/A'}</p>
                    <p><span className="text-slate-400 font-semibold">Dietary Preference:</span> {selectedBooking.leadGuest.dietaryPreference || 'None'}</p>
                  </div>
                </div>

                {/* Itinerary & Logistics */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Travel Schedule &amp; Party</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <p><span className="text-slate-400 font-semibold">Departure Date:</span> <strong className="text-slate-900">{selectedBooking.travelDate}</strong></p>
                    {selectedBooking.returnDate && <p><span className="text-slate-400 font-semibold">Return Date:</span> {selectedBooking.returnDate}</p>}
                    <p><span className="text-slate-400 font-semibold">Guest Party:</span> <strong className="text-slate-900">{selectedBooking.pricing.adultsCount} Adults {selectedBooking.pricing.childrenCount > 0 ? `, ${selectedBooking.pricing.childrenCount} Children` : ''} {selectedBooking.pricing.infantsCount ? `, ${selectedBooking.pricing.infantsCount} Infants` : ''}</strong></p>
                    <p><span className="text-slate-400 font-semibold">Departure City:</span> {selectedBooking.departureCity || 'Default Airport'}</p>
                    <p><span className="text-slate-400 font-semibold">Booking Placed:</span> {new Date(selectedBooking.bookingDate).toLocaleString()}</p>
                  </div>
                </div>

              </div>

              {/* Co-Travelers Manifest */}
              {selectedBooking.coTravelers && selectedBooking.coTravelers.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Additional Co-Travelers</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.coTravelers.map((name, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                        Traveler {i + 2}: {name || 'Unnamed Guest'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Tier & Addons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accommodation Selection</span>
                  <p className="font-bold text-slate-900">{selectedBooking.roomType}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed Add-ons</span>
                  {selectedBooking.selectedAddons.length === 0 ? (
                    <p className="text-slate-500 italic">No optional add-ons selected</p>
                  ) : (
                    <ul className="space-y-1">
                      {selectedBooking.selectedAddons.map((addon, idx) => (
                        <li key={idx} className="flex justify-between font-semibold text-slate-800">
                          <span>• {addon.name}</span>
                          <span className="text-blue-600">+₹{addon.price.toLocaleString('en-IN')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Financial Breakdown Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="font-heading text-sm font-bold text-slate-200">Financial Ledger Breakdown</span>
                  <span className="text-xs font-mono font-bold text-sky-400">INR ₹ ({selectedBooking.pricing.currency || 'INR'})</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Adult Fare ({selectedBooking.pricing.adultsCount} × ₹{selectedBooking.pricing.basePricePerAdult.toLocaleString('en-IN')}):</span>
                    <span className="font-mono text-white font-bold">₹{(selectedBooking.pricing.adultsCount * selectedBooking.pricing.basePricePerAdult).toLocaleString('en-IN')}</span>
                  </div>

                  {selectedBooking.pricing.childrenCount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Children Fare ({selectedBooking.pricing.childrenCount} × ₹{selectedBooking.pricing.childPricePerChild.toLocaleString('en-IN')}):</span>
                      <span className="font-mono font-bold">₹{(selectedBooking.pricing.childrenCount * selectedBooking.pricing.childPricePerChild).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {selectedBooking.pricing.roomUpgradeCost > 0 && (
                    <div className="flex justify-between">
                      <span>Room Upgrade Surcharge:</span>
                      <span className="font-mono text-white font-bold">+₹{selectedBooking.pricing.roomUpgradeCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {selectedBooking.pricing.addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Experience Add-ons Total:</span>
                      <span className="font-mono text-white font-bold">+₹{selectedBooking.pricing.addonsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>GST &amp; Regulatory Taxes:</span>
                    <span className="font-mono text-white font-bold">+₹{selectedBooking.pricing.taxesAndFees.toLocaleString('en-IN')}</span>
                  </div>

                  {selectedBooking.pricing.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Coupon Discount ({selectedBooking.promoCode || 'PROMO'}):</span>
                      <span className="font-mono">-₹{selectedBooking.pricing.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-200">Total Holiday Fare:</span>
                  <span className="font-heading text-xl font-extrabold text-emerald-400">
                    ₹{selectedBooking.pricing.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>Payment Mode: <strong>{selectedBooking.paymentMode}</strong></span>
                  <span>Paid / Deposited: <strong>₹{(selectedBooking.pricing.depositAmount || selectedBooking.pricing.totalAmount).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.notes && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Special Requests &amp; Notes</span>
                  <p className="text-xs">{selectedBooking.notes}</p>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              {/* Status Switcher Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Moderation Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleUpdateBookingStatus(selectedBooking.id, e.target.value as BookingStatus)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedBooking.leadGuest.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedBooking.leadGuest.fullName)}%2C%20regarding%20your%20Triiply%20booking%20${selectedBooking.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <WhatsappLogo className="w-4 h-4" />
                  <span>WhatsApp Guest</span>
                </a>

                <button
                  onClick={() => {
                    setEditingAdminBooking(selectedBooking);
                    setShowAdminBookingModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PencilSimple className="w-4 h-4" />
                  <span>Edit Reservation</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── BOOKING CANCELLATION PROMPT MODAL ── */}
      {cancelPromptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleConfirmAdminCancel} className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <WarningCircle className="w-8 h-8" weight="fill" />
            </div>

            <div className="text-center">
              <h3 className="font-heading text-lg font-bold text-slate-900">Cancel Reservation?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking <strong>{cancelPromptBooking.id}</strong> for {cancelPromptBooking.leadGuest.fullName} will be marked as CANCELLED.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Cancellation Reason / Audit Note</label>
              <textarea
                required
                rows={2}
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelPromptBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ADMIN DIRECT RESERVATION & BOOKING MANAGER MODAL ── */}
      <AdminBookingModal
        isOpen={showAdminBookingModal}
        onClose={() => {
          setShowAdminBookingModal(false);
          setEditingAdminBooking(null);
        }}
        onSaved={handleSaveAdminBooking}
        packages={packagesList}
        agencies={agenciesList}
        editingBooking={editingAdminBooking}
      />

      {/* ── DYNAMIC COLOR-CODED NOTIFICATION TOAST ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl p-4 flex items-center gap-3.5 transition-all duration-300 ${toast.type === 'success'
              ? 'bg-slate-950/95 border-emerald-500/40 shadow-emerald-950/40 text-white'
              : toast.type === 'error'
                ? 'bg-slate-950/95 border-rose-500/40 shadow-rose-950/40 text-white'
                : toast.type === 'warning'
                  ? 'bg-slate-950/95 border-amber-500/40 shadow-amber-950/40 text-white'
                  : 'bg-slate-950/95 border-sky-500/40 shadow-sky-950/40 text-white'
              }`}
          >
            {/* Left Accent Color Indicator Bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${toast.type === 'success'
                ? 'bg-gradient-to-b from-emerald-400 to-teal-500'
                : toast.type === 'error'
                  ? 'bg-gradient-to-b from-rose-500 to-red-600'
                  : toast.type === 'warning'
                    ? 'bg-gradient-to-b from-amber-400 to-orange-500'
                    : 'bg-gradient-to-b from-sky-400 to-blue-500'
                }`}
            />

            {/* Icon Circle */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${toast.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : toast.type === 'error'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : toast.type === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" weight="fill" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5" weight="fill" />}
              {toast.type === 'warning' && <WarningCircle className="w-5 h-5" weight="fill" />}
              {toast.type === 'info' && <Info className="w-5 h-5" weight="fill" />}
            </div>

            {/* Content & Badge */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${toast.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : toast.type === 'error'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : toast.type === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}
                >
                  {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Rejected / Notice' : toast.type === 'warning' ? 'Attention' : 'System'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Platform Alert</span>
              </div>
              <p className="text-xs font-semibold text-slate-100 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setToast(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
