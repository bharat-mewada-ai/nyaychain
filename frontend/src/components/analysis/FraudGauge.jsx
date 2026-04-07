import { RISK_CONFIG } from '../../constants/statusConfig';

export default function FraudGauge({ probability = 0, riskLevel = 'low' }) {
  const cfg = RISK_CONFIG[riskLevel] ?? RISK_CONFIG.low;
  const rotation = (probability / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0 rounded-t-full border-[8px] border-b-0 border-slate-800" />

        {/* Colored arc using conic gradient */}
        <div
          className="absolute inset-0 rounded-t-full border-[8px] border-b-0 transition-all duration-1000"
          style={{
            borderColor: probability > 66 ? '#ef4444' : probability > 33 ? '#eab308' : '#22c55e',
            clipPath: `polygon(0 100%, 0 0, ${probability}% 0, ${probability}% 100%)`,
          }}
        />

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-16 origin-bottom transition-transform duration-1000 ease-out"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            background: 'linear-gradient(to top, #818cf8, transparent)',
          }}
        >
          <div className="w-2 h-2 rounded-full bg-indigo-400 -translate-x-[3px] -translate-y-1" />
        </div>

        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-slate-900 border-2 border-indigo-400" />
      </div>

      <p className={`text-2xl font-bold font-mono mt-2 ${cfg.color}`}>{probability}%</p>
      <p className="text-slate-500 text-xs">Fraud Probability</p>
    </div>
  );
}
