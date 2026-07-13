import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks, bottomLinks } from '../../../data/navigation';
import { cn } from '../../../utils/cn';
import { FiX } from 'react-icons/fi';

const NavItem = ({ item, onClick }) => {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
          isActive 
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
            : "text-[var(--color-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-card)]"
        )
      }
    >
      <Icon className="w-5 h-5" />
      <span>{item.name}</span>
    </NavLink>
  );
};

export const Sidebar = ({ isOpen, onClose }) => {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-background)] border-r border-[var(--color-border)] w-64 p-4">
      {/* Logo Area */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2 text-[var(--color-text-main)] font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
            B
          </div>
          <span>BloodAI</span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden text-[var(--color-muted)] hover:text-[var(--color-text-main)] p-2"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navigationLinks.map((item) => (
          <NavItem key={item.name} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="pt-4 border-t border-[var(--color-border)] mt-auto">
        {bottomLinks.map((item) => (
          <NavItem key={item.name} item={item} onClick={onClose} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-50">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};