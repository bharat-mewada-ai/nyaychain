import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isGeminiConfigured } from '../services/geminiService';

export default function SettingsPage() {
  const { settings, updateSettings, user, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      title: 'Appearance',
      icon: 'palette',
      items: [
        {
          label: 'Animated Background',
          description: 'Enable subtle floating background animations',
          type: 'toggle',
          key: 'animatedBackground',
        },
        {
          label: 'Compact Mode',
          description: 'Use a denser layout with smaller spacing',
          type: 'toggle',
          key: 'compactMode',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: 'notifications_active',
      items: [
        {
          label: 'Sound Alerts',
          description: 'Play sound when new notifications arrive',
          type: 'toggle',
          key: 'notificationSound',
        },
      ],
    },
    {
      title: 'AI & Analysis',
      icon: 'psychology',
      items: [
        {
          label: 'Auto-Analysis',
          description: 'Automatically run AI analysis when viewing a property',
          type: 'toggle',
          key: 'autoAnalysis',
        },
      ],
    },
    {
      title: 'Regional',
      icon: 'language',
      items: [
        {
          label: 'Currency',
          description: 'Display currency for property values',
          type: 'select',
          key: 'currency',
          options: [
            { value: 'INR', label: '₹ INR (Indian Rupee)' },
            { value: 'USD', label: '$ USD (US Dollar)' },
            { value: 'EUR', label: '€ EUR (Euro)' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-10">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold font-label text-sm uppercase tracking-wider mb-6">
          <span className="material-symbols-outlined text-lg border border-outline-variant/30 rounded-full p-1">arrow_back</span> Back
        </button>
        <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-lg mt-2">Configure your NyayChain workspace preferences</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="bg-white rounded-2xl shadow-lg shadow-emerald-500/5 overflow-hidden border border-zinc-100"
          >
            <div className="px-8 py-5 bg-zinc-50/50 flex items-center gap-3 border-b border-zinc-100">
              <span className="material-symbols-outlined text-primary">{section.icon}</span>
              <h2 className="font-headline font-bold text-lg">{section.title}</h2>
            </div>
            <div className="divide-y divide-zinc-50">
              {section.items.map(item => (
                <div key={item.key} className="px-8 py-5 flex items-center justify-between gap-6 hover:bg-zinc-50/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-on-surface">{item.label}</p>
                    <p className="text-sm text-zinc-500 mt-0.5">{item.description}</p>
                  </div>
                  {item.type === 'toggle' && (
                    <button
                      onClick={() => updateSettings(item.key, !settings[item.key])}
                      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                        settings[item.key] ? 'bg-primary' : 'bg-zinc-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                          settings[item.key] ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                  {item.type === 'select' && (
                    <select
                      value={settings[item.key]}
                      onChange={e => updateSettings(item.key, e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {item.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}


        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg shadow-red-500/5 overflow-hidden border border-red-100"
        >
          <div className="px-8 py-5 bg-red-50/50 flex items-center gap-3 border-b border-red-100">
            <span className="material-symbols-outlined text-error">warning</span>
            <h2 className="font-headline font-bold text-lg text-error">Danger Zone</h2>
          </div>
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">Sign Out</p>
              <p className="text-sm text-zinc-500">Log out of your current session</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-6 py-3 border border-error/30 text-error font-bold rounded-xl hover:bg-error/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>

      {/* Success Toast */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Settings saved successfully
        </motion.div>
      )}
    </div>
  );
}
