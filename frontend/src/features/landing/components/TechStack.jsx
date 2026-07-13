import { motion } from 'framer-motion';
import { Section } from '../../../components/common/Section/Section';

const stack = [
  { name: 'React', icon: '⚛️' },
  { name: 'Vite', icon: '⚡' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'FastAPI', icon: '🚀' },
  { name: 'Python', icon: '🐍' },
  { name: 'LLM Agents', icon: '🧠' }
];

export const TechStack = () => {
  return (
    <Section className="bg-[var(--color-card)]/30 border-y border-[var(--color-border)] py-12 md:py-16">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Powered by Modern Technology
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
        {stack.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] shadow-sm"
          >
            <span className="text-xl">{tech.icon}</span>
            <span className="font-medium text-sm text-[var(--color-muted)]">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
