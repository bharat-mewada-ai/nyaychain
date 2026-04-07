import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export default function RiskBadge({ level }) {
  const isHigh = level.toLowerCase() === 'high';
  const isMedium = level.toLowerCase() === 'medium';
  
  const icon = isHigh ? <AlertTriangle size={18} /> : isMedium ? <AlertCircle size={18} /> : <ShieldCheck size={18} />;
  const colorClass = isHigh 
    ? 'bg-error-container text-error border-error/30' 
    : isMedium 
      ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30 dark:text-yellow-400' 
      : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:text-emerald-400';

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${colorClass}`}>
      {icon}
      <span className="font-bold text-sm tracking-wide uppercase font-label">{level} Risk</span>
    </div>
  );
}
