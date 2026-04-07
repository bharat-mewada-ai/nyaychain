import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TopBar() {
  const { user, notifications, unreadCount, markNotificationRead, logout } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setShowNotif(false);
    setShowProfile(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/property/')) return 'Property Details';
    if (location.pathname === '/transfer') return 'Ownership Transfer';
    if (location.pathname === '/upload') return 'Document Vault';
    if (location.pathname === '/settings') return 'Settings';
    if (location.pathname === '/profile') return 'Profile';
    if (location.pathname === '/notifications') return 'Notifications';
    return 'NyayChain';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-3xl flex justify-between items-center px-8 py-5 border-b border-white/60 font-headline rounded-t-[2.5rem]">
      <div className="flex items-center gap-8 flex-1">
        {/* Page title for mobile */}
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider hidden md:block lg:hidden">{getPageTitle()}</h2>
        <div className="relative w-full max-w-lg hidden lg:block">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
          <input 
            className="w-full bg-white/80 border border-zinc-200 shadow-sm rounded-full pl-14 pr-6 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm outline-none transition-all" 
            placeholder="Search Plot ID, Owner, or Region..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="p-2.5 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-14 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl shadow-black/10 animate-scale-in overflow-hidden z-50">
              <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
                <p className="font-bold text-sm">Notifications</p>
                <button
                  onClick={() => { setShowNotif(false); navigate('/notifications'); }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto no-scrollbar">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => { markNotificationRead(n.id); }}
                    className={`px-5 py-3.5 border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer ${!n.read ? 'bg-primary/[0.02]' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-none
                        ${n.type === 'alert' ? 'bg-red-400' : n.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? 'font-bold text-on-surface' : 'text-zinc-600'}`}>{n.text}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-none" />}
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length === 0 && (
                <div className="px-5 py-8 text-center text-zinc-400 text-sm">No notifications</div>
              )}
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          className={`p-2.5 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors ${location.pathname === '/settings' ? 'bg-primary/10 text-primary' : ''}`}
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="h-8 w-[1px] bg-zinc-200 mx-1"></div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-3 hover:bg-zinc-50 rounded-full pr-2 pl-1 py-1 transition-colors"
          >
            <img
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
              src={user?.avatar || 'https://i.pravatar.cc/150?u=admin'}
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-on-surface leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{user?.role || 'Admin'}</p>
            </div>
            <span className="material-symbols-outlined text-zinc-400 text-lg hidden sm:block">expand_more</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 w-56 bg-white border border-zinc-200 rounded-2xl shadow-2xl shadow-black/10 animate-scale-in overflow-hidden z-50">
              <div className="px-5 py-4 border-b border-zinc-100">
                <p className="font-bold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => { setShowProfile(false); navigate('/profile'); }}
                  className="w-full px-5 py-3 text-left text-sm hover:bg-zinc-50 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-zinc-500">person</span>
                  My Profile
                </button>
                <button
                  onClick={() => { setShowProfile(false); navigate('/settings'); }}
                  className="w-full px-5 py-3 text-left text-sm hover:bg-zinc-50 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-zinc-500">settings</span>
                  Settings
                </button>
                <button
                  onClick={() => { setShowProfile(false); navigate('/notifications'); }}
                  className="w-full px-5 py-3 text-left text-sm hover:bg-zinc-50 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-zinc-500">notifications</span>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
                  )}
                </button>
              </div>
              <div className="border-t border-zinc-100 py-2">
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full px-5 py-3 text-left text-sm hover:bg-red-50 text-error transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
