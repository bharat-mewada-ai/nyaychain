export const STATUS_CONFIG = {
  safe: {
    label: 'Verified',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
  },
  risky: {
    label: 'Disputed',
    bg: 'bg-error-container/40',
    text: 'text-error',
    bar: 'bg-red-500',
  },
  review: {
    label: 'Review',
    bg: 'bg-primary/10',
    text: 'text-primary',
    bar: 'bg-yellow-500',
  },
};

export const RISK_CONFIG = {
  low:    { color: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  medium: { color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  bar: 'bg-yellow-500',  glow: 'shadow-yellow-500/20' },
  high:   { color: 'text-red-400',     bg: 'bg-red-500/10',     bar: 'bg-red-500',     glow: 'shadow-red-500/20' },
};

export const TRANSFER_STAGES = ['initiate', 'verify', 'approve', 'complete'];
