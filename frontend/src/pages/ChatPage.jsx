import { motion } from 'framer-motion';
import { ChatInterface } from '../features/chat/components/ChatInterface';
import { Section } from '../components/common/Section/Section';

export const ChatPage = () => {
  return (
    <Section className="py-4 md:py-8 h-full flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-6 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Interactive AI Chat</h1>
        <p className="text-[var(--color-muted)]">
          Ask specific questions about your reports, biomarkers, and health trends.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full flex-1"
      >
        <ChatInterface />
      </motion.div>
    </Section>
  );
};
