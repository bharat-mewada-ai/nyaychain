import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function RiskAlert({ riskLevel, message, details }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || riskLevel === 'low') return null;

  const isHigh = riskLevel === 'high';

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border animate-scale-in
                     ${isHigh
                       ? 'bg-red-500/10 border-red-500/30'
                       : 'bg-yellow-500/10 border-yellow-500/30'}`}>
      <AlertTriangle size={18} className={`flex-none mt-0.5 ${isHigh ? 'text-red-400' : 'text-yellow-400'}`} />
      <div className="flex-1">
        <p className={`font-semibold text-sm ${isHigh ? 'text-red-400' : 'text-yellow-400'}`}>
          {message || (isHigh ? 'High Risk Alert' : 'Review Required')}
        </p>
        {details && <p className={`text-xs mt-1 ${isHigh ? 'text-red-400/70' : 'text-yellow-400/70'}`}>{details}</p>}
      </div>
      <button onClick={() => setDismissed(true)} className="text-slate-600 hover:text-slate-400 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}
