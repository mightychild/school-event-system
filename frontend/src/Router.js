import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import { getDashboardPath } from './utils/roleRedirects';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['superadmin', 'admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/student/dashboard" element={
          <ProtectedRoute roles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            {({ user }) => {
              if (!user) return <Navigate to="/login" replace />;
              const dashboardPath = getDashboardPath(user.role);
              return <Navigate to={dashboardPath} replace />;
            }}
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}