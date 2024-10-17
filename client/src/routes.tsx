import { Routes, Route } from 'react-router-dom';
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
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
);

export default AppRoutes;
