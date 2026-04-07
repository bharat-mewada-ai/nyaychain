export default function ProbabilityBar({ probability }) {
  const isHigh = probability > 70;
  const isMedium = probability >= 40 && probability <= 70;
  
  const barColor = isHigh ? 'bg-error' : isMedium ? 'bg-yellow-500' : 'bg-emerald-500';

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2 font-label">
        <span className="text-on-surface-variant font-medium">Fraud Probability</span>
        <span className={`font-bold font-mono ${isHigh ? 'text-error' : isMedium ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {probability}%
        </span>
      </div>
      <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out fill-mode-forwards ${barColor}`}
          style={{ width: `${probability}%` }} 
        />
      </div>
    </div>
  );
}
