import { Card } from '../../../components/common/Card/Card';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export const HealthScore = ({ score }) => {
  const data = [{ name: 'Score', value: score, fill: 'var(--color-primary)' }];
  
  // Determine color based on score
  let strokeColor = 'var(--color-success)';
  if (score < 70) strokeColor = 'var(--color-warning)';
  if (score < 50) strokeColor = 'var(--color-danger)';
  
  data[0].fill = strokeColor;

  return (
    <Card className="h-full flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-bold mb-2 w-full text-left">Health Score</h3>
      <div className="h-40 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={12} 
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: 'var(--color-card)', stroke: 'var(--color-border)', strokeWidth: 1 }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-6">
          <span className="text-4xl font-bold" style={{ color: strokeColor }}>{score}</span>
          <span className="text-xs text-[var(--color-muted)]">/ 100</span>
        </div>
      </div>
      <p className="text-sm text-[var(--color-muted)] mt-2">
        Based on overall parameter optimization.
      </p>
    </Card>
  );
};
