import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export const Card = ({ children, className, hover = false, onClick }) => {
  const Component = onClick || hover ? motion.div : 'div';
  const animationProps = (onClick || hover) ? {
    whileHover: { y: -4 },
    transition: { type: 'spring', stiffness: 300 }
  } : {};

  return (
    <Component
      onClick={onClick}
      {...animationProps}
      className={cn(
        'bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm',
        (onClick || hover) && 'cursor-pointer hover:shadow-md hover:border-[var(--color-primary)]/50 transition-all',
        className
      )}
    >
      {children}
    </Component>
  );
};
