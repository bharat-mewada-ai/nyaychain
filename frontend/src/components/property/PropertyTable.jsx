import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import SkeletonRow from '../ui/SkeletonRow';
import EmptyState from '../ui/EmptyState';

const COL_HEADERS = ['Plot ID', 'Owner', 'Location', 'Market Value', 'Status', 'Actions'];

export default function PropertyTable({ data, loading, error }) {
  const navigate = useNavigate();

  if (!loading && !error && data.length === 0) {
    return <EmptyState title="No properties found" description="Try adjusting your search or filter criteria." />;
  }

  return (
    <div className="overflow-x-auto no-scrollbar animate-fade-in">
      <table className="w-full text-left border-collapse cursor-pointer">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.2em] font-headline font-black text-zinc-400 bg-zinc-50/50">
            {COL_HEADERS.map((h, i) => (
              <th key={h} className={`px-8 py-6 ${i === COL_HEADERS.length - 1 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}
          {error && (
            <tr><td colSpan={6} className="px-8 py-8 text-center text-red-500">
              Failed to load properties. Please try again.
            </td></tr>
          )}
          {!loading && data.map((p, idx) => (
            <tr key={p.id}
              onClick={() => navigate(`/property/${p.id}`)}
              className={`hover:bg-zinc-50/80 transition-colors group animate-fade-in stagger-${Math.min(idx + 1, 6)}`}>
              <td className="px-8 py-6">
                <span className="font-headline font-bold text-primary">{p.plotId}</span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden flex-shrink-0">
                    <img 
                      alt="Owner Avatar" 
                      className="w-full h-full object-cover" 
                      src={`https://i.pravatar.cc/150?u=${p.id}`}
                    />
                  </div>
                  <span className="font-medium text-on-surface whitespace-nowrap">{p.owner}</span>
                </div>
              </td>
              <td className="px-8 py-6 text-zinc-500">{p.location}</td>
              <td className="px-8 py-6 font-medium text-on-surface">
                ₹{Number(p.price).toLocaleString('en-IN')}
              </td>
              <td className="px-8 py-6"><StatusBadge status={p.status} /></td>
              <td className="px-8 py-6 text-right">
                <button className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all text-zinc-400 hover:text-primary" onClick={(e) => { e.stopPropagation(); navigate(`/property/${p.id}`); }}>
                  <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
