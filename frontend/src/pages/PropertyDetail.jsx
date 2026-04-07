import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { useAnalysis } from '../hooks/useAnalysis';
import { useApp } from '../context/AppContext';
import OwnershipTimeline from '../components/property/OwnershipTimeline';
import AnalysisPanel from '../components/analysis/AnalysisPanel';
import RiskAlert from '../components/analysis/RiskAlert';
import TransferStepper from '../components/transfer/TransferStepper';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: property, loading, error } = useProperty(id);
  const { result: analysis, loading: analyzing, error: analysisError, analyze } = useAnalysis();
  const { addNotification, settings } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Auto-analyze if setting is enabled
  useEffect(() => {
    if (property && settings.autoAnalysis && !analysis && !analyzing) {
      analyze(property.plotId);
    }
  }, [property, settings.autoAnalysis]);

  const handleAnalyze = () => {
    if (property) {
      analyze(property.plotId);
      addNotification({
        text: `AI analysis started for ${property.plotId}`,
        time: 'Just now',
        type: 'info',
      });
    }
  };

  if (loading) return <LoadingSpinner text="Loading property details..." />;
  if (error || !property) return (
    <div className="text-center py-20 animate-fade-in">
      <p className="text-red-400 mb-4 font-headline">Property not found.</p>
      <button onClick={() => navigate('/')} className="text-primary hover:underline text-sm font-bold flex items-center justify-center gap-2 mx-auto">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in pb-32">
      <div className="px-8 pb-4">
        <button onClick={() => navigate('/')} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold font-label text-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-lg border border-outline-variant/30 rounded-full p-1">arrow_back</span> Return to Registry
        </button>
      </div>

      <section className="relative w-full h-[716px] px-8 py-12">
        <div className="absolute inset-0 z-0 px-8 py-6">
          <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl relative group">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Property aerial view" src={`https://source.unsplash.com/1600x900/?modern,estate,aerial&hash=${property.id}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end p-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-[24px] bg-white/70 p-10 rounded-xl max-w-2xl border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`px-4 py-1 rounded-full font-bold text-xs tracking-widest uppercase ${property.status === 'safe' ? 'bg-primary/10 text-primary' : property.status === 'risky' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}`}>
                {property.status === 'safe' ? 'Verified Asset' : property.status === 'risky' ? 'Risk Flagged' : 'Pending Review'}
              </span>
              <span className="px-4 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-xs tracking-widest uppercase">Institutional Tier</span>
            </div>
            <h1 className="text-5xl font-headline font-bold text-on-surface leading-tight mb-2 truncate max-w-full">{property.location?.split(',')[0]} Estate</h1>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-6">Coordinate Block: {property.plotId} — Sovereign High-Value Registry. {property.type} parcel currently under custody of {property.owner}.</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                <span className="material-symbols-outlined">download</span> Download Deed
              </button>
              <button className="px-8 py-4 bg-surface-container-highest text-on-surface font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                <span className="material-symbols-outlined">share</span> Share Record
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Risk alert */}
      {(property.status === 'risky' || property.status === 'review') && (
        <div className="max-w-7xl mx-auto px-8 mt-4">
          <RiskAlert
            riskLevel={property.status === 'risky' ? 'high' : 'medium'}
            message={property.status === 'risky' ? 'This property has been flagged for suspicious activity' : 'This property is currently under review'}
            details={property.status === 'risky' ? 'AI analysis detected anomalous patterns in the ownership chain. Immediate review recommended.' : 'Pending verification of recent transfer documentation.'}
          />
        </div>
      )}

      <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-7 space-y-12">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
              Ownership Timeline
            </h2>
            <div className="bg-surface-container-low p-8 rounded-xl shadow-sm">
              <OwnershipTimeline chain={property.ownershipChain} />
            </div>
          </div>

          <div className="bg-tertiary-container/5 rounded-xl p-10 border border-tertiary-container/10">
            <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 text-tertiary">
              <span className="material-symbols-outlined">analytics</span>
              Advanced Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <p className="text-xs font-label uppercase text-on-surface-variant mb-2">Area (Sq Ft)</p>
                <p className="text-2xl font-headline font-bold text-on-surface">{property.area}</p>
                <div className="w-full bg-zinc-100 h-1 mt-4 rounded-full">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <p className="text-xs font-label uppercase text-on-surface-variant mb-2">Valuation</p>
                <p className="text-xl font-headline font-bold text-on-surface break-words">₹{Number(property.price).toLocaleString('en-IN')}</p>
                <div className="w-full bg-zinc-100 h-1 mt-4 rounded-full">
                  <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <p className="text-xs font-label uppercase text-on-surface-variant mb-2">Zone Type</p>
                <p className="text-xl font-headline font-bold text-on-surface truncate">{property.type}</p>
                <div className="w-full bg-zinc-100 h-1 mt-4 rounded-full">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Inline Transfer Stepper */}
          <div className="mt-12 bg-white rounded-xl shadow-xl shadow-zinc-200/50 border border-outline-variant/10 p-8">
            <h2 className="text-2xl font-headline font-bold mb-6">Initiate Transfer Protocol</h2>
            <p className="text-on-surface-variant font-body mb-8">Execute a highly secure, verified ownership transfer via our sovereign smart contract grid.</p>
            <TransferStepper property={property} onCancel={() => { document.body.scrollTop = 0; document.documentElement.scrollTop = 0; }} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-xl shadow-2xl shadow-emerald-500/5 p-10 border border-surface-container-highest">
              <AnalysisPanel result={analysis} loading={analyzing} error={analysisError} onAnalyze={handleAnalyze} />

              <div className="mt-10 pt-8 border-t border-outline-variant/20">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {analysis && !loading ? 'Dynamic Validation Completed' : 'Waiting for Validation Check'}
                  </li>
                  <li className="flex items-start gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Title Chain Traceability
                  </li>
                  <li className="flex items-start gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    No Overlapping Claims Configured
                  </li>
                </ul>
                <button className="w-full py-4 bg-on-surface text-white font-bold rounded-full hover:bg-zinc-800 transition-colors shadow-md">Request Certified Audit</button>
              </div>
            </div>

            <div className="bg-secondary p-8 rounded-xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-headline font-bold mb-2">Registry Map</h3>
                <p className="text-secondary-fixed text-sm mb-6">Interactive spatial data view for {property.plotId}.</p>
                <div className="w-full aspect-video rounded-xl bg-on-secondary/10 overflow-hidden relative">
                  <img className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Map view" src={`https://source.unsplash.com/600x400/?map,satellite,terrain&hash=${property.id}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-on-secondary/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 mt-24">
        <h2 className="text-3xl font-headline font-bold mb-10">Property Assets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'cloud_done', title: 'Deed NFT', desc: 'Immutable ERC-721 Representation' },
            { icon: 'map', title: 'GIS Survey', desc: 'Precision Lidar Scan 2023' },
            { icon: 'description', title: 'Tax History', desc: '10 Years Cleared' },
            { icon: 'verified', title: 'Eco-Credit', desc: 'Carbon Sequestration Report' },
          ].map(asset => (
            <div key={asset.title} className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-primary mb-4 text-3xl group-hover:scale-110 transition-transform">{asset.icon}</span>
              <h4 className="font-bold mb-1 font-headline">{asset.title}</h4>
              <p className="text-xs text-on-surface-variant font-body">{asset.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
