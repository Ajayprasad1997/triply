import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Envelope, FileText, ShieldCheck } from '@phosphor-icons/react';

type LegalSection = { title: string; paragraphs?: string[]; items?: string[] };

interface LegalPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  sections: LegalSection[];
}

export const LegalPage: React.FC<LegalPageProps> = ({ eyebrow, title, summary, sections }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = `${title} | Triiply`;
    return () => { document.title = 'Triiply'; };
  }, [title]);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.22),transparent_40%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition-colors hover:text-white">
            <ArrowLeft size={17} weight="bold" /> Back to Triiply
          </Link>
          <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-sky-300">
            <ShieldCheck size={18} weight="fill" /> {eyebrow}
          </div>
          <h1 className="max-w-3xl font-heading text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{summary}</p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
            <FileText size={16} /> Last updated: 21 September 2026
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-16">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">On this page</p>
          <nav aria-label={`${title} sections`}>
            <ol className="space-y-2">
              {sections.map((section, index) => (
                <li key={section.title}><a href={`#section-${index + 1}`} className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600">{index + 1}. {section.title}</a></li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="rounded-3xl border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-10">
          <div className="space-y-10">
            {sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-24">
                <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">{index + 1}. {section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.items && <ul className="list-disc space-y-2 pl-5 marker:text-sky-500">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-sky-100 bg-sky-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Envelope size={22} className="mt-0.5 shrink-0 text-blue-600" weight="duotone" />
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">Questions about this policy?</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">Contact Triiply at <a href="mailto:partnerships@triiply.com" className="font-bold text-blue-700 hover:underline">partnerships@triiply.com</a> or through our <Link to="/contact" className="font-bold text-blue-700 hover:underline">contact page</Link>.</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export const PrivacyPolicyPage: React.FC = () => (
  <LegalPage eyebrow="Your data, handled responsibly" title="Privacy Policy" summary="This policy explains what information Triiply collects, why we collect it, how we use and protect it, and the choices available to travelers and travel partners." sections={[
    { title: 'Scope and who we are', paragraphs: ['This Privacy Policy applies to the Triiply website, partner dashboard, booking and inquiry experiences, and related services operated by Triiply Technologies Private Limited (collectively, the “Services”). Triiply connects travelers with independent travel agencies, tour operators, and destination management companies.'] },
    { title: 'Information we collect', paragraphs: ['We collect information you provide directly, information generated when you use the Services, and limited information received from service providers and travel partners.'], items: ['Account and identity details, such as name, business name, email address, phone number, and login credentials.', 'Travel inquiry and booking details, such as destination, dates, preferences, traveler information, and messages.', 'Partner verification information, including business registration, licensing, tax, address, and representative details.', 'Technical and usage information, such as IP address, device and browser type, pages visited, timestamps, and security logs.', 'Communications, support requests, reviews, feedback, and other content you choose to submit.'] },
    { title: 'How we use information', items: ['Provide, personalize, maintain, and improve the Services.', 'Create and secure accounts, verify travel partners, and prevent fraud or misuse.', 'Route inquiries and booking requests to the relevant independent travel partner.', 'Communicate about accounts, requests, service updates, support, and—where permitted—relevant promotions.', 'Measure performance, troubleshoot issues, comply with law, and enforce our agreements.'] },
    { title: 'How information is shared', paragraphs: ['We do not sell personal information. We may share it with the travel partner you contact or book with, vendors that support hosting, communications, analytics, security, and payment-related functions, professional advisers, or authorities when legally required. We may also transfer information as part of a merger, financing, reorganization, or sale of all or part of our business. Independent travel partners process information under their own privacy practices.'] },
    { title: 'Cookies and similar technologies', paragraphs: ['We may use essential cookies and local storage to keep you signed in, remember preferences, protect the Services, and maintain core functionality. We may also use analytics technologies to understand usage and improve performance. You can control many cookies through your browser, but disabling essential storage may affect functionality.'] },
    { title: 'Data retention and security', paragraphs: ['We retain information only as long as reasonably necessary for the purposes described in this policy, including legal, accounting, dispute-resolution, fraud-prevention, and security needs. We use administrative, technical, and organizational safeguards designed to protect information; however, no online service can guarantee absolute security.'] },
    { title: 'Your choices and rights', paragraphs: ['Depending on applicable law, you may ask to access, correct, update, delete, or restrict use of your personal information, withdraw consent, or object to certain processing. You may also opt out of promotional communications using the unsubscribe method provided. We may need to verify your identity before completing a request.'] },
    { title: 'Children and international processing', paragraphs: ['The Services are not intended for children under 18 to use independently. A parent, guardian, or responsible adult should provide information for minors included in a travel booking. Information may be processed in countries other than your own, subject to appropriate safeguards and applicable law.'] },
    { title: 'Changes to this policy', paragraphs: ['We may update this policy as the Services or legal requirements change. We will post the revised version here and update the effective date. Material changes may also be communicated through the Services or by email where appropriate.'] },
  ]} />
);

export const TermsConditionsPage: React.FC = () => (
  <LegalPage eyebrow="Rules for using Triiply" title="Terms & Conditions" summary="These terms govern access to and use of Triiply by travelers, visitors, travel agencies, tour operators, destination management companies, and other partners." sections={[
    { title: 'Acceptance of terms', paragraphs: ['By accessing or using Triiply, you agree to these Terms & Conditions and our Privacy Policy. If you use the Services for an organization, you confirm that you have authority to bind that organization. If you do not agree, do not use the Services. You must be at least 18 years old and legally able to enter into a binding agreement.'] },
    { title: 'Triiply’s role', paragraphs: ['Triiply provides technology that helps independent travel partners publish storefronts and packages and receive traveler inquiries or booking requests. Unless expressly stated otherwise, Triiply is not the organizer, supplier, or operator of travel services and is not a party to the contract between a traveler and a travel partner. Each partner is responsible for its listings, quotations, licenses, service delivery, refunds, and customer obligations.'] },
    { title: 'Accounts and security', items: ['Provide accurate, current, and complete information and keep it updated.', 'Keep account credentials confidential and promptly report suspected unauthorized access.', 'Accept responsibility for activity performed through your account.', 'Do not impersonate another person or create an account using misleading or unauthorized information.'] },
    { title: 'Listings, inquiries, and bookings', paragraphs: ['Package details, prices, availability, inclusions, exclusions, visa guidance, cancellation terms, and other listing content are supplied by independent travel partners and may change. Travelers must review the final quotation and partner terms before paying or confirming. An inquiry or booking request submitted on Triiply does not by itself guarantee availability or form a confirmed booking.'] },
    { title: 'Payments, cancellations, and refunds', paragraphs: ['Unless Triiply expressly identifies itself as the merchant of record, payments are made directly to the applicable travel partner and are governed by that partner’s payment, cancellation, amendment, and refund terms. Travelers should obtain a receipt and retain the confirmed itinerary. Triiply does not hold partner funds and is not responsible for chargebacks, refunds, currency changes, or partner insolvency.'] },
    { title: 'Partner responsibilities', items: ['Maintain all registrations, permits, insurance, tax records, and travel-industry licenses required by law.', 'Publish accurate, lawful, and non-misleading content and honor confirmed commitments.', 'Protect traveler information and use it only to respond to requests and deliver agreed services.', 'Clearly disclose prices, taxes, exclusions, cancellation rules, and material travel risks.', 'Comply with consumer protection, privacy, advertising, sanctions, and other applicable laws.'] },
    { title: 'Acceptable use', items: ['Do not use the Services for unlawful, fraudulent, deceptive, abusive, or harmful activity.', 'Do not scrape, probe, overload, reverse engineer, bypass security, or disrupt the Services.', 'Do not upload malware or content that infringes intellectual property, privacy, or other rights.', 'Do not send unsolicited communications or misuse traveler or partner contact details.', 'Do not manipulate reviews, verification indicators, availability, or pricing.'] },
    { title: 'Content and intellectual property', paragraphs: ['Triiply and its licensors own the Services, software, branding, design, and related intellectual property. You retain ownership of content you submit, but grant Triiply a worldwide, non-exclusive, royalty-free license to host, reproduce, format, display, distribute, and promote that content for operating and marketing the Services. You confirm that you have the rights needed to grant this license.'] },
    { title: 'Disclaimers and limitation of liability', paragraphs: ['The Services are provided on an “as is” and “as available” basis to the extent permitted by law. Triiply does not guarantee uninterrupted access, listing accuracy, partner performance, travel outcomes, or availability. To the fullest extent permitted by law, Triiply will not be liable for indirect, incidental, special, consequential, or punitive damages, loss of profits or data, or acts and omissions of independent travel partners or third-party suppliers. Nothing in these terms excludes liability that cannot lawfully be excluded.'] },
    { title: 'Suspension and termination', paragraphs: ['We may restrict, suspend, or terminate access where we reasonably believe these terms were breached, security is at risk, information is misleading, fees are overdue, or action is necessary to protect users, Triiply, or third parties. You may stop using the Services at any time. Provisions that by their nature should survive termination will remain effective.'] },
    { title: 'Governing law and disputes', paragraphs: ['These terms are governed by the laws of India. Courts in Bengaluru, Karnataka will have exclusive jurisdiction, subject to any mandatory consumer rights or dispute-resolution requirements under applicable law. Before filing a claim, the parties should first try in good faith to resolve the dispute by contacting Triiply.'] },
    { title: 'Changes and general terms', paragraphs: ['We may update these terms to reflect changes to the Services or law. Continued use after updated terms take effect constitutes acceptance. If any provision is unenforceable, the remaining provisions remain in effect. Our failure to enforce a provision is not a waiver. You may not assign these terms without our consent; Triiply may assign them as part of a reorganization or business transfer.'] },
  ]} />
);
