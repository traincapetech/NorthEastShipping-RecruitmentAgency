'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'What mandatory documents are required to apply for Merchant Navy positions?',
    answer: 'Standard Merchant Navy applications require a valid Continuous Discharge Certificate (CDC), an international passport with at least 18 months validity, valid STCW-2010 Basic Safety Training modular certificates, INDoS number, and a current DG-approved medical fitness certificate with normal color vision.'
  },
  {
    question: 'Are training programs conducted online or offline?',
    answer: 'All our facilitated training programs (including GP Rating, DNS Officer Cadetship, STCW modular packages, and Pre-Sea ETO) are conducted strictly offline at physical campus academies with certified marine engine/bridge simulators and survival craft facilities. In compliance with maritime training regulations, online classes are not available.'
  },
  {
    question: 'Can candidates without prior sea experience apply for cruise ship positions?',
    answer: 'Yes. For luxury cruise ship hospitality, guest relations, culinary, and spa wellness departments, candidates with verified terrestrial experience in 4/5-star luxury hotels, resorts, or airline passenger handling can apply. Selected candidates are assisted with mandatory STCW passenger ship crowd management courses prior to embarkation.'
  },
  {
    question: 'Does Northeast Shipping charge placement fees to seafarers?',
    answer: 'No. In adherence to the Maritime Labour Convention (MLC 2006) and DG Shipping recruitment guidelines, we uphold an ethical recruitment policy. Seafarers are not charged unauthorized placement fees for securing shipboard employment.'
  },
  {
    question: 'How do I submit an offline training admission enquiry?',
    answer: 'You can navigate to the Training Programs section, review the specific eligibility criteria for courses like GP Rating or DNS, and submit the online enquiry form. An admissions counselor will verify your academic qualifications, age criteria, and guide you through offline campus admission schedules.'
  },
  {
    question: 'How can I track the status of my recruitment application?',
    answer: 'Once you submit your application through our online portal, you can log in to your Candidate Account to monitor application status stages: Submitted, Under Review, Shortlisted, or Selected for Principal Interview.'
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-navy-950 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Clear information regarding recruitment prerequisites, offline training admissions, and seafarer documentation.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card
                key={index}
                className={`p-0 overflow-hidden border-slate-800 transition-colors ${
                  isOpen ? 'border-cyan-500/40 bg-navy-900/90' : 'bg-navy-900/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-cyan-400"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-white hover:text-cyan-300 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
