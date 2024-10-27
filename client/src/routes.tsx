import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/authService';
import { Shell } from './components/Shell/Shell';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';

const AppRoutes = () => (
  <Routes>
    {/* Unauthenticated routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Authenticated routes */}
    <Route
      element={isAuthenticated() ? <Shell /> : <Navigate to="/login" replace />}
    >
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    {/* Catch-all route */}
    <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />} />
  </Routes>
);

export default AppRoutes;
