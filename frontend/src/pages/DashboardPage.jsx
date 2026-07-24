import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiShare2, FiUploadCloud, FiRefreshCw } from 'react-icons/fi';
import { useReportContext } from '../context/ReportContext';
import { PatientSummary } from '../features/dashboard/components/PatientSummary';
import { HealthScore } from '../features/dashboard/components/HealthScore';
import { AISummary } from '../features/dashboard/components/AISummary';
import { RiskIndicators } from '../features/dashboard/components/RiskIndicators';
import { ParameterGrid } from '../features/dashboard/components/ParameterGrid';
import { Button } from '../components/common/Button/Button';
import { Badge } from '../components/common/Badge/Badge';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const DashboardPage = () => {
  const { currentReport, reportsList, loadReport, loading, error } = useReportContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlReportId = searchParams.get('id');

  // Load report based on URL query param, current selection, or latest in history
  useEffect(() => {
    if (urlReportId) {
      if (!currentReport || currentReport.id !== urlReportId) {
        loadReport(urlReportId);
      }
    } else if (!currentReport && reportsList && reportsList.length > 0) {
      loadReport(reportsList[0].id);
    }
  }, [urlReportId, currentReport, reportsList, loadReport]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[var(--color-muted)]">
        <FiRefreshCw className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        <p className="text-sm font-medium">Extracting biomarker visualizations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto">
        <p className="text-[var(--color-danger)] font-semibold">Error Loading Report</p>
        <p className="text-sm text-[var(--color-muted)]">{error}</p>
        <Button onClick={() => reportsList.length > 0 && loadReport(reportsList[0].id)}>
          Retry Loading
        </Button>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-3xl">
          <FiUploadCloud />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-2">No Reports Found</h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            You haven't uploaded any blood reports yet. Please upload a report to inspect detailed biomarker insights, health scores, and charts.
          </p>
        </div>
        <Button icon={FiUploadCloud} onClick={() => navigate('/upload')}>
          Upload Your First Report
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Health Dashboard</h1>
          <p className="text-[var(--color-muted)] flex items-center gap-2">
            Report ID: <Badge>{currentReport.id}</Badge>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={FiShare2}>Share</Button>
          <Button icon={FiDownload} onClick={() => window.print()}>Print / Save PDF</Button>
        </div>
      </div>

      {/* Top Grid: Summary & Score & AI & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <motion.div 
          className="lg:col-span-4 flex flex-col gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex-1 min-h-[200px]">
            <PatientSummary patient={currentReport.patient} date={currentReport.date} />
          </div>
          <div className="flex-1 min-h-[250px]">
            <HealthScore score={currentReport.healthScore} />
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-8 flex flex-col gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex-1">
            <AISummary summary={currentReport.summary} sources={currentReport.sources} />
          </div>
          <div className="flex-1 min-h-[300px]">
            <RiskIndicators risks={currentReport.risks} />
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Parameter Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6 border-b border-[var(--color-border)] pb-4">
          Detailed Biomarkers
        </h2>
        <ParameterGrid parameters={currentReport.parameters} />
      </motion.div>
    </div>
  );
};
