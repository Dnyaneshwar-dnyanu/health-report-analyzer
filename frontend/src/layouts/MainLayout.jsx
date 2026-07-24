import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar/Sidebar';
import { Navbar } from '../components/layout/Navbar/Navbar';
import { Footer } from '../components/layout/Footer/Footer';
import { useReportContext } from '../context/ReportContext';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../components/common/Button/Button';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { backendHealth, checkHealth } = useReportContext();

  if (backendHealth === 'offline') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-background)] text-[var(--color-text-main)] font-sans">
        <div className="max-w-md w-full bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-2xl shadow-xl text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center text-3xl animate-pulse">
            <FiAlertTriangle />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Backend Connection Offline</h1>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              We are unable to connect to the BloodAI analytics engine. Make sure the FastAPI server is running on <code className="px-1.5 py-0.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs font-mono">localhost:8000</code> and try again.
            </p>
          </div>
          <Button 
            icon={FiRefreshCw} 
            onClick={checkHealth}
            className="w-full justify-center"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text-main)] font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {backendHealth === 'loading' ? (
              <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[var(--color-muted)]">
                <FiRefreshCw className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                <p className="text-sm font-medium">Verifying server health...</p>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};