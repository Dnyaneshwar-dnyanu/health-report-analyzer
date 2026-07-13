import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../../components/common/Badge/Badge';
import { Card } from '../../../components/common/Card/Card';
import { FiAlertCircle, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';
import { cn } from '../../../utils/cn';
import { ParameterDetailsModal } from './ParameterDetailsModal';

const getStatusConfig = (status) => {
  switch (status) {
    case 'high':
      return { color: 'text-[var(--color-danger)]', bg: 'bg-[var(--color-danger)]/10', icon: FiAlertCircle, label: 'High' };
    case 'low':
      return { color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10', icon: FiMinusCircle, label: 'Low' };
    default:
      return { color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10', icon: FiCheckCircle, label: 'Normal' };
  }
};

const ParameterCard = ({ item, delay, onClick }) => {
  const { color, bg, icon: Icon, label } = getStatusConfig(item.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card hover onClick={onClick} className="h-full flex flex-col justify-between p-4 bg-[var(--color-background)] cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <span className="font-medium text-sm text-[var(--color-text-main)]">{item.name}</span>
          <div className={cn("p-1.5 rounded-lg", bg, color)}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold">{item.value}</span>
            <span className="text-xs text-[var(--color-muted)]">{item.unit}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--color-muted)]">Range: {item.range}</span>
            <span className={cn("font-semibold", color)}>{label}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const ParameterGrid = ({ parameters }) => {
  const [selectedParameter, setSelectedParameter] = useState(null);

  return (
    <>
      <div className="space-y-8">
        {parameters.map((category, catIdx) => (
          <div key={category.category}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-lg">{category.category}</h4>
              <Badge variant="default" className="text-[var(--color-muted)]">
                {category.items.length} items
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.items.map((item, itemIdx) => (
                <ParameterCard 
                  key={item.name} 
                  item={item} 
                  delay={(catIdx * 0.1) + (itemIdx * 0.05)} 
                  onClick={() => setSelectedParameter(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <ParameterDetailsModal 
        isOpen={!!selectedParameter} 
        onClose={() => setSelectedParameter(null)} 
        parameter={selectedParameter} 
      />
    </>
  );
};
