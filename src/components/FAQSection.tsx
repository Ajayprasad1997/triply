import React, { useState, useEffect } from 'react';
import { getHomepageConfig } from '../data/mockData';
import { 
  MagnifyingGlass, 
  CaretDown, 
  CaretUp, 
  ChatCircle
} from '@phosphor-icons/react';

interface FAQSectionProps {
  onOpenRegister: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenRegister }) => {
  const [config, setConfig] = useState(() => getHomepageConfig().faqs);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getHomepageConfig().faqs);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const faqs = config?.faqs || (config as any)?.items || [];

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(faqs.map((f: any) => f.category).filter(Boolean))) as string[]];

  const filteredFaqs = faqs.filter((faq: any) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white text-slate-900 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {config.badgeText && (
            <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase block mb-1">
              {config.badgeText}
            </span>
          )}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {config.headingStart || 'Everything You Need to Know About'}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              {config.headingGradient || 'Partnering with Triiply'}
            </span>
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            {config.subtitle || 'Got questions about registration, commission policies, or package publishing? We have answers.'}
          </p>
        </div>

        {/* Search Input & Category Filters */}
        <div className="space-y-4 mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <MagnifyingGlass size={20} className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g., verification, fees, packages)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-medium text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq: any) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-md font-sans">
                        {faq.category}
                      </span>
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <CaretUp size={20} className="text-sky-600 shrink-0" />
                    ) : (
                      <CaretDown size={20} className="text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              No matching questions found for "{searchTerm}". Try another search or category.
            </div>
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-heading font-bold text-slate-900 text-base">Still have questions?</h4>
            <p className="text-xs text-slate-600">Our partner success team is available to guide your agency onboarding.</p>
          </div>
          <button
            onClick={onOpenRegister}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ChatCircle size={16} weight="duotone" className="text-sky-400" />
            <span>Talk to Partner Onboarding</span>
          </button>
        </div>

      </div>
    </section>
  );
};
