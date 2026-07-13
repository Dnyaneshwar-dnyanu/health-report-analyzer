import { motion } from 'framer-motion';
import { FiUser, FiCpu } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
        isUser ? "bg-[var(--color-primary)] text-white" : "bg-purple-500 text-white"
      )}>
        {isUser ? <FiUser className="w-5 h-5" /> : <FiCpu className="w-5 h-5" />}
      </div>

      {/* Message Content */}
      <div className={cn(
        "max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
        isUser 
          ? "bg-[var(--color-primary)] text-white rounded-tr-sm" 
          : "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-main)] rounded-tl-sm"
      )}>
        {message.content}
      </div>
    </motion.div>
  );
};
