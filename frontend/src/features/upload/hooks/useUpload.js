import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUpload = () => {
  const [uploadState, setUploadState] = useState('IDLE'); // IDLE, UPLOADING, PROCESSING, SUCCESS
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const simulateUploadAndProcessing = () => {
    setUploadState('UPLOADING');
    
    // Simulate File Upload (0-50%)
    let currentProgress = 0;
    const uploadInterval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 50) {
        clearInterval(uploadInterval);
        setUploadState('PROCESSING');
        
        // Simulate AI Processing (50-100%)
        const processInterval = setInterval(() => {
          currentProgress += 5;
          setProgress(currentProgress);
          
          if (currentProgress >= 100) {
            clearInterval(processInterval);
            setUploadState('SUCCESS');
          }
        }, 300); // Slower for processing simulation
      }
    }, 150); // Faster for upload simulation
  };

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    
    // Validate file type (PDF preferred)
    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    
    setFile(selectedFile);
    simulateUploadAndProcessing();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const resetUpload = () => {
    setUploadState('IDLE');
    setProgress(0);
    setFile(null);
  };

  return {
    uploadState,
    progress,
    file,
    handleFileSelect,
    handleDrop,
    goToDashboard,
    resetUpload
  };
};
