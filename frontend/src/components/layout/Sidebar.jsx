import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/transfer', icon: 'swap_horiz', label: 'Transfers' },
  { to: '/upload', icon: 'cloud_done', label: 'Document Vault' },
  { to: '/notifications', icon: 'notifications', label: 'Notifications' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { unreadCount } = useApp();

  return (
    <>
      <aside className="hidden md:flex h-full w-72 bg-white/60 backdrop-blur-2xl font-headline flex-col p-6 space-y-4 rounded-[2.5rem] border border-white/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
        <NavLink to="/" className="flex items-center gap-4 px-4 py-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-emerald-700 leading-none">NyayChain</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Sovereign Registry</span>
          </div>
        </NavLink>

        <nav className="flex-1 space-y-2 mt-8">
          {NAV_ITEMS.map(item => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={
                  isActive
                    ? "bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-4 px-6 py-4 transition-all group"
                    : "text-zinc-600 hover:bg-zinc-200 rounded-full flex items-center gap-4 px-6 py-4 transition-all hover:translate-x-1"
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-medium flex-1">{item.label}</span>
                {item.to === '/notifications' && unreadCount > 0 && (
                  <span className={`min-w-[20px] h-5 rounded-full text-[10px] font-bold flex items-center justify-center px-1.5 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary text-white'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-zinc-100">
          <NavLink
            to="/profile"
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-full transition-all ${
              location.pathname === '/profile'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-zinc-600 hover:bg-zinc-200 hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined">person</span>
            <span className="font-medium">My Profile</span>
          </NavLink>
          
          <button className="w-full py-4 px-6 mt-4 bg-surface-container-highest text-on-surface font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Record
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-zinc-100 flex justify-around items-center px-4 py-3 z-50">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-zinc-400'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Dash</span>
        </NavLink>
        <NavLink to="/transfer" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-zinc-400'}`}>
          <span className="material-symbols-outlined">swap_horiz</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Transfer</span>
        </NavLink>
        <div className="-mt-12">
          <NavLink to="/upload" className="w-14 h-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center">
            <span className="material-symbols-outlined">cloud_upload</span>
          </NavLink>
        </div>
        <NavLink to="/notifications" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-zinc-400'} relative`}>
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
          <span className="text-[10px] font-bold uppercase tracking-tighter">Alert</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-zinc-400'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">More</span>
        </NavLink>
      </nav>
    </>
  );
}
