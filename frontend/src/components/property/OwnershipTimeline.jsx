export default function OwnershipTimeline({ chain = [] }) {
  if (!chain || chain.length === 0) return <p className="text-on-surface-variant text-sm">No timeline available.</p>;

  // Sort chain by timestamp descending to put newest on top
  const sortedChain = [...chain].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="relative space-y-12 pl-8 border-l-2 border-outline-variant/30">
      {sortedChain.map((entry, i) => {
        const isCurrent = i === 0;
        const isSuspect = entry.validationStatus === 'suspicious';
        const dateStr = new Date(entry.timestamp).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

        return (
          <div key={entry.id} className={`relative ${!isCurrent ? 'opacity-70' : ''}`}>
            <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full ring-4 ring-background
                            ${isCurrent ? 'bg-primary ring-8 ring-primary/10' : 'bg-outline'}
                            ${isSuspect ? 'bg-error ring-error/20' : ''}`} />
            
            <div className={`bg-surface-container-low p-8 rounded-xl transition-all
                             ${isCurrent ? 'hover:shadow-lg' : ''}
                             ${isSuspect ? 'border border-error/30 bg-error-container/10 relative overflow-hidden' : ''}`}>
              
              {isSuspect && <div className="absolute top-0 left-0 w-1 h-full bg-error" />}

              <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-xl">{isCurrent ? 'Current Custodian' : 'Legacy Transfer'}</h3>
                  <p className={`font-headline font-medium ${isCurrent ? 'text-primary' : 'text-on-surface'} ${isSuspect ? 'text-error' : ''}`}>
                    {entry.owner}
                  </p>
                </div>
                <span className={`text-sm font-label uppercase ${isSuspect ? 'text-error' : 'text-on-surface-variant opacity-60'} flex items-center gap-1`}>
                  {isSuspect && <span className="material-symbols-outlined text-sm">warning</span>}
                  {dateStr}
                </span>
              </div>
              
              <p className="text-on-surface-variant text-sm mb-4">
                {isCurrent && !isSuspect ? 'Finalized under Registry Protocol v4.2. Fully collateralized digital asset with multisig governance.' : 
                 isSuspect ? 'This transaction shows anomalous patterns or failed standard heuristic checks.' : 
                 'Transfer executed via standard institutional land grant. Historical records fully indexed in the Document Vault.'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full bg-white text-[10px] font-bold border ${isSuspect ? 'border-error/20 text-error' : 'border-outline-variant/20'}`}>
                  VAL: ₹{Number(entry.transferPrice).toLocaleString('en-IN')}
                </span>
                <span className={`px-3 py-1 rounded-full bg-white text-[10px] font-bold border ${isSuspect ? 'border-error/20 text-error' : 'border-outline-variant/20'}`}>
                  ROLE: {entry.role.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
