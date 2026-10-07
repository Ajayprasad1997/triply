import { TravelPackage, PackageStatus, PackageVisibility, CorrectionNote, ItineraryDay } from '../types';
import { getPackages, savePackages, getAgencies, addAuditLog } from './mockData';
import { sanitizeInput } from '../utils/security';
import { api } from '../services/api';

/**
 * Synchronize local cache with backend API
 */
export const syncPackagesFromBackend = async (): Promise<TravelPackage[]> => {
  try {
    const res = await api.getPackages();
    if (res.success && res.packages) {
      savePackages(res.packages);
      return res.packages;
    }
  } catch (err) {
    console.warn('[packageService] Background sync failed, using local cache:', err);
  }
  return getPackages();
};

export interface PackageOperationResult {
  success: boolean;
  package?: TravelPackage;
  error?: string;
}

export interface SessionUser {
  userId: string;
  role: 'admin' | 'agency';
  email: string;
}

/**
 * Validates travel package input data for security, pricing, and structural integrity.
 */
export const validatePackageInput = (data: Partial<TravelPackage>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Package title must be at least 3 characters long.');
  }

  if (!data.destination || data.destination.trim().length < 2) {
    errors.push('Destination is required.');
  }

  if (data.startingPrice !== undefined && (isNaN(data.startingPrice) || data.startingPrice < 0)) {
    errors.push('Starting price cannot be negative.');
  }

  if (data.adultPrice !== undefined && (isNaN(data.adultPrice) || data.adultPrice < 0)) {
    errors.push('Adult rate cannot be negative.');
  }

  if (data.childPrice !== undefined && (isNaN(data.childPrice) || data.childPrice < 0)) {
    errors.push('Child rate cannot be negative.');
  }

  if (data.groupPrice !== undefined && (isNaN(data.groupPrice) || data.groupPrice < 0)) {
    errors.push('Group rate cannot be negative.');
  }

  if (data.days !== undefined && (isNaN(data.days) || data.days < 1)) {
    errors.push('Total duration must be at least 1 day.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Retrieve packages scoped to the current user's session with strict RBAC.
 */
export const getSecurePackages = (
  session: SessionUser | null,
  filters?: {
    status?: string;
    search?: string;
    agencyId?: string;
    category?: string;
    featuredOnly?: boolean;
  }
): TravelPackage[] => {
  const allPackages = getPackages();

  return allPackages.filter((pkg) => {
    // 1. RBAC and Ownership check
    if (!session) {
      // Public / Traveler: only approved and published packages
      if (pkg.status !== 'APPROVED') return false;
      if (pkg.deletedAt) return false;
    } else if (session.role === 'agency') {
      // Agency: strictly restricted to their own agencyId or matching agencyName
      const agencies = getAgencies();
      const currentAg = agencies.find(a => a.id === session.userId);
      const isOwner = (pkg.agencyId === session.userId) || (currentAg && pkg.agencyName === currentAg.name);
      if (!isOwner) return false;
      if (pkg.deletedAt) return false;
    } else if (session.role === 'admin') {
      // Admin: has global access to all packages
      if (pkg.deletedAt) return false; // Default exclude soft-deleted unless explicitly requested
    }

    // 2. Status filter
    if (filters?.status && filters.status !== 'all') {
      const currentStatus = pkg.status || 'APPROVED';
      if (currentStatus !== filters.status) return false;
    }

    // 3. Featured filter
    if (filters?.featuredOnly && !pkg.featured) {
      return false;
    }

    // 4. Agency ID filter
    if (filters?.agencyId && filters.agencyId !== 'all') {
      if (pkg.agencyId !== filters.agencyId) return false;
    }

    // 5. Category filter
    if (filters?.category && filters.category !== 'all') {
      if (pkg.category !== filters.category && pkg.theme !== filters.category) return false;
    }

    // 6. Search Query filter
    if (filters?.search && filters.search.trim() !== '') {
      const query = filters.search.toLowerCase();
      const matchTitle = pkg.title.toLowerCase().includes(query);
      const matchDest = pkg.destination.toLowerCase().includes(query);
      const matchAgency = pkg.agencyName.toLowerCase().includes(query);
      if (!matchTitle && !matchDest && !matchAgency) return false;
    }

    return true;
  });
};

/**
 * Retrieve single package with ownership authorization check.
 */
export const getSecurePackageById = (packageId: string, session: SessionUser | null): TravelPackage | null => {
  const all = getPackages();
  const pkg = all.find(p => p.id === packageId);
  if (!pkg) return null;

  if (!session) {
    return pkg.status === 'APPROVED' ? pkg : null;
  }

  if (session.role === 'agency') {
    const agencies = getAgencies();
    const currentAg = agencies.find(a => a.id === session.userId);
    const isOwner = (pkg.agencyId === session.userId) || (currentAg && pkg.agencyName === currentAg.name);
    if (!isOwner) return null;
  }

  return pkg;
};

/**
 * Save package (Create / Edit) with IDOR security, validation, and lifecycle management.
 */
export const saveSecurePackage = async (
  packageData: Partial<TravelPackage>,
  session: SessionUser,
  mode: 'SAVE_DRAFT' | 'SUBMIT' = 'SUBMIT'
): Promise<PackageOperationResult> => {
  // 1. Validation check
  const validation = validatePackageInput(packageData);
  if (!validation.isValid) {
    return { success: false, error: validation.errors.join(' ') };
  }

  const allPackages = getPackages();
  const agencies = getAgencies();
  const isEditing = !!packageData.id;

  let existingPkg: TravelPackage | undefined;
  if (isEditing) {
    existingPkg = allPackages.find(p => p.id === packageData.id);
    if (!existingPkg) {
      return { success: false, error: 'Package not found.' };
    }

    // IDOR Protection: Ensure agency cannot update another agency's package
    if (session.role === 'agency') {
      const currentAg = agencies.find(a => a.id === session.userId);
      const isOwner = (existingPkg.agencyId === session.userId) || (currentAg && existingPkg.agencyName === currentAg.name);
      if (!isOwner) {
        addAuditLog('SECURITY_VIOLATION', session.email, `Unauthorized IDOR edit attempt on package ID: ${packageData.id}`, 'Security');
        return { success: false, error: 'Unauthorized: You can only edit your own agency packages.' };
      }
    }
  }

  // Determine Agency Attribution
  let targetAgencyId = session.userId;
  let targetAgency = agencies.find(a => a.id === session.userId);

  if (session.role === 'admin') {
    if (packageData.agencyId) {
      targetAgencyId = packageData.agencyId;
      targetAgency = agencies.find(a => a.id === targetAgencyId);
    } else if (packageData.agencyName) {
      targetAgency = agencies.find(a => a.name === packageData.agencyName);
      targetAgencyId = targetAgency?.id || 'admin-managed';
    } else {
      targetAgency = agencies[0];
      targetAgencyId = targetAgency?.id || 'ag-1';
    }
  }

  const agencyName = targetAgency?.name || packageData.agencyName || 'Verified Travel Partner';
  const agencyType = targetAgency?.type || packageData.agencyType || 'DMC';
  const agencyVerified = targetAgency?.verified ?? true;
  const agencyLogo = targetAgency?.logoUrl || packageData.agencyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80';

  // Determine Package Status Lifecycle
  let nextStatus: PackageStatus = 'DRAFT';
  if (session.role === 'admin') {
    if (mode === 'SAVE_DRAFT') {
      nextStatus = 'DRAFT';
    } else {
      nextStatus = 'APPROVED';
    }
  } else {
    // Agency Owner can ONLY transition between DRAFT and SUBMITTED
    if (mode === 'SAVE_DRAFT') {
      nextStatus = 'DRAFT';
    } else if (mode === 'SUBMIT') {
      nextStatus = 'SUBMITTED';
    }
  }

  // Format Duration & Price Estimate for display
  const daysCount = Number(packageData.days) || 5;
  const nightsCount = Number(packageData.nights) || Math.max(0, daysCount - 1);
  const formattedDuration = `${daysCount} Days / ${nightsCount} Nights`;

  const currencySymbol = packageData.currency || 'USD';
  const priceVal = Number(packageData.startingPrice) || 450;
  const formattedPrice = `B2B Rate from ${currencySymbol === 'USD' ? '$' : currencySymbol === 'EUR' ? '€' : currencySymbol === 'AED' ? 'AED ' : currencySymbol === 'INR' ? '₹' : `${currencySymbol} `}${priceVal.toLocaleString()} / pax`;

  // Sanitize Inputs
  const sanitizedTitle = sanitizeInput(packageData.title || '').trim();
  const sanitizedDest = sanitizeInput(packageData.destination || '').trim();
  const sanitizedDeparture = sanitizeInput(packageData.departureLocation || '').trim();
  const sanitizedOverview = sanitizeInput(packageData.overview || '').trim();
  const sanitizedTheme = sanitizeInput(packageData.theme || packageData.category || 'Luxury & Desert').trim();

  // Sanitize Itinerary
  const cleanItinerary: ItineraryDay[] = (packageData.itinerary || []).map((day, idx) => ({
    id: day.id || `day-${idx + 1}-${Date.now()}`,
    dayNumber: idx + 1,
    title: sanitizeInput(day.title || `Day ${idx + 1}`),
    description: sanitizeInput(day.description || ''),
    activities: (day.activities || []).map(a => sanitizeInput(a)),
    meals: (day.meals || []).map(m => sanitizeInput(m)),
    accommodation: sanitizeInput(day.accommodation || ''),
    transportation: sanitizeInput(day.transportation || '')
  }));

  const cleanInclusions = (packageData.inclusions || packageData.included || []).map(i => sanitizeInput(i));
  const cleanExclusions = (packageData.exclusions || []).map(e => sanitizeInput(e));
  const cleanHighlights = (packageData.highlights || []).map(h => sanitizeInput(h));

  const newOrUpdatedPackage: TravelPackage = {
    id: isEditing ? existingPkg!.id : `pkg-${Date.now()}`,
    agencyId: targetAgencyId,
    title: sanitizedTitle,
    destination: sanitizedDest,
    departureLocation: sanitizedDeparture,
    category: sanitizedTheme,
    theme: sanitizedTheme,
    days: daysCount,
    nights: nightsCount,
    duration: formattedDuration,
    overview: sanitizedOverview,
    travellerTypes: packageData.travellerTypes || ['Couples', 'Families'],
    minTravellers: Number(packageData.minTravellers) || 1,
    maxTravellers: Number(packageData.maxTravellers) || 20,

    itinerary: cleanItinerary,
    travelDateType: packageData.travelDateType || 'Flexible',
    startDate: packageData.startDate,
    endDate: packageData.endDate,
    season: packageData.season || 'Year Round',
    transportType: packageData.transportType || 'Private AC Vehicle',
    hotelCategory: packageData.hotelCategory || '4-Star',
    mealPlan: packageData.mealPlan || 'Daily Breakfast (CP)',
    pickupInfo: sanitizeInput(packageData.pickupInfo || 'Airport Arrival Terminal'),
    dropInfo: sanitizeInput(packageData.dropInfo || 'Airport Departure Terminal'),

    startingPrice: priceVal,
    currency: currencySymbol,
    priceBasis: packageData.priceBasis || 'Per Person',
    adultPrice: Number(packageData.adultPrice) || priceVal,
    childPrice: packageData.childPrice !== undefined ? Number(packageData.childPrice) : undefined,
    groupPrice: packageData.groupPrice !== undefined ? Number(packageData.groupPrice) : undefined,
    taxesIncluded: packageData.taxesIncluded ?? true,
    priceEstimate: formattedPrice,
    addons: packageData.addons || [],

    inclusions: cleanInclusions,
    exclusions: cleanExclusions,
    included: cleanInclusions,
    highlights: cleanHighlights.length > 0 ? cleanHighlights : cleanInclusions.slice(0, 4),

    cancellationPolicy: sanitizeInput(packageData.cancellationPolicy || 'Free cancellation up to 7 days before departure.'),
    paymentPolicy: sanitizeInput(packageData.paymentPolicy || '30% advance deposit at booking, 70% 14 days prior.'),
    importantNotes: sanitizeInput(packageData.importantNotes || 'Valid passport with minimum 6 months validity required.'),

    imageUrl: packageData.imageUrl || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    galleryImages: packageData.galleryImages || [packageData.imageUrl || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'],
    brochureUrl: packageData.brochureUrl,

    agencyName,
    agencyType,
    agencyVerified,
    agencyLogo,

    rating: existingPkg?.rating || 5.0,
    reviews: existingPkg?.reviews || 0,
    status: nextStatus,
    visibility: packageData.visibility || existingPkg?.visibility || 'PUBLIC',
    featured: packageData.featured ?? existingPkg?.featured ?? false,
    correctionNotes: existingPkg?.correctionNotes || [],
    createdBy: existingPkg?.createdBy || session.email,
    createdAt: existingPkg?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (async () => {
    try {
      const response = isEditing
        ? await api.updatePackage(newOrUpdatedPackage.id, newOrUpdatedPackage, mode)
        : await api.createPackage(newOrUpdatedPackage, mode);
      const persistedPackage = response.package;
      const updatedList = isEditing
        ? allPackages.map(p => (p.id === persistedPackage.id ? persistedPackage : p))
        : [persistedPackage, ...allPackages];
      savePackages(updatedList);

      addAuditLog(isEditing ? 'PACKAGE_UPDATED' : 'PACKAGE_CREATED', session.email, `Package "${persistedPackage.title}" (ID: ${persistedPackage.id}) saved with status: [${persistedPackage.status}]`, 'Info');
      return { success: true, package: persistedPackage };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Package could not be saved.' };
    }
  })();
};

/**
 * Delete package with authorization enforcement.
 */
export const deleteSecurePackage = async (packageId: string, session: SessionUser): Promise<PackageOperationResult> => {
  const allPackages = getPackages();
  const pkg = allPackages.find(p => p.id === packageId);
  if (!pkg) {
    return { success: false, error: 'Package not found.' };
  }

  // Agency can ONLY delete their own packages if DRAFT or CORRECTION_REQUIRED
  if (session.role === 'agency') {
    const agencies = getAgencies();
    const currentAg = agencies.find(a => a.id === session.userId);
    const isOwner = (pkg.agencyId === session.userId) || (currentAg && pkg.agencyName === currentAg.name);
    if (!isOwner) {
      addAuditLog('SECURITY_VIOLATION', session.email, `Unauthorized delete attempt on package ID: ${packageId}`, 'Security');
      return { success: false, error: 'Unauthorized to delete this package.' };
    }
    if (pkg.status === 'APPROVED' || pkg.status === 'SUBMITTED') {
      return { success: false, error: 'Cannot delete packages that are submitted or already approved. Please contact platform admin.' };
    }
  }

  try {
    await api.deletePackage(packageId);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Package could not be deleted.' };
  }
  savePackages(allPackages.filter(p => p.id !== packageId));

  addAuditLog(
    'PACKAGE_DELETED',
    session.email,
    `Package "${pkg.title}" (ID: ${packageId}) permanently removed by ${session.role}`,
    'Warning'
  );

  return { success: true };
};

/**
 * Admin Moderation Action (Approve / Reject / Request Correction)
 */
export const moderateSecurePackage = async (
  packageId: string,
  decision: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION',
  feedbackMessage: string,
  session: SessionUser
): Promise<PackageOperationResult> => {
  if (session.role !== 'admin') {
    addAuditLog('SECURITY_VIOLATION', session.email, `Non-admin attempted moderation on package ID: ${packageId}`, 'Security');
    return { success: false, error: 'Forbidden: Only administrators can moderate packages.' };
  }

  const allPackages = getPackages();
  const pkg = allPackages.find(p => p.id === packageId);
  if (!pkg) {
    return { success: false, error: 'Package not found.' };
  }

  let newStatus: PackageStatus = 'APPROVED';
  const updatedCorrectionNotes: CorrectionNote[] = [...(pkg.correctionNotes || [])];

  if (decision === 'APPROVE') {
    newStatus = 'APPROVED';
  } else if (decision === 'REJECT') {
    newStatus = 'REJECTED';
  } else if (decision === 'REQUEST_CORRECTION') {
    newStatus = 'CORRECTION_REQUIRED';
    updatedCorrectionNotes.unshift({
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: session.email,
      message: sanitizeInput(feedbackMessage || 'Please review and update package details.'),
      resolved: false
    });
  }

  const updatedPkg: TravelPackage = {
    ...pkg,
    status: newStatus,
    correctionNotes: updatedCorrectionNotes,
    updatedAt: new Date().toISOString()
  };

  return (async () => {
    try {
      const response = await api.moderatePackage(packageId, decision, feedbackMessage);
      const persistedPackage = response.package;
      savePackages(allPackages.map(p => (p.id === packageId ? persistedPackage : p)));

      addAuditLog('PACKAGE_MODERATED', session.email, `Package "${pkg.title}" (ID: ${packageId}) moderation action: [${newStatus}]. ${feedbackMessage ? `Note: "${feedbackMessage}"` : ''}`, decision === 'REJECT' ? 'Warning' : 'Info');
      return { success: true, package: persistedPackage };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Package moderation failed.' };
    }
  })();
};

/**
 * Admin toggle featured status
 */
export const toggleFeatureSecurePackage = async (packageId: string, session: SessionUser): Promise<PackageOperationResult> => {
  if (session.role !== 'admin') {
    return { success: false, error: 'Forbidden: Only administrators can feature packages.' };
  }

  const allPackages = getPackages();
  const pkg = allPackages.find(p => p.id === packageId);
  if (!pkg) return { success: false, error: 'Package not found.' };

  const nextFeatured = !pkg.featured;
  const updatedPkg: TravelPackage = {
    ...pkg,
    featured: nextFeatured,
    updatedAt: new Date().toISOString()
  };

  try {
    const response = await api.toggleFeaturePackage(packageId);
    savePackages(allPackages.map(p => (p.id === packageId ? response.package : p)));

    addAuditLog('PACKAGE_FEATURE_TOGGLE', session.email, `Package "${pkg.title}" featured status set to: ${response.package.featured}`, 'Info');
    return { success: true, package: response.package };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Featured status could not be updated.' };
  }
};
