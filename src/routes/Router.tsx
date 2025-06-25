import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import SalonPage from '../pages/SalonPage';
import BookingPage from '../pages/BookingPage';

import { useAuth } from "../context/AuthContext";

// Protects routes from unauthorized access
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Application router configuration
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/salons/:salonId" element={<SalonPage />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h2>404: Puslapis nerastas</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

