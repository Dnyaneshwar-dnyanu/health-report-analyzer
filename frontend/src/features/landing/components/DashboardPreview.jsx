import { motion } from 'framer-motion';
import { Section } from '../../../components/common/Section/Section';
import { Card } from '../../../components/common/Card/Card';
import { FiActivity, FiDroplet, FiHeart } from 'react-icons/fi';

export const DashboardPreview = () => {
  return (
    <Section className="py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-5xl"
      >
        {/* Decorative background glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[var(--color-primary)] to-purple-500 opacity-20 blur-xl" />
        
        {/* Mock Dashboard UI */}
        <div className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Health Summary</h3>
              <p className="text-sm text-[var(--color-muted)]">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-3xl font-bold text-[var(--color-success)]">92/100</div>
              <div className="text-xs text-[var(--color-muted)]">Overall Score</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card hover className="bg-[var(--color-card)]/50 border-[var(--color-border)]/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                  <FiDroplet />
                </div>
                <span className="font-medium">Hemoglobin</span>
              </div>
              <div className="text-2xl font-bold">14.2 <span className="text-sm text-[var(--color-muted)] font-normal">g/dL</span></div>
              <div className="text-sm text-[var(--color-success)] mt-1">Optimal Range</div>
            </Card>

            <Card hover className="bg-[var(--color-card)]/50 border-[var(--color-border)]/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--color-warning)]/10 rounded-lg text-[var(--color-warning)]">
                  <FiActivity />
                </div>
                <span className="font-medium">Glucose (Fasting)</span>
              </div>
              <div className="text-2xl font-bold">105 <span className="text-sm text-[var(--color-muted)] font-normal">mg/dL</span></div>
              <div className="text-sm text-[var(--color-warning)] mt-1">Slightly Elevated</div>
            </Card>

            <Card hover className="bg-[var(--color-card)]/50 border-[var(--color-border)]/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--color-danger)]/10 rounded-lg text-[var(--color-danger)]">
                  <FiHeart />
                </div>
                <span className="font-medium">Cholesterol (LDL)</span>
              </div>
              <div className="text-2xl font-bold">140 <span className="text-sm text-[var(--color-muted)] font-normal">mg/dL</span></div>
              <div className="text-sm text-[var(--color-danger)] mt-1">Action Required</div>
            </Card>
          </div>
          
          <div className="rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-4">
            <h4 className="font-medium text-[var(--color-primary)] mb-2">AI Insight</h4>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Your overall lipid profile shows elevated LDL cholesterol. Combined with slightly elevated fasting glucose, we recommend discussing a dietary plan with your physician to reduce cardiovascular risk factors. All other parameters including complete blood count are within healthy optimal ranges.
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};