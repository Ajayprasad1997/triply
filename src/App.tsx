import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EcosystemMarquee } from './components/EcosystemMarquee';
import { MasonryTravelGallery } from './components/MasonryTravelGallery';
import { FeaturedDestinations } from './components/FeaturedDestinations';
import { ImageBenefits } from './components/ImageBenefits';
import { AgencyShowcase } from './components/AgencyShowcase';
import { PackageShowcase } from './components/PackageShowcase';
import { LaptopDashboardMockup } from './components/LaptopDashboardMockup';
import { TravelTimeline } from './components/TravelTimeline';
import { FutureMarketplaceSplit } from './components/FutureMarketplaceSplit';
import { AgencyTestimonials } from './components/AgencyTestimonials';
import { WhyJoinEarly } from './components/WhyJoinEarly';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { PackageDetailModal } from './components/PackageDetailModal';
import { QuickAssistWidget } from './components/QuickAssistWidget';
import { TravelPackage } from './types';
import { ProtectedRoute } from './components/ProtectedRoute';

import { syncInitialDataFromBackend } from './data/mockData';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AgencyProfilePage = lazy(() => import('./pages/AgencyProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const TravelDiscoveryPage = lazy(() => import('./pages/TravelDiscoveryPage').then(module => ({ default: module.TravelDiscoveryPage })));
const AgencyDirectoryPage = lazy(() => import('./pages/AgencyDirectoryPage').then(module => ({ default: module.AgencyDirectoryPage })));
const AgencyBenefitsPage = lazy(() => import('./pages/AgencyBenefitsPage').then(module => ({ default: module.AgencyBenefitsPage })));
const PhotoLibraryPage = lazy(() => import('./pages/PhotoLibraryPage').then(module => ({ default: module.PhotoLibraryPage })));
const CompanyProfilePage = lazy(() => import('./pages/CompanyProfilePage').then(module => ({ default: module.CompanyProfilePage })));
const PrivacyPolicyPage = lazy(() => import('./pages/LegalPage').then(module => ({ default: module.PrivacyPolicyPage })));
const TermsConditionsPage = lazy(() => import('./pages/LegalPage').then(module => ({ default: module.TermsConditionsPage })));

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const targetId = decodeURIComponent(location.hash.slice(1));
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.pathname, location.hash]);

  return null;
}

// Sub-component to hold main layout with access to router hooks
function AppContent() {
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    void syncInitialDataFromBackend().then(success => {
      if (active) setServiceUnavailable(!success);
    });
    return () => { active = false; };
  }, []);

  const handleOpenRegister = () => {
    navigate('/benefits#agency-onboarding');
  };

  // Determine if we are inside a portal page (admin or agency dashboard)
  const isPortal = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden">
      <ScrollToHash />
      {serviceUnavailable && (
        <div role="alert" className="bg-amber-50 px-4 py-2 text-center text-xs font-bold text-amber-900 ring-1 ring-inset ring-amber-200">
          Live travel data is temporarily unavailable. Browsing data may be out of date, and submissions will not be confirmed until service is restored.
        </div>
      )}
      
      {/* Top Announcement / Promotion Banner */}

      {/* Navbar rendered only on public/non-portal pages */}
      {!isPortal && <Navbar />}

      {/* Main Routing System */}
      <Suspense fallback={<div role="status" className="grid min-h-[60vh] place-items-center text-sm font-semibold text-slate-600">Loading page…</div>}>
      <Routes>
        {/* Public Homepage Route */}
        <Route path="/" element={
          <main>
            {/* Hero Section */}
            <Hero onOpenRegister={handleOpenRegister} />

            {/* Global Ecosystem Marquee */}
            <EcosystemMarquee />

            {/* Masonry Travel Image Showcase */}
            <MasonryTravelGallery />

            {/* Featured Destinations Carousel */}
            <FeaturedDestinations onOpenRegister={handleOpenRegister} />

            {/* Agency Benefits & ROI Calculator */}
            <ImageBenefits onOpenRegister={handleOpenRegister} />

            {/* Verified Agency Directory Showcase */}
            <AgencyShowcase onOpenRegister={handleOpenRegister} />

            {/* Holiday Packages Directory */}
            <PackageShowcase
              onSelectPackage={(pkg) => setSelectedPackage(pkg)}
              onOpenRegister={handleOpenRegister}
            />

            {/* Interactive Dashboard Preview Mockup */}
            <LaptopDashboardMockup onOpenRegister={handleOpenRegister} />

            {/* How It Works Travel Timeline */}
            <TravelTimeline onOpenRegister={handleOpenRegister} />

            {/* Future Marketplace Split View */}
            <FutureMarketplaceSplit onOpenRegister={handleOpenRegister} />

            {/* Real Agency Testimonials & Reviews */}
            <AgencyTestimonials onOpenRegister={handleOpenRegister} />

            {/* Founding Partner Program Banner */}
            <WhyJoinEarly onOpenRegister={handleOpenRegister} />

            {/* Searchable FAQ Section */}
            <FAQSection onOpenRegister={handleOpenRegister} />

            {/* Final High-Conversion Travel CTA */}
            <FinalCTA onOpenRegister={handleOpenRegister} />
          </main>
        } />

        {/* Customer-Facing Holiday Packages & Booking Discovery Pages */}
        <Route path="/explore" element={<TravelDiscoveryPage />} />
        <Route path="/holiday-packages" element={<TravelDiscoveryPage />} />
        <Route path="/packages" element={<TravelDiscoveryPage />} />
        <Route path="/book" element={<TravelDiscoveryPage />} />
        <Route path="/booking" element={<TravelDiscoveryPage />} />

        {/* Dedicated Navbar Sub-Pages */}
        <Route path="/photo-library" element={<PhotoLibraryPage />} />
        <Route path="/photos" element={<PhotoLibraryPage />} />
        <Route path="/gallery" element={<PhotoLibraryPage />} />
        <Route path="/destinations" element={<TravelDiscoveryPage />} />
        <Route path="/agencies" element={<AgencyDirectoryPage />} />
        <Route path="/agency-directory" element={<AgencyDirectoryPage />} />
        <Route path="/benefits" element={<AgencyBenefitsPage />} />
        <Route path="/agency-benefits" element={<AgencyBenefitsPage />} />
        <Route path="/how-it-works" element={<Navigate to="/benefits#how-it-works" replace />} />
        <Route path="/about" element={<Navigate to="/contact" replace />} />
        <Route path="/company" element={<Navigate to="/contact" replace />} />
        <Route path="/company-profile" element={<Navigate to="/contact" replace />} />
        <Route path="/contact" element={<CompanyProfilePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsConditionsPage />} />
        <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />

        {/* Public Authentication Forms */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public Storefront Details Route */}
        <Route path="/agency/:id" element={<AgencyProfilePage />} />

        {/* Protected Moderation Console for Platform Admins */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>


      {/* Footer rendered only on public/non-portal pages */}
      {!isPortal && <Footer />}

      {/* Package Detail Modal (used across homepage and storefronts) */}
      <PackageDetailModal
        packageData={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onOpenRegister={handleOpenRegister}
      />

      {/* Floating Assist Help Widget */}
      {!isPortal && <QuickAssistWidget onOpenRegister={handleOpenRegister} />}

    </div>
  );
}

// Global router wrapper
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
