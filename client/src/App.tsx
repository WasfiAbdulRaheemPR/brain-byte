import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { CitizenLayout } from './layouts/CitizenLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './layouts/ProtectedRoute';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { TrackComplaintPage } from './pages/public/TrackComplaintPage';

// Citizen pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { SubmitComplaintPage } from './pages/citizen/SubmitComplaintPage';
import { MyComplaintsPage } from './pages/citizen/MyComplaintsPage';
import { ComplaintDetailPage } from './pages/citizen/ComplaintDetailPage';
import { CitizenProfilePage } from './pages/citizen/CitizenProfilePage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminComplaintDetailPage } from './pages/admin/AdminComplaintDetailPage';
import { AdminMapPage } from './pages/admin/AdminMapPage';
import { AdminDuplicatesPage } from './pages/admin/AdminDuplicatesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with standard Navbar and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/track" element={<TrackComplaintPage />} />
      </Route>

      {/* Citizen Portal (Protected for CITIZEN role) */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <CitizenLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/citizen/dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="submit" element={<SubmitComplaintPage />} />
        <Route path="complaints" element={<MyComplaintsPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="profile" element={<CitizenProfilePage />} />
      </Route>

      {/* Administrator Portal (Protected for ADMIN role) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaintsPage />} />
        <Route path="complaints/:id" element={<AdminComplaintDetailPage />} />
        <Route path="map" element={<AdminMapPage />} />
        <Route path="duplicates" element={<AdminDuplicatesPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;
