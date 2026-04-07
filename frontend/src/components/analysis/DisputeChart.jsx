import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function DisputeChart({ dangerLevel }) {
  // `dangerLevel` is dispute_risk
  const data = [
    { name: 'Dispute', value: dangerLevel, fill: dangerLevel > 60 ? '#ba1a1a' : '#7d23e4' }
  ];

  return (
    <div className="w-40 h-40 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" cy="50%" 
          innerRadius="70%" outerRadius="100%" 
          barSize={12} 
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            minAngle={15}
            clockWise={true}
            dataKey="value"
            cornerRadius={10}
            background={{ fill: '#e8e8e8' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold font-headline">{dangerLevel}%</span>
        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-label">Dispute Risk</span>
      </div>
    </div>
  );
}
