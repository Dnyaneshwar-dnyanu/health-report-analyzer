import { Modal } from '../../../components/common/Modal/Modal';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { mockParameterDetails, fallbackParameterDetails } from '../data/mockParameterDetails';
import { FiTrendingUp, FiInfo, FiHeart, FiAlertTriangle } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export const ParameterDetailsModal = ({ isOpen, onClose, parameter }) => {
  if (!parameter) return null;

  const details = mockParameterDetails[parameter.name] || fallbackParameterDetails;
  
  // Use current value as the last data point if fallback is used to make the graph look realistic
  const chartData = details.historicalData.map(d => ({...d}));
  if (!mockParameterDetails[parameter.name]) {
    chartData[chartData.length - 1].value = parameter.value;
  }

  const isHigh = parameter.status === 'high';
  const isLow = parameter.status === 'low';
  const statusColor = isHigh ? 'var(--color-danger)' : isLow ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${parameter.name} Details`}>
      {/* Current Status Banner */}
      <div className={cn(
        "flex items-center justify-between p-4 rounded-xl mb-6 border",
        isHigh ? "bg-[var(--color-danger)]/5 border-[var(--color-danger)]/20" :
        isLow ? "bg-[var(--color-warning)]/5 border-[var(--color-warning)]/20" :
        "bg-[var(--color-success)]/5 border-[var(--color-success)]/20"
      )}>
        <div>
          <p className="text-sm text-[var(--color-muted)] mb-1">Current Value</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{parameter.value}</span>
            <span className="text-[var(--color-muted)]">{parameter.unit}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--color-muted)] mb-1">Reference Range</p>
          <p className="font-semibold">{parameter.range}</p>
          <p className="text-xs mt-1 font-bold" style={{ color: statusColor }}>
            {parameter.status.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h4 className="flex items-center gap-2 font-bold mb-2 text-[var(--color-text-main)]">
          <FiInfo className="text-[var(--color-primary)]" /> What is {parameter.name}?
        </h4>
        <p className="text-[var(--color-muted)] text-sm leading-relaxed">
          {details.description}
        </p>
      </div>

      {/* Historical Trend Chart */}
      <div className="mb-8">
        <h4 className="flex items-center gap-2 font-bold mb-4 text-[var(--color-text-main)]">
          <FiTrendingUp className="text-[var(--color-primary)]" /> 6-Month Trend
        </h4>
        <div className="h-48 w-full bg-[var(--color-background)] rounded-xl p-4 border border-[var(--color-border)]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-primary)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--color-background)', stroke: 'var(--color-primary)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--color-background)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights & Advice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)]">
          <h4 className="flex items-center gap-2 font-bold mb-3 text-sm">
            <FiAlertTriangle className="text-[var(--color-warning)]" /> Potential Causes
          </h4>
          <div className="text-sm text-[var(--color-muted)]">
            <p className="font-medium text-[var(--color-text-main)] mb-1 text-xs uppercase tracking-wider">If High:</p>
            <ul className="list-disc pl-4 mb-3 space-y-1">
              {details.causesOfHigh.map((cause, i) => <li key={i}>{cause}</li>)}
            </ul>
            <p className="font-medium text-[var(--color-text-main)] mb-1 text-xs uppercase tracking-wider">If Low:</p>
            <ul className="list-disc pl-4 space-y-1">
              {details.causesOfLow.map((cause, i) => <li key={i}>{cause}</li>)}
            </ul>
          </div>
        </div>

        <div className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)]">
          <h4 className="flex items-center gap-2 font-bold mb-3 text-sm">
            <FiHeart className="text-[var(--color-danger)]" /> Actionable Advice
          </h4>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            {details.dietaryAdvice}
          </p>
        </div>
      </div>
    </Modal>
  );
};
