import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Courts from './pages/Courts';
import CourtDetail from './pages/CourtDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingFlow from './pages/BookingFlow';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';

function LayoutShell() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');

  if (isDashboardRoute) {
    return (
      <main className="min-h-screen font-sans bg-neutral-50 text-neutral-900">
        <Routes>
          {/* Admin Protected Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Staff Protected Routes */}
          <Route 
            path="/staff/*" 
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-50 text-neutral-900">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courts" element={<Courts />} />
          <Route path="/courts/:id" element={<CourtDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Protected Routes */}
          <Route 
            path="/book/:id" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'staff']}>
                <BookingFlow />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment/:id" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'staff']}>
                <Payment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:id/success" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'staff']}>
                <BookingSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'staff']}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'staff']}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Error Routes */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <LayoutShell />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
