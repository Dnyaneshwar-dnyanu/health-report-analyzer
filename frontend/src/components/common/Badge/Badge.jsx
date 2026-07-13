import { cn } from '../../../utils/cn';

const variants = {
  default: 'bg-[var(--color-card)] text-[var(--color-text-main)] border-[var(--color-border)]',
  primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20',
  success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20',
  warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20',
  danger: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20',
};

export const Badge = ({ children, variant = 'default', className, icon: Icon }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};
