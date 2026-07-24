import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiChevronRight, FiDownload, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useReportContext } from '../../../context/ReportContext';
import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { cn } from '../../../utils/cn';

export const HistoryTable = () => {
  const navigate = useNavigate();
  const { reportsList, deleteReport, loading, error, fetchReportsList } = useReportContext();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this blood report? This will remove all extracted biomarkers and delete the uploaded file from the server.");
    if (confirmed) {
      await deleteReport(id);
    }
  };

  const handleDownload = (e, id) => {
    e.stopPropagation();
    // In a real browser, this opens the download route, but for safety:
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    // Let's redirect to download or view endpoint
    window.open(`${baseUrl}/api/reports/${id}`, '_blank');
  };

  if (loading && reportsList.length === 0) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
        <FiRefreshCw className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        <p className="text-sm text-[var(--color-muted)] font-medium">Fetching history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 text-center">
        <p className="text-[var(--color-danger)] font-semibold">Failed to load history</p>
        <p className="text-sm text-[var(--color-muted)]">{error}</p>
        <Button onClick={fetchReportsList}>Retry</Button>
      </div>
    );
  }

  if (reportsList.length === 0) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-8 text-center max-w-md mx-auto">
        <div className="p-4 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-3xl">
          <FiFileText />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">No Ingested Reports</h3>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            Your report database history is empty. Ingest your first PDF using the upload page.
          </p>
        </div>
        <Button onClick={() => navigate('/upload')}>Upload PDF</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-background)]/50 border-b border-[var(--color-border)]">
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Report Info</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Lab</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Health Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Tags</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {reportsList.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-[var(--color-background)] transition-colors group cursor-pointer"
                onClick={() => navigate(`/dashboard?id=${report.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text-main)]">{report.date}</p>
                      <p className="text-xs text-[var(--color-muted)] font-mono">{report.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-muted)]">
                  {report.lab}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center font-bold text-xs">
                      {report.healthScore}
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      report.healthScore >= 80 ? "text-[var(--color-success)]" :
                      report.healthScore >= 60 ? "text-[var(--color-warning)]" :
                      "text-[var(--color-danger)]"
                    )}>
                      {report.healthScore >= 80 ? 'Good' : report.healthScore >= 60 ? 'Fair' : 'Poor'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {report.tags.map(tag => (
                      <Badge key={tag} variant="default" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleDownload(e, report.id)}
                      className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                      title="Inspect Original JSON"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, report.id)}
                      className="p-2 text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-background)] rounded-lg transition-colors">
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
