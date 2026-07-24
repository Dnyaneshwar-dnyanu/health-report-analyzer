import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { reportApi } from '../services/reportApi';
import { uploadApi } from '../services/uploadApi';
import { chatApi } from '../services/chatApi';

const ReportContext = createContext();

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
};

// Data mapper from Flat Backend Schema to Categorized Dashboard Schema
const mapBackendReportToDashboard = (backendReport) => {
  if (!backendReport) return null;

  const params = backendReport.blood_parameters || [];

  // 1. Calculate Health Score (starts at 100, deducts 8 points per HIGH/LOW flag. Capped at [40, 100])
  let deductions = 0;
  params.forEach(p => {
    if (p.flag && (p.flag.toUpperCase() === 'HIGH' || p.flag.toUpperCase() === 'LOW')) {
      deductions += 8;
    }
  });
  const healthScore = Math.max(40, 100 - deductions);

  // 2. Group Parameters by Category
  const categoriesMap = {
    cbc: ['hemoglobin', 'wbc', 'platelet', 'rbc', 'hematocrit', 'white blood', 'red blood', 'mcv', 'mch', 'mchc', 'rdw', 'lymphocytes', 'neutrophils', 'monocytes', 'eosinophils', 'basophils'],
    lipids: ['cholesterol', 'triglycerides', 'ldl', 'hdl', 'vldl', 'lipid'],
    metabolic: ['glucose', 'creatinine', 'urea', 'egfr', 'bun', 'sodium', 'potassium', 'chloride', 'calcium', 'alt', 'ast', 'bilirubin', 'protein', 'albumin', 'globulin', 't3', 't4', 'tsh', 'thyroid'],
    vitamins: ['ferritin', 'folate', 'vitamin', 'iron', 'b12', 'vit d']
  };

  const grouped = {
    'Complete Blood Count (CBC)': [],
    'Lipid Panel': [],
    'Metabolic Panel': [],
    'Vitamins & Minerals': [],
    'Other Parameters': []
  };

  params.forEach(p => {
    const nameLower = p.biomarker.toLowerCase();
    let matched = false;

    for (const [catKey, list] of Object.entries(categoriesMap)) {
      if (list.some(keyword => nameLower.includes(keyword))) {
        if (catKey === 'cbc') grouped['Complete Blood Count (CBC)'].push(p);
        else if (catKey === 'lipids') grouped['Lipid Panel'].push(p);
        else if (catKey === 'metabolic') grouped['Metabolic Panel'].push(p);
        else if (catKey === 'vitamins') grouped['Vitamins & Minerals'].push(p);
        matched = true;
        break;
      }
    }
    if (!matched) {
      grouped['Other Parameters'].push(p);
    }
  });

  const dashboardParameters = Object.entries(grouped)
    .filter(([_, items]) => items.length > 0)
    .map(([categoryName, items]) => ({
      category: categoryName,
      items: items.map(item => ({
        name: item.biomarker,
        value: parseFloat(item.value) || item.value,
        unit: item.unit || '',
        range: item.reference_range || 'N/A',
        status: item.flag ? item.flag.toLowerCase() : 'normal'
      }))
    }));

  // 3. Dynamic Risk Assessment
  const hasHighLipids = params.some(p => {
    const name = p.biomarker.toLowerCase();
    return (name.includes('cholesterol') || name.includes('ldl') || name.includes('triglycerides')) && p.flag && p.flag.toUpperCase() === 'HIGH';
  });
  const hasHighGlucose = params.some(p => {
    const name = p.biomarker.toLowerCase();
    return (name.includes('glucose') || name.includes('hba1c')) && p.flag && p.flag.toUpperCase() === 'HIGH';
  });
  const hasLowHemoglobin = params.some(p => {
    const name = p.biomarker.toLowerCase();
    return (name.includes('hemoglobin') || name.includes('rbc')) && p.flag && p.flag.toUpperCase() === 'LOW';
  });
  const hasAbnormalKidney = params.some(p => {
    const name = p.biomarker.toLowerCase();
    return (name.includes('creatinine') || name.includes('egfr') || name.includes('urea')) && p.flag && (p.flag.toUpperCase() === 'HIGH' || p.flag.toUpperCase() === 'LOW');
  });

  const risks = [
    { name: "Cardiovascular", level: hasHighLipids ? "Moderate" : "Low", score: hasHighLipids ? 65 : 15 },
    { name: "Diabetes", level: hasHighGlucose ? "High" : "Low", score: hasHighGlucose ? 80 : 20 },
    { name: "Anemia", level: hasLowHemoglobin ? "High" : "Low", score: hasLowHemoglobin ? 75 : 10 },
    { name: "Kidney Disease", level: hasAbnormalKidney ? "Moderate" : "Low", score: hasAbnormalKidney ? 55 : 15 }
  ];

  // 4. Source Guideline References
  const sources = [];
  if (hasHighLipids) sources.push({ title: "AHA Guidelines on Lipids", url: "https://www.heart.org" });
  if (hasHighGlucose) sources.push({ title: "ADA Diabetes Standards 2026", url: "https://diabetes.org" });
  if (hasLowHemoglobin) sources.push({ title: "NIH Guide to Iron Deficiency Anemia", url: "https://www.nhlbi.nih.gov" });
  if (sources.length === 0) {
    sources.push({ title: "WHO General Reference Intervals Guide", url: "https://www.who.int" });
  }

  return {
    id: backendReport.report_id,
    date: backendReport.report_date && backendReport.report_date !== 'Unknown' ? backendReport.report_date : backendReport.upload_time.split('T')[0],
    patient: {
      name: backendReport.patient_name && backendReport.patient_name !== 'Unknown' ? backendReport.patient_name : 'Unknown Patient',
      age: backendReport.patient_age || 42,
      gender: backendReport.patient_gender || "Male",
      bloodGroup: backendReport.blood_group || "O+",
    },

    healthScore,
    summary: backendReport.summary || 'No analysis summary generated.',
    risks,
    parameters: dashboardParameters,
    sources
  };
};

export const ReportProvider = ({ children }) => {
  const [currentReportId, setCurrentReportId] = useState(null);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportsList, setReportsList] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [backendHealth, setBackendHealth] = useState('loading'); // 'loading' | 'online' | 'offline'
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check Backend Health
  const checkHealth = useCallback(async () => {
    try {
      setBackendHealth('loading');
      await api.get('/health');
      setBackendHealth('online');
      setError(null);
      return true;
    } catch (err) {
      console.error("Health check failed:", err);
      setBackendHealth('offline');
      return false;
    }
  }, []);

  // Fetch all reports
  const fetchReportsList = useCallback(async () => {
    if (backendHealth === 'offline') return;
    try {
      setLoading(true);
      const list = await reportApi.getAll();
      
      // Transform each report to extract metadata tags and score
      const formattedList = list.map(report => {
        const transformed = mapBackendReportToDashboard(report);
        const tags = transformed.parameters.map(p => p.category.replace(' Panel', '').replace(' (CBC)', ''));
        return {
          id: report.report_id,
          date: transformed.date,
          lab: "Blood Analysis Lab",
          healthScore: transformed.healthScore,
          status: "Processed",
          tags
        };
      });
      setReportsList(formattedList);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [backendHealth]);

  // Load a specific report
  const loadReport = useCallback(async (id) => {
    if (!id) return null;
    try {
      setLoading(true);
      const data = await reportApi.getById(id);
      const dashboardReport = mapBackendReportToDashboard(data);
      setCurrentReport(dashboardReport);
      setCurrentReportId(id);
      setError(null);
      
      // Clear chat history and set standard system greeting when loading new report
      setChatHistory([
        {
          id: 'greeting',
          role: 'system',
          content: `Hello! I have analyzed your blood report (ID: ${id}). I noticed your health score is ${dashboardReport.healthScore}/100. What would you like to know about your results?`
        }
      ]);
      return dashboardReport;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload Report File
  const uploadReport = async (file, onProgress) => {
    try {
      setLoading(true);
      setError(null);
      const data = await uploadApi.upload(file, onProgress);
      const dashboardReport = mapBackendReportToDashboard(data);
      setCurrentReport(dashboardReport);
      setCurrentReportId(data.report_id);
      
      // Refresh reports list
      await fetchReportsList();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a Report
  const deleteReport = async (id) => {
    try {
      setLoading(true);
      await reportApi.delete(id);
      
      // Remove from list
      setReportsList(prev => prev.filter(r => r.id !== id));
      if (currentReportId === id) {
        setCurrentReport(null);
        setCurrentReportId(null);
      }
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Ask AI Chat completions
  const askAI = async (question) => {
    try {
      setError(null);
      const response = await chatApi.ask(question, currentReportId);
      return response.answer || response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };


  // Run initial health verification
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Load list when backend gets online
  useEffect(() => {
    if (backendHealth === 'online') {
      fetchReportsList();
    }
  }, [backendHealth, fetchReportsList]);

  return (
    <ReportContext.Provider value={{
      currentReportId,
      currentReport,
      reportsList,
      chatHistory,
      setChatHistory,
      backendHealth,
      loading,
      error,
      checkHealth,
      fetchReportsList,
      loadReport,
      uploadReport,
      deleteReport,
      askAI
    }}>
      {children}
    </ReportContext.Provider>
  );
};
