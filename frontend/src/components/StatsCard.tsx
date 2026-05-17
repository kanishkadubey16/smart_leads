import React from 'react';
import * as Icons from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  iconName: keyof typeof Icons;
  colorType: 'blue' | 'green' | 'orange' | 'red';
  subtitle: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  iconName,
  colorType,
  subtitle,
}) => {
  const IconComponent = Icons[iconName] as React.ComponentType<any>;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100/50',
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100/50',
    },
    orange: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100/50',
    },
    red: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100/50',
    },
  }[colorType];

  return (
    <div className="flex-1 bg-white border border-slate-100 shadow-md shadow-slate-100/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 group select-none min-w-[220px]">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-400">
            {label}
          </span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight transition-transform duration-300 group-hover:scale-[1.02]">
            {value}
          </span>
        </div>
        
        <div className={`w-12 h-12 rounded-full ${colorClasses.bg} flex items-center justify-center border ${colorClasses.border} shadow-sm shrink-0 transition-transform duration-300 group-hover:rotate-[6deg]`}>
          <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center">
        <span className="text-xs font-semibold text-slate-400">
          {subtitle}
        </span>
      </div>
    </div>
  );
};
export default StatsCard;
