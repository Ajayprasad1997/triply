import React, { useState } from 'react';
import { ArrowRight, CheckCircle, FileText, ShieldCheck, SpinnerGap } from '@phosphor-icons/react';
import { api, AgencyApplicationPayload } from '../services/api';
import { S3FileUploader } from './S3FileUploader';

const initialForm: AgencyApplicationPayload = {
  name: '',
  type: 'Travel Agency',
  established: '',
  businessDescription: '',
  registeredAddress: '',
  operatingLocation: '',
  serviceRegions: [],
  destinations: [],
  packageCategories: [],
  website: '',
  socialMediaLinks: [],
  contactName: '',
  contactDesignation: '',
  contactEmail: '',
  contactPhone: '',
  contactWhatsapp: '',
  panNumber: '',
  gstNumber: '',
  registrationDocumentUrl: '',
  addressProofUrl: '',
  supportingDocumentUrls: [],
  travelCertificationUrl: '',
  logoUrl: '',
  bannerUrl: '',
  galleryImages: [],
  brochureUrl: ''
};

const splitList = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean);
const joinList = (value: string[]) => value.join(', ');

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20';
const labelClass = 'mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-slate-700';

export const AgencyOnboardingForm: React.FC = () => {
  const [form, setForm] = useState<AgencyApplicationPayload>(initialForm);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState('');

  const update = <K extends keyof AgencyApplicationPayload>(key: K, value: AgencyApplicationPayload[K]) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    // if (!form.registrationDocumentUrl || !form.addressProofUrl) {
    //   setError('Please upload the registration certificate and address proof before submitting.');
    //   return;
    // }
    if (!consent) {
      setError('Please confirm that the submitted business information is accurate.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.submitAgencyApplication(form);
      setApplicationId(response.applicationId);
      setForm(initialForm);
      setConsent(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (applicationId) {
    return (
      <section id="agency-onboarding" className="scroll-mt-24 rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center shadow-sm sm:p-10">
        <CheckCircle size={48} weight="fill" className="mx-auto text-emerald-600" />
        <h2 className="mt-4 font-heading text-2xl font-black text-emerald-950">Application sent for verification</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm font-medium leading-relaxed text-emerald-800">
          Your agency dossier is now visible in the Triiply administrator verification queue. Keep this reference for follow-up.
        </p>
        <div className="mx-auto mt-5 w-fit rounded-xl border border-emerald-200 bg-white px-5 py-3 font-mono text-sm font-black text-emerald-900">
          {applicationId}
        </div>
        <button type="button" onClick={() => setApplicationId('')} className="mt-6 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-800">
          Submit another agency
        </button>
      </section>
    );
  }

  return (
    <section id="agency-onboarding" className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-6 py-8 text-white sm:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-extrabold text-sky-200">
              <ShieldCheck size={15} weight="fill" /> Official partner application
            </div>
            <h2 className="font-heading text-2xl font-black sm:text-3xl">Register your travel agency</h2>
            <p className="mt-2 max-w-2xl text-xs font-medium leading-relaxed text-slate-300 sm:text-sm">
              Complete the business, contact, verification, and brand details below. Your submission goes directly to the administrator for approval.
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-sky-100">
            Review status: Pending verification
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-9 p-6 sm:p-10">
        <fieldset className="space-y-4">
          <legend className="mb-4 flex items-center gap-2 font-heading text-lg font-black text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs text-white">1</span> Business information</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label><span className={labelClass}>Agency / company name *</span><input required maxLength={120} value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} /></label>
            <label><span className={labelClass}>Business type *</span><select value={form.type} onChange={e => update('type', e.target.value as AgencyApplicationPayload['type'])} className={inputClass}><option>Travel Agency</option><option>DMC</option><option>Tour Operator</option><option>Holiday Provider</option><option>Independent Consultant</option></select></label>
            <label><span className={labelClass}>Year established *</span><input required inputMode="numeric" maxLength={4} placeholder="2018" value={form.established} onChange={e => update('established', e.target.value.replace(/\D/g, '').slice(0, 4))} className={inputClass} /></label>
          </div>
          <label><span className={labelClass}>Business description *</span><textarea required minLength={30} maxLength={1500} rows={4} value={form.businessDescription} onChange={e => update('businessDescription', e.target.value)} className={inputClass} placeholder="Describe your agency, experience, services, and key strengths." /></label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label><span className={labelClass}>Registered office address *</span><textarea required rows={3} value={form.registeredAddress} onChange={e => update('registeredAddress', e.target.value)} className={inputClass} /></label>
            <label><span className={labelClass}>Primary operating location *</span><textarea required rows={3} value={form.operatingLocation} onChange={e => update('operatingLocation', e.target.value)} className={inputClass} /></label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label><span className={labelClass}>Cities / regions served *</span><input required value={joinList(form.serviceRegions)} onChange={e => update('serviceRegions', splitList(e.target.value))} className={inputClass} placeholder="Bengaluru, Karnataka, South India" /></label>
            <label><span className={labelClass}>Destinations covered *</span><input required value={joinList(form.destinations)} onChange={e => update('destinations', splitList(e.target.value))} className={inputClass} placeholder="Dubai, Bali, Maldives" /></label>
            <label><span className={labelClass}>Package categories *</span><input required value={joinList(form.packageCategories)} onChange={e => update('packageCategories', splitList(e.target.value))} className={inputClass} placeholder="Luxury, Family, Adventure" /></label>
            <label><span className={labelClass}>Website</span><input type="url" value={form.website} onChange={e => update('website', e.target.value)} className={inputClass} placeholder="https://agency.com" /></label>
            <label className="sm:col-span-2"><span className={labelClass}>Social media links</span><input value={joinList(form.socialMediaLinks)} onChange={e => update('socialMediaLinks', splitList(e.target.value))} className={inputClass} placeholder="Comma-separated HTTPS links" /></label>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-slate-100 pt-8">
          <legend className="mb-4 flex items-center gap-2 font-heading text-lg font-black text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs text-white">2</span> Authorised contact</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label><span className={labelClass}>Contact person *</span><input required value={form.contactName} onChange={e => update('contactName', e.target.value)} className={inputClass} /></label>
            <label><span className={labelClass}>Designation *</span><input required value={form.contactDesignation} onChange={e => update('contactDesignation', e.target.value)} className={inputClass} placeholder="Founder / Director" /></label>
            <label><span className={labelClass}>Official email *</span><input required type="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} className={inputClass} /></label>
            <label><span className={labelClass}>Phone number *</span><input required type="tel" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} className={inputClass} /></label>
            <label><span className={labelClass}>WhatsApp number *</span><input required type="tel" value={form.contactWhatsapp} onChange={e => update('contactWhatsapp', e.target.value)} className={inputClass} /></label>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-slate-100 pt-8">
          <legend className="mb-1 flex items-center gap-2 font-heading text-lg font-black text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs text-white">3</span> Verification documents</legend>
          <p className="mb-4 text-xs font-medium text-slate-500">Upload verification files directly to secure S3 storage. You can preview each uploaded file before submitting.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label><span className={labelClass}>PAN number *</span><input required maxLength={20} value={form.panNumber} onChange={e => update('panNumber', e.target.value)} className={inputClass} /></label>
            <label><span className={labelClass}>GST number (if applicable)</span><input maxLength={30} value={form.gstNumber} onChange={e => update('gstNumber', e.target.value)} className={inputClass} /></label>
            {/* <S3FileUploader label="Registration certificate / business proof" required value={form.registrationDocumentUrl} onChange={url => update('registrationDocumentUrl', url)} bucketPath="registration-certificate" />
            <S3FileUploader label="Address proof" required value={form.addressProofUrl} onChange={url => update('addressProofUrl', url)} bucketPath="address-proof" />
            <S3FileUploader label="Travel-industry certification" value={form.travelCertificationUrl} onChange={url => update('travelCertificationUrl', url)} bucketPath="travel-certification" />
            <S3FileUploader label="Other supporting document" value={form.supportingDocumentUrls[0] || ''} onChange={url => update('supportingDocumentUrls', url ? [url] : [])} bucketPath="supporting-documents" />
          </div> */}
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-slate-100 pt-8">
          <legend className="mb-1 flex items-center gap-2 font-heading text-lg font-black text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs text-white">4</span> Brand assets</legend>
          <p className="mb-4 text-xs font-medium text-slate-500">Provide HTTPS links to high-resolution assets so the verification team can prepare your agency profile.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label><span className={labelClass}>Agency logo *</span><input required type="url" value={form.logoUrl} onChange={e => update('logoUrl', e.target.value)} className={inputClass} placeholder="https://..." /></label>
            <label><span className={labelClass}>Cover image *</span><input required type="url" value={form.bannerUrl} onChange={e => update('bannerUrl', e.target.value)} className={inputClass} placeholder="https://..." /></label>
            <label><span className={labelClass}>Company / promotional photographs</span><input value={joinList(form.galleryImages)} onChange={e => update('galleryImages', splitList(e.target.value))} className={inputClass} placeholder="Comma-separated HTTPS links" /></label>
            <label><span className={labelClass}>Company profile / brochure</span><input type="url" value={form.brochureUrl} onChange={e => update('brochureUrl', e.target.value)} className={inputClass} placeholder="https://..." /></label>
          </div>
        </fieldset>

        <div className="border-t border-slate-100 pt-7">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-600">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" />
            <span>I confirm that I am authorised to submit this application and that the information and document links are accurate. I consent to verification by the Triiply compliance team.</span>
          </label>
          {error && <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">{error}</div>}
          <button disabled={submitting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-800 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? <SpinnerGap size={18} className="animate-spin" /> : <FileText size={18} weight="bold" />}
            <span>{submitting ? 'Sending application…' : 'Submit for administrator verification'}</span>
            {!submitting && <ArrowRight size={17} weight="bold" />}
          </button>
        </div>
      </form>
    </section>
  );
};
