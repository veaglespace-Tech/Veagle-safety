import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore.js';
import { HomePage } from './pages/HomePage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { OnboardingPage } from './pages/OnboardingPage.jsx';
import { TrackJourneyPage } from './pages/TrackJourneyPage.jsx';
import { ActiveSOSPage } from './pages/ActiveSOSPage.jsx';
import { LiveViewerPage } from './pages/LiveViewerPage.jsx';
import { ContactsPage } from './pages/ContactsPage.jsx';
import { EmergencyHelpPage } from './pages/EmergencyHelpPage.jsx';
import { AlarmPage } from './pages/AlarmPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-plum-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return token ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
  const { token, user, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-plum-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!token) return <Navigate to="/auth" replace />;
  if (user?.role !== 'SUPER_ADMIN') return <Navigate to="/" replace />;
  return children;
};

export const App = () => {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/track/:token" element={<LiveViewerPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track"
          element={
            <ProtectedRoute>
              <TrackJourneyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos/active"
          element={
            <ProtectedRoute>
              <ActiveSOSPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <EmergencyHelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alarm"
          element={
            <ProtectedRoute>
              <AlarmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
