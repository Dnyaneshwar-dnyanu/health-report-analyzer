import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg shadow-blue-500/20',
  secondary: 'bg-[var(--color-card)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:bg-[var(--color-border)]',
  outline: 'bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 shadow-lg shadow-red-500/20',
  ghost: 'bg-transparent text-[var(--color-text-main)] hover:bg-[var(--color-card)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  icon: Icon,
  fullWidth,
  onClick,
  type = 'button',
  disabled
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
};
