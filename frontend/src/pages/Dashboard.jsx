import { useState, useMemo } from 'react';
import { useProperties } from '../hooks/useProperties';
import { useNavigate } from 'react-router-dom';
import PropertyTable from '../components/property/PropertyTable';
import { isGeminiConfigured } from '../services/geminiService';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const { data, loading, error } = useProperties({ search, status });
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!data.length) return { total: 0, risky: 0, review: 0, safe: 0, totalValue: 0 };
    return {
      total: data.length,
      risky: data.filter(p => p.status === 'risky').length,
      review: data.filter(p => p.status === 'review').length,
      safe: data.filter(p => p.status === 'safe').length,
      totalValue: data.reduce((acc, p) => acc + p.price, 0),
    };
  }, [data]);

  const cards = [
    {
      label: 'Total Properties',
      value: stats.total,
      icon: 'location_city',
      trend: '+2.4% this month',
      trendIcon: 'trending_up',
      trendColor: 'text-emerald-500',
      shadow: 'shadow-emerald-500/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Under Review',
      value: stats.review,
      icon: 'clinical_notes',
      trend: 'Pending today',
      trendIcon: 'schedule',
      trendColor: 'text-primary',
      shadow: 'shadow-cyan-500/5',
      iconBg: 'bg-secondary-container/20',
      iconColor: 'text-secondary',
    },
    {
      label: 'High Risk',
      value: stats.risky,
      icon: 'warning',
      trend: 'Requires Attention',
      trendIcon: 'gpp_maybe',
      trendColor: 'text-error',
      shadow: 'shadow-red-500/5',
      iconBg: 'bg-error-container/40',
      iconColor: 'text-error',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-none">
            Institutional <span className="text-primary italic">Overview</span>
          </h1>
          <p className="text-zinc-500 max-w-lg font-light text-lg">Managing the digital sovereignty of territorial assets with cryptographic precision.</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {isGeminiConfigured() && (
            <div className="bg-emerald-50 px-5 py-2.5 rounded-full flex items-center gap-2.5 border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold font-headline uppercase tracking-widest text-emerald-700">Gemini AI Active</span>
            </div>
          )}
          <div className="bg-surface-container px-6 py-3 rounded-full flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant">System Status: Optimal</span>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 flex items-center gap-6 shadow-xl ${card.shadow} group hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className={`w-20 h-20 rounded-full ${card.iconBg} flex items-center justify-center ${card.iconColor}`}>
              <span className="material-symbols-outlined scale-150">{card.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold font-headline uppercase tracking-widest text-zinc-400">{card.label}</p>
              <h3 className="text-3xl font-headline font-bold text-on-surface">{card.value}</h3>
              <div className={`mt-1 ${card.trendColor} text-xs font-bold flex items-center gap-1`}>
                <span className="material-symbols-outlined text-sm">{card.trendIcon}</span>
                {card.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Data Table Section */}
      <section className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-emerald-500/5 overflow-hidden">
        <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50/50">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Land Records</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search plot ID or owner..."
              className="bg-white border text-zinc-600 border-zinc-200 px-5 py-2.5 rounded-full text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <div className="flex gap-2 bg-white border border-zinc-200 rounded-full shadow-sm p-1">
              {['all', 'safe', 'risky', 'review'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize transition-all duration-200
                    ${status === s
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-zinc-500 hover:text-primary'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <PropertyTable data={data} loading={loading} error={error} />
        <div className="p-8 border-t border-zinc-50 flex justify-between items-center text-sm font-bold text-zinc-400">
          <p>Showing {data.length} entries</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-100 transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">1</button>
            <button className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-100 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Activity Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow"
        >
          <div className="relative z-10 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest">Global Asset Distribution</span>
            <h2 className="text-3xl font-headline font-bold">NyayChain Network Health Index</h2>
            <p className="text-white/80 max-w-md">Real-time cryptographic verification progress across all jurisdictional zones. Current integrity score is at a historical high.</p>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-4xl font-headline font-bold">99.8%</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Integrity Score</p>
              </div>
              <div>
                <p className="text-4xl font-headline font-bold">1.2ms</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Avg. Latency</p>
              </div>
              <div>
                <p className="text-4xl font-headline font-bold">₹{(stats.totalValue / 10000000).toFixed(1)}Cr</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Total Value</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-12"></div>
          <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] opacity-10">hub</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 shadow-xl shadow-emerald-500/5 space-y-6 hover:shadow-2xl transition-shadow"
        >
          <h3 className="text-xl font-headline font-bold">Quick Actions</h3>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/upload')}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-50 hover:bg-primary/5 hover:text-primary transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">cloud_upload</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Document Upload</p>
                <p className="text-[10px] text-zinc-400">Upload and verify land records</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/transfer')}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-50 hover:bg-primary/5 hover:text-primary transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">swap_horiz</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Initiate Transfer</p>
                <p className="text-[10px] text-zinc-400">Start ownership transfer protocol</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-50 hover:bg-primary/5 hover:text-primary transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">AI Configuration</p>
                <p className="text-[10px] text-zinc-400">Configure Gemini API settings</p>
              </div>
            </button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
