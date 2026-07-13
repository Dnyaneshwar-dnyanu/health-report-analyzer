import { cn } from '../../../utils/cn';

export const Section = ({ children, className, id }) => {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};
