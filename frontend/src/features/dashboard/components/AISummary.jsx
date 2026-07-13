import { Card } from '../../../components/common/Card/Card';
import { FiCpu, FiExternalLink } from 'react-icons/fi';

export const AISummary = ({ summary, sources }) => {
  return (
    <Card className="h-full border-[var(--color-primary)]/20 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--color-primary)] relative z-10">
        <FiCpu /> AI Analysis Summary
      </h3>
      
      <p className="text-[var(--color-text-main)] text-sm leading-relaxed mb-6 relative z-10">
        {summary}
      </p>

      {sources && sources.length > 0 && (
        <div className="pt-4 border-t border-[var(--color-border)] relative z-10">
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
            Medical Sources Reference
          </p>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.url} 
                className="inline-flex items-center gap-1.5 text-xs bg-[var(--color-background)] px-2.5 py-1.5 rounded-md border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] transition-colors"
              >
                {source.title}
                <FiExternalLink />
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
