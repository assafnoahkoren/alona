import { Routes, Route } from 'react-router-dom';
import { isAuthenticated } from './services/authService';
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
    {isAuthenticated() ? (
      <>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </>
    ) : (
      <Route path="*" element={<Login />} />
    )}
  </Routes>
);

export default AppRoutes;
