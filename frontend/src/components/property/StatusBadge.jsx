import { STATUS_CONFIG } from '../../constants/statusConfig';

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.review;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${cfg.bg} ${cfg.text} text-[10px] font-black uppercase tracking-wider`}>
      {cfg.label}
    </span>
  );
}
