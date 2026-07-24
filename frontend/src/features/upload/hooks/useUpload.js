import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useReportContext } from "../../../context/ReportContext";

export const useUpload = () => {
  const [uploadState, setUploadState] = useState("IDLE");
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const { uploadReport, loadReport } = useReportContext();

  const navigate = useNavigate();

  // Upload file to backend
  const uploadFile = async (selectedFile) => {
    try {
      setUploadState("UPLOADING");
      setProgress(0);

      // Perform upload using ReportContext
      const response = await uploadReport(selectedFile, (percent) => {
        setProgress(percent);
        if (percent >= 100) {
          // Transition to processing state once upload is fully done
          setUploadState("PROCESSING");
        }
      });

      // Once successfully processed by parser
      setUploadState("SUCCESS");

      // Load report details into global state
      if (response && response.report_id) {
        await loadReport(response.report_id);
      }

      return response;
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadState("IDLE");
      setProgress(0);
      alert(error.message || "Failed to process PDF report. Please verify it is a valid format.");
      throw error;
    }
  };

  // Handle file selection
  const handleFileSelect = useCallback(
    async (selectedFile) => {
      if (!selectedFile) return;

      if (selectedFile.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
      }

      setFile(selectedFile);

      try {
        await uploadFile(selectedFile);
      } catch (error) {
        console.error(error);
      }
    },
    [uploadReport]
  );

  // Handle drag & drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();

      const droppedFile = e.dataTransfer.files[0];

      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  // Navigate to dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  // Reset upload state
  const resetUpload = () => {
    setUploadState("IDLE");
    setProgress(0);
    setFile(null);
  };

  return {
    uploadState,
    progress,
    file,
    handleFileSelect,
    handleDrop,
    uploadFile,
    goToDashboard,
    resetUpload,
  };
};