import { motion } from 'framer-motion';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import { mockReport } from '../features/dashboard/data/mockReport';
import { PatientSummary } from '../features/dashboard/components/PatientSummary';
import { HealthScore } from '../features/dashboard/components/HealthScore';
import { AISummary } from '../features/dashboard/components/AISummary';
import { RiskIndicators } from '../features/dashboard/components/RiskIndicators';
import { ParameterGrid } from '../features/dashboard/components/ParameterGrid';
import { Button } from '../components/common/Button/Button';
import { Badge } from '../components/common/Badge/Badge';

export const DashboardPage = () => {
  return (
    <div className="flex flex-col w-full pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Health Dashboard</h1>
          <p className="text-[var(--color-muted)] flex items-center gap-2">
            Report ID: <Badge>{mockReport.id}</Badge>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={FiShare2}>Share</Button>
          <Button icon={FiDownload}>Download PDF</Button>
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
            <PatientSummary patient={mockReport.patient} date={mockReport.date} />
          </div>
          <div className="flex-1 min-h-[250px]">
            <HealthScore score={mockReport.healthScore} />
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-8 flex flex-col gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex-1">
            <AISummary summary={mockReport.summary} sources={mockReport.sources} />
          </div>
          <div className="flex-1 min-h-[300px]">
            <RiskIndicators risks={mockReport.risks} />
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
        <ParameterGrid parameters={mockReport.parameters} />
      </motion.div>
    </div>
  );
};
