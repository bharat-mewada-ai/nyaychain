import { useState } from 'react';
import TransferStepper from '../components/transfer/TransferStepper';
import { Search, ArrowRightLeft } from 'lucide-react';
import { MOCK_PROPERTIES } from '../constants/mockData';

export default function TransferFlow() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = MOCK_PROPERTIES.filter(p =>
    p.plotId.toLowerCase().includes(search.toLowerCase()) ||
    p.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in w-full grid grid-cols-12 gap-8">
      {!selectedProperty ? (
        <div className="col-span-12 space-y-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold font-headline text-on-surface">Ownership Transfer</h1>
            <p className="text-on-surface-variant text-lg font-body mt-2">Initiate and manage secure property transfers</p>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-sm max-w-3xl">
            <h2 className="text-on-surface font-bold mb-4 flex items-center gap-2 font-headline text-lg">
              <span className="material-symbols-outlined text-primary">search</span>
              Select Property
            </h2>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Plot ID or Owner..."
              className="w-full bg-white border border-outline-variant/30 rounded-full px-6 py-3
                         text-sm text-on-surface placeholder-zinc-400 focus:outline-none
                         focus:ring-2 focus:ring-primary/20 transition-all mb-4 outline-none"
            />

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProperty(p)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 group
                    ${selectedProperty?.id === p.id
                      ? 'bg-primary/5 border-primary shadow-sm'
                      : 'bg-white border-outline-variant/30 hover:border-primary/50 hover:shadow-md'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-on-surface text-lg font-bold font-headline group-hover:text-primary transition-colors">{p.owner}</p>
                      <p className="text-zinc-500 text-sm font-mono mt-1">{p.plotId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-500 text-sm mb-1">{p.location.split(',')[0]}</p>
                      <p className="text-on-surface font-bold font-space-grotesk bg-surface-container px-3 py-1 rounded-full text-sm inline-block">₹{Number(p.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <TransferStepper property={selectedProperty} onCancel={() => setSelectedProperty(null)} />
      )}
    </div>
  );
}
