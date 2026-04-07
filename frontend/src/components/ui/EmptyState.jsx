import { FileSearch } from 'lucide-react';

export default function EmptyState({ title = 'No results found', description = 'Try adjusting your search or filters.', icon: Icon = FileSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
        <Icon size={28} className="text-zinc-400" />
      </div>
      <h3 className="text-on-surface font-semibold text-lg mb-1">{title}</h3>
      <p className="text-zinc-400 text-sm text-center max-w-xs">{description}</p>
    </div>
  );
}
