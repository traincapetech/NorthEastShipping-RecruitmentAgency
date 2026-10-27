import React from 'react';
import { Hero } from '@/components/home/Hero';
import { RecruitmentHighlights } from '@/components/home/RecruitmentHighlights';
import { CareerCategories } from '@/components/home/CareerCategories';
import { TrainingHighlights } from '@/components/home/TrainingHighlights';
import { ProcessWorkflow } from '@/components/home/ProcessWorkflow';
import { AboutOverview } from '@/components/home/AboutOverview';
import { TrustSection } from '@/components/home/TrustSection';
import { FAQSection } from '@/components/home/FAQSection';
import { ContactCTA } from '@/components/home/ContactCTA';
import { getOpportunities } from '@/services/recruitment.service';
import { getTrainingPrograms } from '@/services/training.service';

export default async function HomePage() {
  const [opportunities, programs] = await Promise.all([
    getOpportunities(),
    getTrainingPrograms()
  ]);

  return (
    <>
      {/* 1. Cinematic Maritime Hero Section */}
      <Hero />

      {/* 2. Featured Recruitment Opportunities */}
      <RecruitmentHighlights opportunities={opportunities} />

      {/* 3. Career Categories (Maritime, Cruise, Hospitality, Technical) */}
      <CareerCategories />

      {/* 4. Offline Training Program Highlights */}
      <TrainingHighlights programs={programs} />

      {/* 5. How Recruitment Applications Work */}
      <ProcessWorkflow />

      {/* 6. Company Introduction / About Overview */}
      <AboutOverview />

      {/* 7. Institutional Trust & Verification */}
      <TrustSection />

      {/* 8. Frequently Asked Questions */}
      <FAQSection />

      {/* 9. Contact CTA */}
      <ContactCTA />
    </>
  );
}
