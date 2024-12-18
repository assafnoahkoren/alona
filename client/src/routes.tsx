import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell/Shell';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Login from './components/Login';
import NewPlan from './components/NewPlan/NewPlan';
import { useAuth } from './infra/auth-provider.tsx';
import { Admin } from './components/Admin.tsx';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Unauthenticated routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />

      {/* Authenticated routes */}
      <Route element={isAuthenticated ? <Shell /> : <Navigate to="/login" replace />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/new-plan" element={<NewPlan />} />
        <Route path="*" element={<Navigate to="/new-plan" replace />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={isAuthenticated && user?.isAdmin ? <Admin /> : <Navigate to="/" replace />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
};

export default AppRoutes;
