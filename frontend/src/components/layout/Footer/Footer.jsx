export const Footer = () => {
  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-border)] mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} BloodAI. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
          <a href="#" className="hover:text-[var(--color-text-main)] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[var(--color-text-main)] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[var(--color-text-main)] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};