import { AlertTriangle, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import RiskBadge from './RiskBadge';
import ProbabilityBar from './ProbabilityBar';
import DisputeChart from './DisputeChart';
import { isGeminiConfigured } from '../../services/geminiService';
import { motion } from 'framer-motion';

export default function AnalysisPanel({ result, loading, error, onAnalyze }) {
  const geminiActive = isGeminiConfigured();

  if (loading) return (
    <div className="flex flex-col items-center justify-center mb-8 p-8 border border-outline-variant/20 rounded-xl bg-surface-container-lowest">
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <svg className="w-full h-full absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <circle cx="64" cy="64" fill="transparent" r="58" stroke="url(#gradient)" strokeWidth="4" strokeDasharray="200" strokeDashoffset="50" strokeLinecap="round" />
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#7d23e4" />
              <stop offset="100%" stopColor="#006781" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col items-center">
          <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
        </div>
      </div>
      <p className="text-center text-on-surface-variant text-sm font-medium">
        {geminiActive ? 'Gemini AI analyzing property data...' : 'Neural engine analyzing registry metadata...'}
      </p>
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center p-8 mb-8 text-center animate-fade-in border border-error/20 bg-error-container/20 rounded-xl">
      <AlertTriangle className="text-error w-12 h-12 mb-4" />
      <h3 className="text-lg font-headline font-bold text-error mb-2">Analysis Failed</h3>
      <p className="text-on-surface-variant text-sm font-body mb-6 max-w-sm">{error.message || 'An unexpected error occurred during analysis.'}</p>
      <button onClick={onAnalyze} className="px-6 py-2 bg-error text-white font-bold rounded-full hover:bg-red-700 transition-colors shadow-md">
        Retry Analysis
      </button>
    </div>
  );

  if (!result) return (
    <div className="flex flex-col items-center justify-center p-10 mb-8 text-center animate-fade-in border border-outline-variant/30 rounded-xl bg-surface-container-lowest">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 relative">
        <span className="material-symbols-outlined text-primary text-3xl">radar</span>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-headline font-bold text-on-surface">AI Engine Ready</h3>
        {geminiActive && (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
            <Sparkles size={10} /> Gemini
          </span>
        )}
      </div>
      <p className="text-on-surface-variant text-sm font-body mb-6 max-w-sm">
        {geminiActive 
          ? 'Powered by Google Gemini AI. Scan property records to detect fraud patterns and predict disputes.'
          : 'Scan 15 years of registry metadata to determine ownership integrity and predict legal disputes.'}
      </p>
      <button onClick={onAnalyze} className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined">analytics</span> Analyze Property
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      {/* Header and Risk Level */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-2xl font-headline font-bold text-on-surface">Integrity Report</h3>
            {geminiActive && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full flex items-center gap-1">
                <Sparkles size={10} /> AI
              </span>
            )}
          </div>
          <p className="text-sm font-body text-on-surface-variant">AI-generated fraud and dispute assessment.</p>
        </div>
        <RiskBadge level={result.risk_level} />
      </div>

      {/* Fraud Probability */}
      <div className="p-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
        <ProbabilityBar probability={result.fraud_probability} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Flagged Reasons */}
        <div className="flex flex-col font-body">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label mb-4 opacity-80">Detected Signals</p>
          {result.reasons && result.reasons.length > 0 ? (
            <ul className="space-y-3">
              {result.reasons.map((reason, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-high/50 border border-outline-variant/10 text-sm"
                >
                  {result.risk_level === 'High' ? (
                    <AlertTriangle size={16} className="text-error flex-shrink-0 mt-0.5" />
                  ) : result.risk_level === 'Medium' ? (
                    <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-on-surface">{reason}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-sm text-on-surface-variant italic py-2">
              <ShieldCheck size={16} className="text-emerald-500" /> No significant anomalies detected.
            </div>
          )}
        </div>

        {/* Dispute Chart */}
        <div className="flex flex-col items-center justify-center p-6 border border-outline-variant/20 rounded-xl bg-surface-container-lowest shadow-sm">
          <DisputeChart dangerLevel={result.dispute_risk} />
          <p className="text-center font-body text-sm text-on-surface mt-4 max-w-[200px] leading-relaxed">
            {result.dispute_summary}
          </p>
        </div>
      </div>

      {/* Recommendation */}
      {result.recommendation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3"
        >
          <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Recommendation</p>
            <p className="text-sm text-on-surface">{result.recommendation}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
