import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: user?.phone || '',
    department: user?.department || 'Land Registry',
    jurisdiction: user?.jurisdiction || 'Maharashtra, India',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activityLog = [
    { action: 'Analyzed property MH-MUM-2024-00891', time: '10 min ago', icon: 'analytics', color: 'text-primary' },
    { action: 'Approved transfer #TXN-4821', time: '1 hour ago', icon: 'check_circle', color: 'text-emerald-500' },
    { action: 'Rejected transfer on GJ-AMD-2024-00455', time: '3 hours ago', icon: 'cancel', color: 'text-error' },
    { action: 'Viewed property KA-BLR-2023-05521', time: '5 hours ago', icon: 'visibility', color: 'text-secondary' },
    { action: 'Uploaded document: Title_Deed_2024.pdf', time: 'Yesterday', icon: 'upload_file', color: 'text-tertiary' },
    { action: 'Initiated system audit', time: '2 days ago', icon: 'security', color: 'text-primary' },
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-10">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold font-label text-sm uppercase tracking-wider mb-6">
          <span className="material-symbols-outlined text-lg border border-outline-variant/30 rounded-full p-1">arrow_back</span> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-xl shadow-emerald-500/5 overflow-hidden border border-zinc-100">
            <div className="h-32 bg-gradient-to-r from-primary to-primary-container relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
            </div>
            <div className="px-8 pb-8 -mt-16 relative">
              <img
                src={user?.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-xl object-cover"
              />
              <h2 className="text-2xl font-headline font-bold mt-4">{user?.name}</h2>
              <p className="text-sm text-zinc-500">{user?.email}</p>
              <div className="mt-3 flex gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {user?.role}
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                  Tier 3 Access
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-100 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Properties Managed</span>
                  <span className="font-bold">142</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Transfers Approved</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Analyses Run</span>
                  <span className="font-bold">256</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Member Since</span>
                  <span className="font-bold">Jan 2024</span>
                </div>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="w-full mt-6 py-3 bg-zinc-100 text-on-surface font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                {editing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Details / Edit Form + Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg shadow-emerald-500/5 border border-zinc-100"
          >
            <div className="px-8 py-5 bg-zinc-50/50 flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">badge</span>
                <h2 className="font-headline font-bold text-lg">Profile Details</h2>
              </div>
              {editing && (
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Changes
                </button>
              )}
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { key: 'name', label: 'Full Name', icon: 'person' },
                { key: 'email', label: 'Email', icon: 'mail' },
                { key: 'role', label: 'Role', icon: 'work' },
                { key: 'phone', label: 'Phone', icon: 'phone' },
                { key: 'department', label: 'Department', icon: 'corporate_fare' },
                { key: 'jurisdiction', label: 'Jurisdiction', icon: 'location_on' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{field.label}</label>
                  {editing ? (
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">{field.icon}</span>
                      <input
                        type="text"
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <p className="text-on-surface font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-zinc-400 text-lg">{field.icon}</span>
                      {form[field.key] || '—'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg shadow-emerald-500/5 border border-zinc-100"
          >
            <div className="px-8 py-5 bg-zinc-50/50 flex items-center gap-3 border-b border-zinc-100">
              <span className="material-symbols-outlined text-primary">history</span>
              <h2 className="font-headline font-bold text-lg">Recent Activity</h2>
            </div>
            <div className="divide-y divide-zinc-50">
              {activityLog.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="px-8 py-4 flex items-center gap-4 hover:bg-zinc-50/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center ${item.color}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{item.action}</p>
                    <p className="text-xs text-zinc-400">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Profile updated successfully
        </motion.div>
      )}
    </div>
  );
}
