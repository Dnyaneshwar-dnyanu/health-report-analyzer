import { Hero } from '../features/landing/components/Hero';
import { DashboardPreview } from '../features/landing/components/DashboardPreview';
import { Features } from '../features/landing/components/Features';
import { HowItWorks } from '../features/landing/components/HowItWorks';
import { TechStack } from '../features/landing/components/TechStack';
import { FAQ } from '../features/landing/components/FAQ';
import { CTA } from '../features/landing/components/CTA';

export const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <DashboardPreview />
      <Features />
      <HowItWorks />
      <TechStack />
      <FAQ />
      <CTA />
    </div>
  );
};