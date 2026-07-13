import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-[var(--color-muted)] hover:text-[var(--color-text-main)] transition-colors rounded-lg hover:bg-[var(--color-card)]"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-[var(--color-text-main)]">BloodAI</span>
      </div>

      {/* Desktop Search (Placeholder) */}
      <div className="hidden lg:flex flex-1 max-w-md ml-4">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] w-4 h-4" />
          <input
            type="text"
            placeholder="Search reports, parameters..."
            className="w-full bg-[var(--color-card)] border border-[var(--color-border)] text-sm rounded-lg pl-10 pr-4 py-2 text-[var(--color-text-main)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        <button className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text-main)] transition-colors rounded-lg hover:bg-[var(--color-card)] relative">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-danger)]" />
        </button>
        
        {/* User Profile Avatar */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 flex items-center justify-center text-white font-medium text-sm cursor-pointer shadow-sm hover:opacity-90 transition-opacity">
          JD
        </div>
      </div>
    </header>
  );
};