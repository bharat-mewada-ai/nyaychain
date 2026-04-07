import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeDocumentWithGemini, isGeminiConfigured } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { icon: 'foundation', title: 'Title Deeds', count: 142, desc: 'Registered Assets', color: 'primary', accent: 'bg-primary/10 text-primary' },
  { icon: 'verified', title: 'Tax Certificates', count: 89, desc: 'Compliance Verified', color: 'secondary', accent: 'bg-secondary/10 text-secondary' },
  { icon: 'gavel', title: 'Legal Gazettes', count: 34, desc: 'Legislative Docs', color: 'tertiary', accent: 'bg-tertiary/10 text-tertiary' },
  { icon: 'real_estate_agent', title: 'Mortgage Liens', count: 56, desc: 'Secured Interests', color: 'primary', accent: 'bg-primary/10 text-primary' },
  { icon: 'map', title: 'Survey Maps', count: 28, desc: 'GIS Data Files', color: 'secondary', accent: 'bg-secondary/10 text-secondary' },
  { icon: 'history_edu', title: 'Historical', count: 215, desc: 'Legacy Records', color: 'tertiary', accent: 'bg-tertiary/10 text-tertiary' },
];

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function DocumentUpload() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { addNotification } = useApp();

  const addFiles = (newFiles) => {
    const processed = Array.from(newFiles).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      analysis: null,
    }));

    setFiles(prev => [...processed, ...prev]);

    processed.forEach(f => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const success = Math.random() > 0.15;
          setFiles(prev => prev.map(pf =>
            pf.id === f.id ? { ...pf, status: success ? 'success' : 'error', progress: 100 } : pf
          ));

          if (success) {
            analyzeDocumentWithGemini(f.name).then(analysis => {
              setFiles(prev => prev.map(pf =>
                pf.id === f.id ? { ...pf, analysis } : pf
              ));
            });
            addNotification({
              text: `Document uploaded: ${f.name}`,
              time: 'Just now',
              type: 'success',
            });
          }
        } else {
          setFiles(prev => prev.map(pf =>
            pf.id === f.id ? { ...pf, progress: Math.min(progress, 95) } : pf
          ));
        }
      }, 300);
    });
  };

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  return (
    <div className="animate-fade-in space-y-12">
      {/* ───── Hero Header ───── */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
            Secure Institutional Repository
          </span>
          <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-none">
            Document Vault
          </h1>
          <p className="text-lg text-zinc-500 font-body leading-relaxed">
            Immutable storage for sovereign land assets. Every document is cryptographically hashed and anchored to the NyayChain Ledger.
            {isGeminiConfigured() && (
              <span className="text-primary font-medium"> AI-powered document analysis enabled.</span>
            )}
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <div className="bg-white px-5 py-3 rounded-full flex items-center gap-3 border border-zinc-100 shadow-sm">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-zinc-500">
              {files.filter(f => f.status === 'success').length} Verified
            </span>
          </div>
          <div className="bg-white px-5 py-3 rounded-full flex items-center gap-3 border border-zinc-100 shadow-sm">
            <span className="material-symbols-outlined text-primary text-lg">cloud_done</span>
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-zinc-500">
              564 Total
            </span>
          </div>
        </div>
      </section>

      {/* ───── Upload Zone + Stats Row ───── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Drop Zone — full width on the left */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-8 border-2 border-dashed rounded-2xl p-12 flex flex-col md:flex-row items-center gap-8 cursor-pointer transition-all group
            ${dragOver
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
              : 'border-zinc-200 bg-white hover:border-primary/40 hover:bg-emerald-50/30 hover:shadow-md'
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all
            ${dragOver ? 'bg-primary/15 text-primary scale-110' : 'bg-primary/5 text-primary group-hover:scale-105'}`}>
            <span className="material-symbols-outlined text-5xl">cloud_upload</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">
              {dragOver ? 'Release to Upload' : 'Upload New Document'}
            </h3>
            <p className="text-sm text-zinc-500 mb-4 max-w-md">
              Drag and drop files, or click to browse. Documents are automatically verified and anchored to the ledger.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
              <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all pointer-events-none text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">file_open</span>
                Browse Files
              </button>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                PDF · TIFF · JPG · PNG · SVG · CAD
              </span>
            </div>
          </div>
        </div>

        {/* Security Metrics — right side */}
        <div className="lg:col-span-4 bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <span className="text-sm font-bold uppercase tracking-widest">Vault Security</span>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400 text-sm">Node Consistency</span>
                  <span className="text-emerald-400 font-mono text-sm font-bold">100%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 w-full h-full rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400 text-sm">AI Engine</span>
                  <span className={`font-mono text-sm font-bold ${isGeminiConfigured() ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {isGeminiConfigured() ? 'Connected' : 'Offline'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${isGeminiConfigured() ? 'bg-emerald-400 w-full' : 'bg-yellow-400 w-1/3'}`} />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <span className="text-zinc-500 text-xs">Last Block Hash</span>
                <span className="text-zinc-500 font-mono text-xs">0x9e3b…f2a0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs">Encryption</span>
                <span className="text-zinc-500 font-mono text-xs">AES-256-GCM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Document Categories Grid ───── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Document Categories</h2>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">6 categories · 564 total documents</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-zinc-100 hover:border-primary/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group text-center"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.accent} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <h3 className="font-headline font-bold text-sm leading-tight">{cat.title}</h3>
              <p className="text-3xl font-headline font-bold text-on-surface mt-1">{cat.count}</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── Activity & Uploads ───── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Recent Uploads</h2>
          {files.length > 0 && (
            <button className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">history</span>
              View All Audit Logs
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-3xl text-zinc-400">inbox</span>
            </div>
            <h3 className="text-lg font-headline font-bold text-on-surface mb-1">No Recent Uploads</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              Upload a document using the zone above. Files are automatically verified and analyzed by AI.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-50/50 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <div className="col-span-5">Document</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">AI Analysis</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <AnimatePresence>
              {files.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-zinc-50/50 transition-colors
                    ${file.status === 'error' ? 'bg-error-container/5' : ''}`}
                >
                  {/* Document name + icon */}
                  <div className="col-span-5 flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center
                      ${file.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                        file.status === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-zinc-100 text-zinc-500'}`}>
                      <span className="material-symbols-outlined text-lg">
                        {file.type?.includes('image') ? 'image' : file.type?.includes('pdf') ? 'picture_as_pdf' : 'description'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-on-surface truncate">{file.name}</p>
                      {file.status === 'uploading' && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1 w-32 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }} />
                          </div>
                          <span className="text-[10px] text-zinc-500 font-bold">{Math.round(file.progress)}%</span>
                        </div>
                      )}
                      {file.status === 'success' && <p className="text-[11px] text-zinc-400">Validated by Ledger</p>}
                      {file.status === 'error' && <p className="text-[11px] text-error">Validation failed</p>}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="col-span-2 text-sm text-zinc-500 font-mono">
                    {formatFileSize(file.size)}
                  </div>

                  {/* AI Analysis */}
                  <div className="col-span-3">
                    {file.analysis ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          file.analysis.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {file.analysis.verified ? '✓ Verified' : '✗ Unverified'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {file.analysis.confidence}% conf.
                        </span>
                      </div>
                    ) : file.status === 'success' ? (
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <div className="w-3 h-3 border-2 border-zinc-300 border-t-primary rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1 text-center">
                    {file.status === 'success' && (
                      <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    {file.status === 'uploading' && (
                      <span className="material-symbols-outlined text-blue-500 animate-pulse">hourglass_top</span>
                    )}
                    {file.status === 'error' && (
                      <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    )}
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-zinc-300 hover:text-error transition-colors p-1 rounded-lg hover:bg-error/5"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Upload summary footer */}
            <div className="px-6 py-4 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-400 font-bold">
              <span>{files.length} document{files.length !== 1 ? 's' : ''} uploaded</span>
              <span>
                {files.filter(f => f.status === 'success').length} verified · {files.filter(f => f.status === 'uploading').length} pending · {files.filter(f => f.status === 'error').length} failed
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ───── Featured Banner ───── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-10 text-white relative overflow-hidden"
        >
          <div className="relative z-10 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
              AI-Powered
            </span>
            <h3 className="text-2xl font-headline font-bold">Automated Document Verification</h3>
            <p className="text-white/70 max-w-sm text-sm leading-relaxed">
              Every uploaded document is automatically scanned by our Gemini AI engine for authenticity, metadata extraction, and cross-reference verification against the IGRS database.
            </p>
            <div className="flex gap-8 pt-2">
              <div>
                <p className="text-2xl font-headline font-bold">98.7%</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-headline font-bold">&lt;3s</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Avg. Scan</p>
              </div>
              <div>
                <p className="text-2xl font-headline font-bold">12K+</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Docs Scanned</p>
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[180px] opacity-10">smart_toy</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-10 border border-zinc-100 shadow-sm"
        >
          <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            Upload Guidelines
          </h3>
          <div className="space-y-5">
            {[
              { icon: 'check_circle', text: 'Maximum file size: 25 MB per document', color: 'text-emerald-500' },
              { icon: 'check_circle', text: 'Supported formats: PDF, TIFF, JPG, PNG, SVG, DWG', color: 'text-emerald-500' },
              { icon: 'check_circle', text: 'Documents are encrypted with AES-256-GCM at rest', color: 'text-emerald-500' },
              { icon: 'check_circle', text: 'AI analysis starts automatically after validation', color: 'text-emerald-500' },
              { icon: 'warning', text: 'Scanned documents should be at least 300 DPI', color: 'text-amber-500' },
              { icon: 'info', text: 'Uploaded documents cannot be modified or deleted', color: 'text-blue-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`material-symbols-outlined text-lg ${item.color} flex-shrink-0 mt-0.5`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
                <span className="text-zinc-600">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
