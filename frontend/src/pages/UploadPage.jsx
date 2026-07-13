import { motion, AnimatePresence } from 'framer-motion';
import { useUpload } from '../features/upload/hooks/useUpload';
import { UploadZone } from '../features/upload/components/UploadZone';
import { UploadProgress } from '../features/upload/components/UploadProgress';
import { UploadSuccess } from '../features/upload/components/UploadSuccess';
import { Section } from '../components/common/Section/Section';

export const UploadPage = () => {
  const {
    uploadState,
    progress,
    file,
    handleFileSelect,
    handleDrop,
    goToDashboard
  } = useUpload();

  return (
    <div className="flex flex-col min-h-[80vh] justify-center w-full">
      <Section className="py-8 text-center max-w-3xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Analyze Your Report
          </h1>
          <p className="text-[var(--color-muted)] text-lg">
            Upload your blood test document and let our AI extract the insights in seconds.
          </p>
        </motion.div>

        <div className="relative min-h-[350px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {uploadState === 'IDLE' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <UploadZone 
                  onFileSelect={handleFileSelect} 
                  onDrop={handleDrop} 
                />
              </motion.div>
            )}

            {(uploadState === 'UPLOADING' || uploadState === 'PROCESSING') && (
              <motion.div 
                key="progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <UploadProgress 
                  file={file} 
                  progress={progress} 
                  uploadState={uploadState} 
                />
              </motion.div>
            )}

            {uploadState === 'SUCCESS' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <UploadSuccess onGoToDashboard={goToDashboard} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
};
