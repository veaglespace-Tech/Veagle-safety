import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/index.js';
import { fetchUser } from './store/slices/authSlice.js';

import { LandingPage } from './pages/LandingPage.jsx';
import { PricingPage } from './pages/PricingPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { GalleryPage } from './pages/GalleryPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { AdminLoginPage } from './pages/AdminLoginPage.jsx';

import { HomePage } from './pages/HomePage.jsx';
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
  const { token, isLoading } = useSelector((state) => state.auth);
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
  const { token, user, isLoading } = useSelector((state) => state.auth);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-plum-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!token) return <Navigate to="/admin/login" replace />;
  if (user?.role !== 'SUPER_ADMIN') return <Navigate to="/admin/login" replace />;
  return children;
};

const MainAppContent = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Public SOS Viewer */}
        <Route path="/track/:token" element={<LiveViewerPage />} />

        {/* Auth URLs */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin-auth" element={<Navigate to="/admin/login" replace />} />

        {/* Home Route (Dashboard if logged in, Landing if public) */}
        <Route
          path="/"
          element={token ? <ProtectedRoute><HomePage /></ProtectedRoute> : <LandingPage />}
        />

        {/* User Protected Routes */}
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

        {/* Super Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
};

export const App = () => {
  return (
    <Provider store={store}>
      <MainAppContent />
    </Provider>
  );
};

export default App;
