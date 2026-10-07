import {
  AgencyPartner,
  TravelPackage,
  GalleryPhoto,
  PromotionalCampaign,
  PackageStatus,
  CustomerBooking
} from '../types';

export interface TravelInquiry {
  id: string;
  agencyId: string;
  packageName: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelDate: string;
  travelersCount: number;
  message: string;
  status: 'New' | 'Replied' | 'Closed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Security';
}

export interface PlatformSettings {
  commissionRate: number;
  autoApproveDMCs: boolean;
  notifyOnNewLeads: boolean;
  maintenanceMode: boolean;
  supportEmail: string;
  maxUploadSizeMB: number;
}

export interface AgencyApplicationPayload {
  name: string;
  type: AgencyPartner['type'];
  established: string;
  businessDescription: string;
  registeredAddress: string;
  operatingLocation: string;
  serviceRegions: string[];
  destinations: string[];
  packageCategories: string[];
  website: string;
  socialMediaLinks: string[];
  contactName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  panNumber: string;
  gstNumber: string;
  registrationDocumentUrl: string;
  addressProofUrl: string;
  supportingDocumentUrls: string[];
  travelCertificationUrl: string;
  logoUrl: string;
  bannerUrl: string;
  galleryImages: string[];
  brochureUrl: string;
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');
const API_BASE_URL = configuredApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '');

class ApiClient {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!API_BASE_URL) {
      throw new Error('The backend API URL is not configured for this deployment.');
    }
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      },
      // Authentication is carried only by the backend's HTTP-only cookie.
      credentials: 'include'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data as T;
  }

  // --- Authentication ---
  public async login(credentials: { email: string; password: string }) {
    return this.request<{ success: boolean; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  public async getMe() {
    return this.request<{ success: boolean; user: any; agency?: AgencyPartner }>('/auth/me');
  }

  public async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  public async logout() {
    await this.request('/auth/logout', { method: 'POST' });
  }

  public async createImageUpload(file: File, folder: string) {
    return this.createFileUpload(file, folder, false);
  }

  public async createFileUpload(file: File, folder: string, partnerUpload = true) {
    const signed = await this.request<{
      success: boolean;
      uploadUrl: string;
      publicUrl: string;
      key: string;
    }>(partnerUpload ? '/uploads/partner-presign' : '/uploads/presign', {
      method: 'POST',
      body: JSON.stringify({ contentType: file.type, fileSize: file.size, folder })
    });

    let uploadResponse: Response;
    try {
      uploadResponse = await fetch(signed.uploadUrl, {
        method: 'PUT',
        headers: {
          // This must exactly match the ContentType used to create the
          // presigned URL. Additional x-amz headers can invalidate signatures
          // and are not supported consistently by S3-compatible providers.
          'Content-Type': file.type
        },
        body: file
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Document upload could not reach secure storage. Please try again or contact support if the problem continues.');
      }
      throw error;
    }
    if (!uploadResponse.ok) {
      const storageError = await uploadResponse.text().catch(() => '');
      const errorCode = storageError.match(/<Code>([^<]+)<\/Code>/)?.[1];
      const detail = errorCode ? ` (${errorCode})` : ` (HTTP ${uploadResponse.status})`;
      throw new Error(`The file could not be uploaded to storage${detail}. Please try again.`);
    }
    return { url: signed.publicUrl, key: signed.key };
  }

  // --- Travel Packages ---
  public async getPackages(filters?: {
    status?: string;
    search?: string;
    agencyId?: string;
    category?: string;
    featured?: boolean;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.agencyId) params.append('agencyId', filters.agencyId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured) params.append('featured', 'true');

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ success: boolean; count: number; packages: TravelPackage[] }>(`/packages${queryStr}`);
  }

  public async getPackageById(id: string) {
    return this.request<{ success: boolean; package: TravelPackage }>(`/packages/${id}`);
  }

  public async createPackage(packageData: Partial<TravelPackage>, mode?: 'SAVE_DRAFT' | 'SUBMIT') {
    return this.request<{ success: boolean; message: string; package: TravelPackage }>('/packages', {
      method: 'POST',
      body: JSON.stringify({ ...packageData, mode })
    });
  }

  public async updatePackage(id: string, packageData: Partial<TravelPackage>, mode?: 'SAVE_DRAFT' | 'SUBMIT') {
    return this.request<{ success: boolean; message: string; package: TravelPackage }>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...packageData, mode })
    });
  }

  public async deletePackage(id: string) {
    return this.request<{ success: boolean; message: string }>(`/packages/${id}`, {
      method: 'DELETE'
    });
  }

  public async moderatePackage(id: string, decision: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION', feedbackMessage?: string) {
    return this.request<{ success: boolean; message: string; package: TravelPackage }>(`/packages/${id}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ decision, feedbackMessage })
    });
  }

  public async toggleFeaturePackage(id: string) {
    return this.request<{ success: boolean; message: string; package: TravelPackage }>(`/packages/${id}/feature`, {
      method: 'POST'
    });
  }

  // --- Agencies ---
  public async createAgency(data: Partial<AgencyPartner>) {
    return this.request<{ success: boolean; message: string; agency: AgencyPartner }>('/agencies', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async submitAgencyApplication(data: AgencyApplicationPayload) {
    return this.request<{ success: boolean; message: string; applicationId: string; status: string }>('/agencies/apply', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async getAgencies(filters?: { destination?: string; verified?: boolean; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.destination) params.append('destination', filters.destination);
    if (filters?.verified) params.append('verified', 'true');
    if (filters?.search) params.append('search', filters.search);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ success: boolean; count: number; agencies: AgencyPartner[] }>(`/agencies${queryStr}`);
  }

  public async getAgencyById(id: string) {
    return this.request<{ success: boolean; agency: AgencyPartner; packages: TravelPackage[] }>(`/agencies/${id}`);
  }

  public async updateAgency(id: string, data: Partial<AgencyPartner>) {
    return this.request<{ success: boolean; message: string; agency: AgencyPartner }>(`/agencies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  public async deleteAgency(id: string) {
    return this.request<{ success: boolean; message: string }>(`/agencies/${id}`, {
      method: 'DELETE'
    });
  }

  public async toggleAgencyVerification(id: string, verified?: boolean) {
    return this.request<{ success: boolean; message: string; agency: AgencyPartner }>(`/agencies/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ verified })
    });
  }

  // --- Inquiries ---
  public async getInquiries() {
    return this.request<{ success: boolean; count: number; inquiries: TravelInquiry[] }>('/inquiries');
  }

  public async createInquiry(payload: Partial<TravelInquiry>) {
    return this.request<{ success: boolean; message: string; inquiry: TravelInquiry }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async updateInquiryStatus(id: string, status: 'New' | 'Replied' | 'Closed') {
    return this.request<{ success: boolean; message: string }>(`/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  public async deleteInquiry(id: string) {
    return this.request<{ success: boolean; message: string }>(`/inquiries/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Triply-managed booking requests ---
  public async getBookings() {
    return this.request<{ success: boolean; count: number; bookings: CustomerBooking[] }>('/bookings');
  }

  public async createBooking(booking: CustomerBooking) {
    return this.request<{ success: boolean; message: string; booking: CustomerBooking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    });
  }

  public async saveAdminBooking(booking: CustomerBooking) {
    return this.request<{ success: boolean; message: string; booking: CustomerBooking }>('/bookings/admin', {
      method: 'POST',
      body: JSON.stringify(booking)
    });
  }

  public async updateBookingStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED', notes?: string) {
    return this.request<{ success: boolean; message: string; booking: CustomerBooking }>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }

  public async deleteBooking(id: string) {
    return this.request<{ success: boolean; message: string }>(`/bookings/${id}`, { method: 'DELETE' });
  }

  // --- Gallery ---
  public async getGalleryPhotos(category?: string, featured?: boolean) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (featured) params.append('featured', 'true');

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ success: boolean; count: number; photos: GalleryPhoto[] }>(`/gallery${queryStr}`);
  }

  public async createGalleryPhoto(photo: Partial<GalleryPhoto>) {
    return this.request<{ success: boolean; message: string; photo: GalleryPhoto }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(photo)
    });
  }

  public async updateGalleryPhoto(id: string, photo: Partial<GalleryPhoto>) {
    return this.request<{ success: boolean; message: string; photo: GalleryPhoto }>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(photo)
    });
  }

  public async deleteGalleryPhoto(id: string) {
    return this.request<{ success: boolean; message: string }>(`/gallery/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Promotions ---
  public async getPromotions(placement?: string) {
    const params = new URLSearchParams();
    if (placement) params.append('placement', placement);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ success: boolean; count: number; promotions: PromotionalCampaign[] }>(`/promotions${queryStr}`);
  }

  public async createPromotion(promo: Partial<PromotionalCampaign>) {
    return this.request<{ success: boolean; message: string; promotion: PromotionalCampaign }>('/promotions', {
      method: 'POST',
      body: JSON.stringify(promo)
    });
  }

  public async updatePromotion(id: string, promo: Partial<PromotionalCampaign>) {
    return this.request<{ success: boolean; message: string; promotion: PromotionalCampaign }>(`/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promo)
    });
  }

  public async deletePromotion(id: string) {
    return this.request<{ success: boolean; message: string }>(`/promotions/${id}`, {
      method: 'DELETE'
    });
  }

  public async togglePromotion(id: string) {
    return this.request<{ success: boolean; message: string; promotion: PromotionalCampaign }>(`/promotions/${id}/toggle`, {
      method: 'POST'
    });
  }

  // --- Audit Logs ---
  public async getAuditLogs() {
    return this.request<{ success: boolean; count: number; auditLogs: AuditLog[] }>('/audit-logs');
  }

  public async clearAuditLogs() {
    return this.request<{ success: boolean; message: string }>('/audit-logs', {
      method: 'DELETE'
    });
  }

  // --- Platform Settings ---
  public async getSettings() {
    return this.request<{ success: boolean; settings: PlatformSettings }>('/settings');
  }

  public async updateSettings(settings: Partial<PlatformSettings>) {
    return this.request<{ success: boolean; message: string; settings: PlatformSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // --- AI Assistance ---
  public async generateItineraryAI(payload: { destination: string; days?: number; category?: string; travellerType?: string; budget?: string }) {
    return this.request<{ success: boolean; data: any }>('/ai/generate-itinerary', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async optimizeCopyAI(text: string, type: 'overview' | 'description' = 'overview') {
    return this.request<{ success: boolean; optimizedText: string }>('/ai/optimize-copy', {
      method: 'POST',
      body: JSON.stringify({ text, type })
    });
  }
}

export const api = new ApiClient();
