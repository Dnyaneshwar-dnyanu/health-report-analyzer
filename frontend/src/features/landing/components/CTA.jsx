import { useNavigate } from 'react-router-dom';
import { Section } from '../../../components/common/Section/Section';
import { Button } from '../../../components/common/Button/Button';
import { FiArrowRight } from 'react-icons/fi';

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <Section className="pb-24 pt-12">
      <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-purple-500/10" />
        
        <div className="relative p-10 md:p-16 text-center max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to understand your health?
          </h2>
          <p className="text-lg text-[var(--color-muted)] mb-8">
            Join thousands of users who are making data-driven decisions about their well-being.
            No credit card required.
          </p>
          <Button 
            size="lg" 
            icon={FiArrowRight} 
            onClick={() => navigate('/upload')}
            className="px-8 shadow-xl shadow-blue-500/20"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </Section>
  );
};
