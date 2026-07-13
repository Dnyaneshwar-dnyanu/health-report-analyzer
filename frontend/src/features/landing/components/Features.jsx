import { motion } from 'framer-motion';
import { Section } from '../../../components/common/Section/Section';
import { Card } from '../../../components/common/Card/Card';
import { features } from '../data/features';

export const Features = () => {
  return (
    <Section id="features" className="bg-[var(--color-card)]/30 border-y border-[var(--color-border)]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose BloodAI?</h2>
        <p className="text-[var(--color-muted)]">
          Our platform combines cutting-edge AI with intuitive design to give you the most comprehensive understanding of your health metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="h-full flex flex-col items-start bg-[var(--color-background)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed flex-1">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};
