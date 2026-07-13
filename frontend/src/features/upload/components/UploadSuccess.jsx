import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { Card } from '../../../components/common/Card/Card';
import { Button } from '../../../components/common/Button/Button';

export const UploadSuccess = ({ onGoToDashboard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="text-center p-8 border-[var(--color-success)]/30 bg-[var(--color-success)]/5 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[var(--color-success)]/20 blur-3xl rounded-full" />
        
        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center text-[var(--color-success)]"
          >
            <FiCheckCircle className="w-10 h-10" />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
          
          <p className="text-[var(--color-muted)] text-sm mb-8">
            Your report has been successfully processed. The dashboard is ready with your personalized insights.
          </p>
          
          <Button 
            fullWidth 
            size="lg" 
            onClick={onGoToDashboard}
            icon={FiArrowRight}
            className="bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white shadow-lg shadow-green-500/20"
          >
            View Results
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
