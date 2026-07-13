import { motion } from 'framer-motion';
import { FiFile, FiCpu, FiLoader } from 'react-icons/fi';
import { Card } from '../../../components/common/Card/Card';

export const UploadProgress = ({ file, progress, uploadState }) => {
  const isProcessing = uploadState === 'PROCESSING';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto"
    >
      <Card className="text-center p-8">
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          {/* Circular Progress SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              className="stroke-[var(--color-border)] fill-none stroke-[8px]"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="44"
              className="stroke-[var(--color-primary)] fill-none stroke-[8px]"
              strokeLinecap="round"
              initial={{ strokeDasharray: "276", strokeDashoffset: "276" }}
              animate={{ strokeDashoffset: 276 - (276 * progress) / 100 }}
              transition={{ ease: "linear", duration: 0.2 }}
            />
          </svg>
          
          <div className="text-[var(--color-primary)] z-10">
            {isProcessing ? (
              <FiCpu className="w-8 h-8 animate-pulse" />
            ) : (
              <FiFile className="w-8 h-8" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2">
          {isProcessing ? 'Analyzing Document' : 'Uploading Report'}
        </h3>
        
        <p className="text-[var(--color-muted)] text-sm mb-6 max-w-xs mx-auto">
          {isProcessing 
            ? 'Extracting biomarkers and generating AI insights...'
            : 'Securely transmitting your report to our servers...'}
        </p>

        <div className="flex items-center justify-between text-xs font-medium bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2 truncate">
            <FiFile className="text-[var(--color-muted)] flex-shrink-0" />
            <span className="truncate">{file?.name || 'document.pdf'}</span>
          </div>
          <span className="text-[var(--color-primary)] ml-4 flex-shrink-0">
            {progress}%
          </span>
        </div>
      </Card>
    </motion.div>
  );
};
