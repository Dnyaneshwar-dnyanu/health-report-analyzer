import { motion } from 'framer-motion';
import { Section } from '../components/common/Section/Section';
import { HistoryTable } from '../features/history/components/HistoryTable';
import { Button } from '../components/common/Button/Button';
import { FiFilter, FiUploadCloud } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const HistoryPage = () => {
  const navigate = useNavigate();

  return (
    <Section className="py-4 md:py-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Report History</h1>
          <p className="text-[var(--color-muted)]">
            View and compare your past blood reports over time.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Button variant="secondary" icon={FiFilter}>Filter</Button>
          <Button icon={FiUploadCloud} onClick={() => navigate('/upload')}>
            New Report
          </Button>
        </motion.div>
      </div>

      <HistoryTable />
    </Section>
  );
};
