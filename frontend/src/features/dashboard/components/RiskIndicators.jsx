import { Card } from '../../../components/common/Card/Card';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';

export const RiskIndicators = ({ risks }) => {
  const chartData = risks.map(r => ({
    subject: r.name,
    A: r.score,
    fullMark: 100,
  }));

  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold mb-2">Risk Assessment</h3>
      <p className="text-xs text-[var(--color-muted)] mb-4">Probability of developing conditions based on biomarkers.</p>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Radar 
              name="Risk Score" 
              dataKey="A" 
              stroke="var(--color-primary)" 
              fill="var(--color-primary)" 
              fillOpacity={0.4} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {risks.map(r => (
          <div key={r.name} className="flex justify-between items-center text-xs p-2 bg-[var(--color-background)] rounded-md border border-[var(--color-border)]">
            <span className="text-[var(--color-muted)] truncate max-w-[70px]" title={r.name}>{r.name}</span>
            <span className={
              r.level === 'High' ? 'text-[var(--color-danger)] font-bold' :
              r.level === 'Moderate' ? 'text-[var(--color-warning)] font-bold' :
              'text-[var(--color-success)] font-bold'
            }>{r.level}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
