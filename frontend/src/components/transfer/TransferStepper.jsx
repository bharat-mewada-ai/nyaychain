import { useState } from 'react';
import { useTransfer } from '../../hooks/useTransfer';

export default function TransferStepper({ property, onCancel }) {
  const { stage, history, loading, advance } = useTransfer();
  const [rejected, setRejected] = useState(false);

  const handleApprove = () => advance('approveTransfer', { propertyId: property.id, decision: 'approve' });
  const handleReject = () => { setRejected(true); };

  return (
    <>
      <div className="col-span-12 lg:col-span-8 space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="space-y-2">
          <span className="text-primary font-bold tracking-widest text-xs uppercase font-label">Protocol ID: SL-992-QX</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-on-surface font-headline leading-tight">Land Asset Transfer</h1>
          <p className="text-on-surface-variant text-lg font-body max-w-2xl">Execute institutional-grade asset transfers with biometric verification and legal compliance anchoring.</p>
        </div>

        {/* Horizontal Stepper */}
        <div className="bg-surface-container-low rounded-xl p-8 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between relative">
            {/* Stepper Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-[2px] bg-primary transition-all duration-500 z-0" style={{ width: `${(stage / 3) * 100}%` }}></div>
            
            {/* Steps */}
            {[
              { id: 0, label: 'Initiation', icon: 'check' },
              { id: 1, label: 'Verification', icon: 'fact_check' },
              { id: 2, label: 'Approval', icon: 'signature' },
              { id: 3, label: 'Ownership', icon: 'key' }
            ].map((step) => {
              const done = stage > step.id;
              const active = stage === step.id;
              const locked = stage < step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ring-8 ring-surface-container-low transition-all
                    ${done || active ? 'bg-primary text-white shadow-lg shadow-emerald-500/40' : 'bg-surface-container-highest text-outline'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {locked ? 'lock' : done ? 'check' : step.icon}
                    </span>
                  </div>
                  <span className={`text-sm font-bold font-space-grotesk ${active || done ? 'text-primary' : 'text-outline'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist Section */}
        <div className="bg-white rounded-xl p-10 shadow-xl shadow-zinc-200/50 space-y-8">
          <h3 className="text-2xl font-bold font-headline">Compliance Checklist</h3>
          <div className="space-y-6">
            
            {/* Initiation/Verification */}
            <div className={`flex items-start justify-between p-6 rounded-lg ${stage > 0 ? 'bg-surface-container-lowest border-outline-variant/10' : 'bg-surface-container-lowest border-primary/20 shadow-lg shadow-emerald-500/5 relative overflow-hidden group'} border hover:shadow-md transition-shadow`}>
              {stage === 0 && <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>}
              <div className="flex space-x-6">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mt-1 
                  ${stage > 0 ? 'border-primary text-primary group-hover:bg-primary group-hover:text-white' : 
                    stage === 0 ? 'border-primary text-primary animate-pulse' : 'border-zinc-300 text-zinc-300'} transition-colors`}>
                  <span className="material-symbols-outlined text-lg">{stage > 0 ? 'check' : stage === 0 ? 'sync' : 'lock'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-space-grotesk">Identity Verification</h4>
                  <p className="text-sm text-on-surface-variant font-body">Biometric hash validation and passport OCR.</p>
                </div>
              </div>
              <span className={`px-4 py-1 text-xs font-bold rounded-full font-label uppercase
                ${stage > 0 ? 'bg-green-100 text-green-700' : stage === 0 ? 'bg-primary-fixed text-primary' : 'bg-zinc-100 text-zinc-500'}`}>
                {stage > 0 ? 'Verified' : stage === 0 ? 'In Progress' : 'Locked'}
              </span>
            </div>

            {/* Document Validation */}
            <div className={`flex items-start justify-between p-6 rounded-lg ${stage > 1 ? 'bg-surface-container-lowest border-outline-variant/10' : stage === 1 ? 'bg-surface-container-lowest border-primary/20 shadow-lg shadow-emerald-500/5 relative overflow-hidden group' : 'bg-surface-container-lowest border-outline-variant/10 opacity-60 grayscale'} border hover:shadow-md transition-shadow`}>
              {stage === 1 && <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>}
              <div className="flex space-x-6">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mt-1 
                  ${stage > 1 ? 'border-primary text-primary group-hover:bg-primary group-hover:text-white' : 
                    stage === 1 ? 'border-primary text-primary animate-pulse' : 'border-zinc-300 text-zinc-300'} transition-colors`}>
                  <span className="material-symbols-outlined text-lg">{stage > 1 ? 'check' : stage === 1 ? 'sync' : 'lock'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-space-grotesk">Document Validation</h4>
                  <p className="text-sm text-on-surface-variant font-body">Analyzing Title Deed for digital watermark integrity.</p>
                </div>
              </div>
              <span className={`px-4 py-1 text-xs font-bold rounded-full font-label uppercase
                ${stage > 1 ? 'bg-green-100 text-green-700' : stage === 1 ? 'bg-primary-fixed text-primary' : 'bg-zinc-100 text-zinc-500'}`}>
                {stage > 1 ? 'Verified' : stage === 1 ? 'In Progress' : 'Locked'}
              </span>
            </div>

            {/* Tax Compliance */}
            <div className={`flex items-start justify-between p-6 rounded-lg ${stage > 2 ? 'bg-surface-container-lowest border-outline-variant/10' : stage === 2 ? 'bg-surface-container-lowest border-primary/20 shadow-lg shadow-emerald-500/5 relative overflow-hidden group' : 'bg-surface-container-lowest border-outline-variant/10 opacity-60 grayscale'} border hover:shadow-md transition-shadow`}>
              {stage === 2 && <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>}
              <div className="flex space-x-6">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mt-1 
                  ${stage > 2 ? 'border-primary text-primary group-hover:bg-primary group-hover:text-white' : 
                    stage === 2 ? 'border-primary text-primary animate-pulse' : 'border-zinc-300 text-zinc-300'} transition-colors`}>
                  <span className="material-symbols-outlined text-lg">{stage > 2 ? 'check' : stage === 2 ? 'sync' : 'lock'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-space-grotesk">Tax Compliance</h4>
                  <p className="text-sm text-on-surface-variant font-body">Pending transfer tax calculation and clearance.</p>
                </div>
              </div>
              <span className={`px-4 py-1 text-xs font-bold rounded-full font-label uppercase
                ${stage > 2 ? 'bg-green-100 text-green-700' : stage === 2 ? 'bg-primary-fixed text-primary' : 'bg-zinc-100 text-zinc-500'}`}>
                {stage > 2 ? 'Cleared' : stage === 2 ? 'In Progress' : 'Locked'}
              </span>
            </div>

            {rejected && (
              <div className="flex items-start justify-between p-6 rounded-lg bg-error-container/20 border border-error/50">
                <div className="flex space-x-6">
                  <div className="w-8 h-8 rounded-full border-2 border-error text-error flex items-center justify-center mt-1">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg font-space-grotesk text-error">Transfer Rejected</h4>
                    <p className="text-sm text-error font-body">The protocol execution was terminated by the Registrar.</p>
                  </div>
                </div>
                <span className="px-4 py-1 bg-error-container text-error text-xs font-bold rounded-full font-label uppercase">Failed</span>
              </div>
            )}

          </div>
        </div>

        {/* Asymmetric CTA Section */}
        <div className="flex items-center justify-between pt-4">
          <button onClick={onCancel} className="px-10 py-5 text-zinc-500 font-bold hover:text-zinc-800 transition-colors font-space-grotesk">Cancel Request</button>
          
          {stage === 0 && !rejected && (
            <button onClick={() => advance('initiateTransfer', { propertyId: property.id })} disabled={loading} className="px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform font-space-grotesk flex items-center space-x-3 disabled:opacity-50">
              <span>{loading ? 'Processing...' : 'Execute Protocol'}</span>
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          )}

          {stage === 1 && !rejected && (
            <button onClick={() => advance('verifyTransfer', { propertyId: property.id })} disabled={loading} className="px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform font-space-grotesk flex items-center space-x-3 disabled:opacity-50">
              <span>{loading ? 'Verifying...' : 'Verify Documents'}</span>
              {!loading && <span className="material-symbols-outlined">fact_check</span>}
            </button>
          )}

          {stage === 2 && !rejected && (
            <div className="flex gap-4">
              <button onClick={handleReject} disabled={loading} className="px-8 py-5 border border-error/50 text-error hover:bg-error/5 rounded-full font-bold transition-transform font-space-grotesk disabled:opacity-50">
                Reject Transfer
              </button>
              <button onClick={handleApprove} disabled={loading} className="px-12 py-5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-full font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform font-space-grotesk flex items-center space-x-3 disabled:opacity-50">
                <span>{loading ? 'Processing...' : 'Approve Transfer'}</span>
                {!loading && <span className="material-symbols-outlined">done_all</span>}
              </button>
            </div>
          )}

          {stage === 3 && (
            <button className="px-12 py-5 bg-emerald-600 text-white rounded-full font-bold shadow-2xl shadow-emerald-500/40 font-space-grotesk flex items-center space-x-3 cursor-default">
              <span>Transfer Complete</span>
              <span className="material-symbols-outlined">verified</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Asset Summary (Side Panel) */}
      <div className="col-span-12 lg:col-span-4 animate-fade-in">
        <div className="sticky top-28 space-y-8">
          
          {/* Asset Card */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl shadow-zinc-200/50">
            <div className="h-48 relative">
              <img alt="Property View" className="w-full h-full object-cover" src={`https://source.unsplash.com/800x600/?modern,house&hash=${property.id}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold font-headline truncate">{property.location?.split(',')[0]} Estate</h3>
                  <p className="text-xs opacity-80 font-body">Ref: {property.plotId}</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                <span className="text-sm text-zinc-500 font-label">Valuation</span>
                <span className="text-xl font-bold text-primary font-space-grotesk">₹{Number(property.price).toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 font-body">Current Owner</span>
                  <span className="text-sm font-bold font-space-grotesk truncate ml-4">{property.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 font-body">Recipient</span>
                  <span className="text-sm font-bold font-space-grotesk truncate ml-4">Ethereal Holdings</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 font-body">Location</span>
                  <span className="text-sm font-bold font-space-grotesk truncate ml-4">{property.location?.split(',')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-secondary/5 rounded-xl p-8 flex items-center space-x-6 border border-secondary/10">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <div>
              <h4 className="font-bold text-secondary font-headline">Immutable Anchor</h4>
              <p className="text-xs text-on-surface-variant font-body">This transaction is secured by sovereign blockchain protocols and legal smart contracts.</p>
            </div>
          </div>

          {/* Recent Protocol Activity */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-label uppercase tracking-widest text-zinc-400 px-2">Timeline</h4>
            <div className="space-y-4">
              {stage > 0 && (
                <div className="flex items-start space-x-4 px-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold font-body">Protocol Initiated</p>
                    <p className="text-xs text-zinc-400">By Admin</p>
                  </div>
                </div>
              )}
              {stage > 1 && (
                <div className="flex items-start space-x-4 px-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold font-body">Identity Hash Matched</p>
                    <p className="text-xs text-zinc-400">Via Biometric Link</p>
                  </div>
                </div>
              )}
              {stage > 2 && !rejected && (
                <div className="flex items-start space-x-4 px-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold font-body">Transfer Approved</p>
                    <p className="text-xs text-zinc-400">Ledger execution complete</p>
                  </div>
                </div>
              )}
              {rejected && (
                <div className="flex items-start space-x-4 px-2">
                  <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold font-body text-error">Transfer Rejected</p>
                    <p className="text-xs text-error">Protocol execution halted</p>
                  </div>
                </div>
              )}
              {stage <= 2 && !rejected && (
                <div className="flex items-start space-x-4 px-2 opacity-40">
                  <div className="w-2 h-2 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold font-body text-zinc-600">Pending Operations</p>
                    <p className="text-xs text-zinc-500">Awaiting user action</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
