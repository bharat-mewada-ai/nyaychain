import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const DEFAULT_USER = {
  name: 'Alex Sovereign',
  email: 'alex@nyaychain.gov',
  role: 'Registry Admin',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6qdPbG_InS8YZ8ReSobLSntaILALlZA2lOdfXlgXsvtjTUBpBMJfpg9YtHDHmpWP8s-XGKIr5ywL_abCOIcmH_6UcAZvJUwLQ0EXj2tjbgA9KmP0EiBJBe6RFyYfr0i3CvMgoFFI7ojSseQe0kgpLJMorqsgor-iGRocpLEOnRVGxsPhAreRfyPHZjQYDqWWpiT6Pf5X9nmrdvn__koHfqRcrluSmN_7cS1McInU0HQgEUNVssdhVcuV-fknbwR2ir_Mvl_pIJZ3S',
};

const DEFAULT_SETTINGS = {
  animatedBackground: true,
  compactMode: false,
  notificationSound: true,
  autoAnalysis: false,
  darkMode: false,
  language: 'en',
  currency: 'INR',
};

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'High risk detected on MH-MUM-2024-00891', time: '2m ago', type: 'alert', read: false, timestamp: Date.now() - 120000 },
  { id: 2, text: 'Transfer #TXN-4821 approved by registrar', time: '1h ago', type: 'success', read: false, timestamp: Date.now() - 3600000 },
  { id: 3, text: 'New property registered: GJ-AMD-2024-00455', time: '3h ago', type: 'info', read: false, timestamp: Date.now() - 10800000 },
  { id: 4, text: 'Document verification complete for KA-BLR-2023-05521', time: '5h ago', type: 'success', read: true, timestamp: Date.now() - 18000000 },
  { id: 5, text: 'System maintenance scheduled for tonight', time: '8h ago', type: 'info', read: true, timestamp: Date.now() - 28800000 },
  { id: 6, text: 'Suspicious activity flagged: rapid transfers on SG Highway properties', time: '12h ago', type: 'alert', read: true, timestamp: Date.now() - 43200000 },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nyaychain_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('nyaychain_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('nyaychain_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Persist to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('nyaychain_user', JSON.stringify(user));
    else localStorage.removeItem('nyaychain_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nyaychain_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('nyaychain_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = (email, password, name) => {
    const userData = {
      ...DEFAULT_USER,
      email: email,
      name: name || email.split('@')[0],
    };
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nyaychain_user');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      timestamp: Date.now(),
      read: false,
      ...notification,
    }, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      updateProfile,
      settings,
      updateSettings,
      notifications,
      unreadCount,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
