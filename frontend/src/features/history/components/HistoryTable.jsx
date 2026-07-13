import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiChevronRight, FiDownload } from 'react-icons/fi';
import { mockHistory } from '../data/mockHistory';
import { Badge } from '../../../components/common/Badge/Badge';
import { cn } from '../../../utils/cn';

export const HistoryTable = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
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
            {mockHistory.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-[var(--color-background)] transition-colors group cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text-main)]">{report.date}</p>
                      <p className="text-xs text-[var(--color-muted)] font-mono">{report.id}</p>
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
                      onClick={(e) => { e.stopPropagation(); /* Mock Download */ }}
                      className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                      title="Download Original PDF"
                    >
                      <FiDownload className="w-4 h-4" />
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
