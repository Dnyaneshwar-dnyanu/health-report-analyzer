import { motion } from 'framer-motion';
import { Section } from '../../../components/common/Section/Section';
import { workflow } from '../data/workflow';

export const HowItWorks = () => {
  return (
    <Section id="how-it-works">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
        <p className="text-[var(--color-muted)]">
          Get your health insights in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connection Line (Hidden on mobile) */}
        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        {workflow.map((step, index) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative flex flex-col items-center text-center px-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center text-xl font-bold text-[var(--color-primary)] mb-6 shadow-sm z-10">
              {step.step}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-[var(--color-muted)] text-sm">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
