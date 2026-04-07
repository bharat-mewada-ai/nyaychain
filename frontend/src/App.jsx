import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import PropertyDetail from './pages/PropertyDetail';
import TransferFlow from './pages/TransferFlow';
import DocumentUpload from './pages/DocumentUpload';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AnimatedBackground from './components/layout/AnimatedBackground';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const { settings } = useApp();
  
  return (
    <div className="flex min-h-screen relative overflow-hidden bg-background">
      {settings.animatedBackground && <AnimatedBackground />}
      <div className="flex h-screen w-full z-10 p-4 gap-4">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-y-auto relative border border-white/40">
          <TopBar />
          <div className="pt-8 px-8 pb-12 space-y-12">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/transfer" element={<TransferFlow />} />
              <Route path="/upload" element={<DocumentUpload />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { isLoggedIn } = useApp();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />
        } />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
