import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { Section } from '../../../components/common/Section/Section';
import { faqData } from '../data/faq';
import { cn } from '../../../utils/cn';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-[var(--color-muted)]">
          Everything you need to know about the product and how it works.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="flex items-center justify-between w-full p-5 text-left font-medium transition-colors hover:bg-[var(--color-background)]/50"
              >
                <span>{faq.question}</span>
                <FiChevronDown 
                  className={cn(
                    "w-5 h-5 text-[var(--color-muted)] transition-transform duration-300",
                    isOpen && "transform rotate-180 text-[var(--color-primary)]"
                  )} 
                />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 pt-0 text-[var(--color-muted)] text-sm leading-relaxed border-t border-[var(--color-border)]/50 mt-1 bg-[var(--color-background)]/20">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};
