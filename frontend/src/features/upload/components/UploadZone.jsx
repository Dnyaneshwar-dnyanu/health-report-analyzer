import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export const UploadZone = ({ onFileSelect, onDrop }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDropInternal = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    onDrop(e);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    onFileSelect(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropInternal}
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden bg-[var(--color-card)]",
          isDragActive 
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" 
            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-card)]/80"
        )}
      >
        {/* Background Decorative Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-purple-500/5 pointer-events-none" />

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="application/pdf"
          className="hidden" 
        />
        
        <div className="w-20 h-20 mb-6 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center shadow-sm text-[var(--color-primary)]">
          <FiUploadCloud className="w-10 h-10" />
        </div>
        
        <h3 className="mb-2 text-2xl font-bold text-[var(--color-text-main)]">
          Upload Blood Report
        </h3>
        
        <p className="mb-6 text-sm text-[var(--color-muted)] text-center max-w-md">
          Drag and drop your PDF report here, or click to browse. 
          Our AI will extract and analyze your parameters instantly.
        </p>

        <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-muted)] bg-[var(--color-background)] px-4 py-2 rounded-lg border border-[var(--color-border)]">
          <FiFileText className="w-4 h-4" />
          Supported formats: PDF (Max 10MB)
        </div>
      </div>
    </motion.div>
  );
};
