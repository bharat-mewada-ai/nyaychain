import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, unreadCount } = useApp();
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return { icon: 'warning', bg: 'bg-red-100', color: 'text-error' };
      case 'success': return { icon: 'check_circle', bg: 'bg-emerald-100', color: 'text-emerald-600' };
      default: return { icon: 'info', bg: 'bg-blue-100', color: 'text-blue-600' };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-10">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold font-label text-sm uppercase tracking-wider mb-6">
          <span className="material-symbols-outlined text-lg border border-outline-variant/30 rounded-full p-1">arrow_back</span> Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight">Notifications</h1>
            <p className="text-zinc-500 text-lg mt-2">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">done_all</span>
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="px-5 py-2.5 border border-zinc-200 text-zinc-600 font-bold rounded-xl hover:bg-zinc-50 transition-colors text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg shadow-emerald-500/5 border border-zinc-100 p-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-zinc-400">notifications_off</span>
          </div>
          <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No Notifications</h3>
          <p className="text-zinc-500">You're all caught up! Check back later for updates.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => {
            const style = getIcon(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markNotificationRead(notif.id)}
                className={`bg-white rounded-xl shadow-sm border p-5 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group ${
                  !notif.read ? 'border-primary/20 bg-primary/[0.02]' : 'border-zinc-100'
                }`}
              >
                <div className={`w-11 h-11 rounded-full ${style.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${style.color}`}>{style.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!notif.read ? 'text-on-surface font-bold' : 'text-zinc-600'}`}>
                    {notif.text}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">{notif.time || formatTime(notif.timestamp)}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
